import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-generic-error-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslatePipe],
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss'],
})
export class MessageModalComponent {
  title = input<string>('Confirmar');
  message = input<string>('¿Deseas continuar?');
  translateParams = input<Record<string, any>>({});
  type = input<'error' | 'warning' | 'info'>('error');

  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  onConfirm(): void {
    this.close?.(true);
  }

  onCancel(): void {
    this.dismiss?.(false);
  }
}
