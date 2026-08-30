import { Component, signal, AfterViewInit, ElementRef, NgZone, inject, Injector, effect, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-draggable-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './draggable-toolbar.component.html',
  styleUrls: ['./draggable-toolbar.component.css']
})
export class DraggableToolbarComponent implements AfterViewInit {
  readonly elementRef = inject(ElementRef);
  readonly ngZone = inject(NgZone);
  readonly injector = inject(Injector);

  readonly showToolbar = signal(true);
  readonly toolbarLeft = signal<number>(0);
  readonly toolbarTop = signal<number>(0);

  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialLeft = 0;
  private initialTop = 0;
  private animationFrameId: number | null = null;
  private dragListenersAttached = false;

  ngOnInit(){
    this.loadToolbarState();

    // Reconfigurar drag listeners cuando el toolbar se muestra/oculta
    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.showToolbar()) {
          setTimeout(() => this.setupDrag(), 0);
        } else {
          this.cleanupDrag();
        }
      });
    });
  }

  // LocalStorage
  ngAfterViewInit(): void {
    this.setInitialToolbarPosition();
  }

  private setInitialToolbarPosition(): void {
    const storedLeft = localStorage.getItem('toolbarLeft');
    const storedTop = localStorage.getItem('toolbarTop');

    if (storedLeft && storedTop) {
      this.toolbarLeft.set(parseInt(storedLeft, 10));
      this.toolbarTop.set(parseInt(storedTop, 10));
    } else {
      // Posición inicial por defecto
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      this.toolbarLeft.set(windowWidth / 2 - 150);
      this.toolbarTop.set(windowHeight - 80);
    }
  }

  private loadToolbarState(): void {
    const stored = localStorage.getItem('toolbarVisible');
    if (stored !== null) {
      this.showToolbar.set(stored === 'true');
    }
  }

  private saveToolbarState(): void {
    localStorage.setItem('toolbarVisible', this.showToolbar().toString());
    localStorage.setItem('toolbarLeft', this.toolbarLeft().toString());
    localStorage.setItem('toolbarTop', this.toolbarTop().toString());
  }

  // Listener
  private setupDrag(): void {
    const toolbar = this.elementRef.nativeElement.querySelector('.draggable-toolbar');
    if (!toolbar || this.dragListenersAttached) return;

    this.ngZone.runOutsideAngular(() => {
      toolbar.addEventListener('mousedown', this.onMouseDown.bind(this));
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    });
    this.dragListenersAttached = true;
  }

  private cleanupDrag(): void {
    if (!this.dragListenersAttached) return;

    const toolbar = this.elementRef.nativeElement.querySelector('.draggable-toolbar');
    if (toolbar) {
      toolbar.removeEventListener('mousedown', this.onMouseDown.bind(this));
    }
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.dragListenersAttached = false;
  }

  // Actions
  private onMouseDown(event: MouseEvent): void {
    // Don't start drag if clicking on a button
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.initialLeft = this.toolbarLeft();
    this.initialTop = this.toolbarTop();
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.animationFrameId = requestAnimationFrame(() => {
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;

      this.ngZone.run(() => {
        this.toolbarLeft.set(this.initialLeft + dx);
        this.toolbarTop.set(this.initialTop + dy);
      });
    });
  }

  private onMouseUp(): void {
    this.isDragging = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.saveToolbarState();
  }

  closeToolbar(): void {
    this.showToolbar.set(false);
    this.saveToolbarState();
  }

  openToolbar(): void {
    this.showToolbar.set(true);
    this.saveToolbarState();
  }
}
