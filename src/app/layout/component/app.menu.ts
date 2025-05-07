import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private router: Router) {}
    
    ngOnInit() {
        this.model = [
            {
                label: 'Trang chính',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    }
                ]
            },
            {
                label: 'Quản lý',
                icon: 'pi pi-fw pi-database',
                items: [
                    {
                        label: 'Biển số',
                        icon: 'pi pi-car',
                        routerLink: ['/admin/license-plate']
                    }
                ]
            },
            {
                label: 'Hệ thống',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Đăng xuất',
                        icon: 'pi pi-sign-out',
                        command: () => this.logout()
                    }
                ]
            }
        ];
    }    

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
    }
}
