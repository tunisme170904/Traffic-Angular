import { Routes } from '@angular/router';
import { LicensePlateComponent } from './license-plate/license-plate.component';
import { AuthGuard } from './guards/auth.guard';

export default [
    {
        path: 'license-plate',
        component: LicensePlateComponent,
        canActivate: [AuthGuard]
    }
] as Routes;
