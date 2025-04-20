import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Confirmation';
  @Input() message: string = 'Are you sure?';
  @Input() itemName: string = 'this item'; 
  @Input() item: any;
  @Input() confirmButtonText: string = 'Confirm';

  constructor(public modal: NgbActiveModal) {}
}
