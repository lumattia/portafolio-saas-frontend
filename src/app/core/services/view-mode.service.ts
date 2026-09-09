import { Injectable, effect, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ChangeTrackingService } from './change-tracking.service';
export const VIEW_MODES = ['admin', 'preview', 'snapshot'] as const;
export type ViewMode = (typeof VIEW_MODES)[number] | null;

@Injectable({ providedIn: 'root' })
export class ViewModeService {
  private readonly auth = inject(AuthService);
  private readonly changeTrackingService = inject(ChangeTrackingService);

  readonly viewMode = signal<ViewMode>(this.loadStoredViewMode());

 constructor() {
    effect(() => {
      if (!this.auth.user()) {
        this.setViewMode('snapshot');
      }
    });
  }

  private loadStoredViewMode(): ViewMode {
    if (!this.auth.user()) return null;
    const stored = localStorage.getItem('viewMode');
    if (VIEW_MODES.includes(stored as any)) {
      return stored as ViewMode;
    }
    return 'snapshot';
  }

  private saveViewMode(mode: ViewMode): void {
    if (mode) {
      localStorage.setItem('viewMode', mode);
    } else {
      localStorage.removeItem('viewMode');
    }
  }

  initViewMode(): void {
    const stored = localStorage.getItem('viewMode');
    if (stored) {
      this.viewMode.set(stored as ViewMode);
    }else{
      if (this.auth.isAuthenticated()) {
        this.viewMode.set('admin');
      } else {
        this.viewMode.set('snapshot');
      }
    }
  }

  setViewMode(mode: ViewMode): void {
    if (this.isAdminMode()) {
      this.changeTrackingService.deployMessage().then((canChange) => {
        if (canChange) {
          this.changeTrackingService.reset();
          this.applyMode(mode);
        }
      });
      return;
    }
    this.applyMode(mode);
  }

  private applyMode(mode: ViewMode): void {
    this.viewMode.set(mode);
    this.saveViewMode(mode);
  }

  isAdminMode(): boolean {
    return this.viewMode() === 'admin';
  }
  isPreviewMode(): boolean {
    return this.viewMode() === 'preview';
  }

  isSnapshotMode(): boolean {
    return this.viewMode() === 'snapshot';
  }
}
