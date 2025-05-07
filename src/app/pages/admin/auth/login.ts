import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.html'
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;
    errorMessage: string = '';

    constructor(private router: Router) {}

    async login() {
        const emailValid = this.email.trim().toLowerCase() === 'admin';
        const passwordHashed = await this.hashPassword(this.password);
        const passwordValid = passwordHashed === '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'; // 123456

        if (emailValid && passwordValid) {
            localStorage.setItem('token', 'mock-jwt-token');
            this.router.navigate(['/admin/license-plate']);
        } else {
            this.errorMessage = 'Tài khoản hoặc mật khẩu không đúng!';
        }
    }

    async hashPassword(password: string): Promise<string> {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
}
