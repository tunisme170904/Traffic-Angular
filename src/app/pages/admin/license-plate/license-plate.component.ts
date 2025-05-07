import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LicensePlateService } from '../../../services/license-plate.service';
import Papa from 'papaparse';
import { FileUploadModule } from 'primeng/fileupload';

export interface LicensePlate {
    id?: string;
    number: string;
    type: 'oto' | 'xe máy' | 'xe máy điện';
    active: boolean;
    violations_count?: number;
    last_run_at?: string;
}

@Component({
    selector: 'app-license-plate',
    standalone: true,
    imports: [FileUploadModule, CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, InputTextModule, DialogModule, RadioButtonModule, ToastModule, ConfirmDialogModule],
    templateUrl: './license-plate.component.html',
    providers: [ConfirmationService, MessageService]
})
export class LicensePlateComponent implements OnInit {
    plates = signal<LicensePlate[]>([]);
    selectedPlates: LicensePlate[] = [];
    plateDialog: boolean = false;
    plate: LicensePlate = this.emptyPlate();
    submitted: boolean = false;

    search$ = new Subject<string>();

    @ViewChild('dt') dt!: Table;

    constructor(
        private licensePlateService: LicensePlateService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.licensePlateService.getPlates().subscribe((data) => this.plates.set(data));

        this.search$.pipe(debounceTime(300)).subscribe((query) => {
            this.licensePlateService.search(query).subscribe((results) => {
                this.plates.set(results);
            });
        });
    }

    emptyPlate(): LicensePlate {
        return {
            number: '',
            type: 'oto',
            active: true
        };
    }

    openNew() {
        this.plate = this.emptyPlate();
        this.submitted = false;
        this.plateDialog = true;
    }

    editPlate(plate: LicensePlate) {
        this.plate = { ...plate };
        this.plateDialog = true;
    }

    deletePlate(plate: LicensePlate) {
        this.confirmationService.confirm({
            message: `Bạn có chắc muốn xoá biển số ${plate.number}?`,
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.plates.set(this.plates().filter((p) => p !== plate));
                this.messageService.add({ severity: 'success', summary: 'Đã xoá', detail: 'Xoá thành công', life: 3000 });
            }
        });
    }

    deleteSelectedPlates() {
        this.confirmationService.confirm({
            message: 'Bạn có chắc muốn xoá các biển số đã chọn?',
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.plates.set(this.plates().filter((p) => !this.selectedPlates.includes(p)));
                this.selectedPlates = [];
                this.messageService.add({ severity: 'success', summary: 'Đã xoá', detail: 'Xoá nhiều thành công', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.plateDialog = false;
        this.submitted = false;
    }

    savePlate() {
        this.submitted = true;

        if (!this.plate.number.trim()) return;

        const plates = this.plates();
        const isDuplicate = plates.some(p => p.number === this.plate.number && p.id !== this.plate.id);
        if (isDuplicate) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Biển số đã tồn tại!',
                life: 3000
            });
            return;
        }

        if (this.plate.id) {
            const index = plates.findIndex((p) => p.id === this.plate.id);
            plates[index] = this.plate;
        } else {
            this.plate.id = this.generateId();
            plates.push(this.plate);
        }

        this.plates.set([...plates]);
        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: this.plate.id ? 'Đã cập nhật' : 'Đã tạo mới',
            life: 3000
        });

        this.plateDialog = false;
        this.plate = this.emptyPlate();
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (!value.trim()) {
            this.licensePlateService.getPlates().subscribe((data) => this.plates.set(data));
        } else {
            this.search$.next(value);
        }
    }

    onCSVUpload(event: any) {
        const file: File = event.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const currentPlates = this.plates();

                const newPlates = (result.data as any[])
                    .map((row) => ({
                        id: this.generateId(),
                        number: row['number']?.trim(),
                        type: row['type']?.trim(),
                        active: row['active']?.toLowerCase() === 'true',
                        violations_count: parseInt(row['violations_count'] || '0'),
                        last_run_at: row['last_run_at'] || new Date().toISOString()
                    }))
                    .filter((row) => !currentPlates.some(p => p.number === row.number));

                const merged = [...currentPlates, ...newPlates];
                this.plates.set(merged);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Đã upload',
                    detail: `${newPlates.length} biển số được thêm từ CSV`,
                    life: 3000
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi upload',
                    detail: 'Không thể đọc file CSV',
                    life: 3000
                });
            }
        });
    }

    generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}
