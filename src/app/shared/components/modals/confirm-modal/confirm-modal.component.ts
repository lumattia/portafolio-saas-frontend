import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ButtonComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() title = 'Confirmar';
  @Input() message = '¿Deseas continuar?';
  @Input() messageParams: any = {};
  
  // These will be injected by ModalService
  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  translatedTitle = '';
  translatedMessage = '';

  constructor(private cdr: ChangeDetectorRef, private translate: TranslateService) {}

  ngOnChanges() {
    this.translateText();
    this.cdr.detectChanges();
  }

  private translateText() {
    this.translatedTitle = this.translate.instant(this.title);
    this.translatedMessage = this.translate.instant(this.message, this.messageParams);
  }

  onConfirm(): void {
    this.close?.(true);
  }

  onCancel(): void {
    this.dismiss?.(false);
  }
}
