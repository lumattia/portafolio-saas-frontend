import { Component, input, output, AfterViewInit, ElementRef, inject, signal, computed, Renderer2, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PopupPosition =
  | 'top'
  | 'top-right'
  | 'right-top'
  | 'right'
  | 'right-bottom'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left-bottom'
  | 'left'
  | 'left-top'
  | 'top-left';

export type PopupTrigger = 'hover' | 'click';
export type PopupVariant = 'default' | 'info';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements AfterViewInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  readonly showArrow = input<boolean>(true);
  readonly position = input<PopupPosition>('top');
  readonly trigger = input<PopupTrigger>('click');
  readonly closeOnClickOutside = input<boolean>(true);
  readonly variant = input<PopupVariant>('default');
  readonly disabled = input<boolean>(false);

  readonly onClose = output<void>();

  readonly isOpen = signal(false);

  private triggerElement: HTMLElement | null = null;
  private clickListener: (() => void) | null = null;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly positionClass = computed(() => {
    const pos = this.position();
    const variant = this.variant();
    return `popup-${pos} popup-${variant}`;
  });
  constructor() {
    // Escuchador reactivo: Activa/desactiva el listener en función de isOpen y closeOnClickOutside
    effect(() => {
      if (this.isOpen() && this.closeOnClickOutside()) {
        this.addClickListener();
      } else {
        this.removeClickListener();
      }
    });
  }
ngAfterViewInit(): void {
    this.findTriggerElement();
  }

  ngOnDestroy(): void {
    this.removeClickListener();
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
  }

  private findTriggerElement(): void {
    // Try to find trigger within this component's wrapper first
    let triggerElement = this.elementRef.nativeElement.querySelector('.popup-trigger-wrapper [popup-trigger]');

    // If not found, try to find any trigger within this component
    if (!triggerElement) {
      triggerElement = this.elementRef.nativeElement.querySelector('[popup-trigger]');
    }

    if (triggerElement) {
      this.triggerElement = triggerElement;
    }
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
  }

  open(): void {
    if (this.disabled()) return;
    this.isOpen.set(true);
  }
  private onClickOutside(target: EventTarget | null): void {
    const popupElement = this.elementRef.nativeElement;
    if (!popupElement.contains(target as Node) && this.triggerElement && !this.triggerElement.contains(target as Node)) {
      this.close();
    }
  }
  close(): void {
    this.isOpen.set(false);
    this.onClose.emit();
  }

  handleMouseEnter(): void {
    if (this.trigger() === 'hover') {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      this.open();
    }
  }

  handleMouseLeave(): void {
    if (this.trigger() === 'hover') {
      this.closeTimeout = setTimeout(() => {
        this.close();
        this.closeTimeout = null;
      }, 100);
    }
  }

  handlePopupClick(event: Event): void {
    event.stopPropagation();
  }

  handleClick(): void {
    if (this.trigger() === 'click') {
      this.toggle();
    }
  }
  private addClickListener(): void {
    if (this.clickListener) return;

    this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      this.onClickOutside(event.target);
    });
  }

  private removeClickListener(): void {
    if (this.clickListener) {
      this.clickListener(); // Invocar la función devuelta por Renderer2 desregistra el listener
      this.clickListener = null;
    }
  }
}
