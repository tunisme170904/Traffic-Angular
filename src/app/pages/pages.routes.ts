import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { LicensePlateComponent } from './license-plate/license-plate.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },

    { path: 'license-plate', component: LicensePlateComponent },
    
    { path: '**', redirectTo: '/notfound' }
] as Routes;
