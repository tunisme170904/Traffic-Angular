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

import { LICENSE_PLATES } from '../../mocks/license-plates.mock';

export interface LicensePlate {
  id?: string;
  number: string;
  type: 'oto' | 'xe máy';
  active: boolean;
  violations_count?: number;
  last_run_at?: string;
}

@Component({
  selector: 'app-license-plate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    RadioButtonModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './license-plate.component.html',
  providers: [ConfirmationService, MessageService]
})
export class LicensePlateComponent implements OnInit {
  plates = signal<LicensePlate[]>([]);
  selectedPlates: LicensePlate[] = [];
  plateDialog: boolean = false;
  plate: LicensePlate = this.emptyPlate();
  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.plates.set([...LICENSE_PLATES]);
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
        this.plates.set(this.plates().filter(p => p !== plate));
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
        this.plates.set(this.plates().filter(p => !this.selectedPlates.includes(p)));
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
    if (this.plate.id) {
      const index = plates.findIndex(p => p.id === this.plate.id);
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
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
