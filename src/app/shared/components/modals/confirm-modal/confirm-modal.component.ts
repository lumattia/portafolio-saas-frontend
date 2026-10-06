import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ButtonComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  private translate = inject(TranslateService);

  title = input<string>('Confirmar');
  message = input<string>('¿Deseas continuar?');
  messageParams = input<Record<string, any>>({});

  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  translatedTitle = computed(() => this.translate.instant(this.title()));
  translatedMessage = computed(() =>
    this.translate.instant(this.message(), this.messageParams())
  );

  onConfirm(): void {
    this.close?.(true);
  }

  onCancel(): void {
    this.dismiss?.(false);
  }
}
