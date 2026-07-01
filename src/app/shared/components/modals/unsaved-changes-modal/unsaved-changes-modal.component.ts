import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-unsaved-changes-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ButtonComponent],
  templateUrl: './unsaved-changes-modal.component.html',
  styleUrls: ['./unsaved-changes-modal.component.css']
})
export class UnsavedChangesModalComponent {  
  // These will be injected by ModalService
  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  onStayClick(): void {
    this.close?.(false);
  }

  onLeaveClick(): void {
    this.close?.(true);
  }
}
