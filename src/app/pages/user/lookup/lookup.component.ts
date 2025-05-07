import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { VIOLATIONS } from '../../../mocks/violations.mock';

@Component({
    selector: 'app-lookup',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
    templateUrl: './lookup.component.html',
    styleUrls: ['./lookup.component.scss']
})
export class LookupComponent {
    plate: string = '';
    vehicleType: string = 'oto';
    results: any[] = [];

    onLookup() {
        const query = this.plate.trim().toUpperCase();
        this.results = VIOLATIONS.filter(v => v.plate.toUpperCase() === query);
    }
}
