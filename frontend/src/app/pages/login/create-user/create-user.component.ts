import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../../core/models/login-request.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  @Input() user!: LoginRequest;
  hidePassword = true;
  
  constructor(public activeModal: NgbActiveModal) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
