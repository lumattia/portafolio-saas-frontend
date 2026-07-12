import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';
import { IconComponent } from '../../icon/icon.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-generic-error-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TranslatePipe],
  templateUrl: './generic-error-modal.component.html',
  styleUrls: ['./generic-error-modal.component.css']
})
export class GenericErrorModalComponent {
  @Input() title = 'Confirmar';
  @Input() message = '¿Deseas continuar?';
  @Input() translateParams: any = {};
  @Input() type: 'error' | 'warning' | 'info' = 'error';
  
  // These will be injected by ModalService
  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  onConfirm(): void {
    this.close?.(true);
  }

  onCancel(): void {
    this.dismiss?.(false);
  }
}
