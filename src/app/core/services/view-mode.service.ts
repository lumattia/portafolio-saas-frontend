import { Injectable, effect, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { ChangeTrackingService } from './change-tracking.service';
export const VIEW_MODES = ['draft', 'snapshot', 'published'] as const;
export type ViewMode = (typeof VIEW_MODES)[number] | null;

@Injectable({ providedIn: 'root' })
export class ViewModeService {
  private readonly auth = inject(AuthService);
  private readonly changeTrackingService = inject(ChangeTrackingService);

  readonly viewMode = signal<ViewMode>(this.loadStoredViewMode());
  readonly snapshotVersion = signal<number | null>(null);

 constructor() {
    effect(() => {
      if (!this.auth.user()) {
        this.setViewMode('published');
      }
    });
  }

  private loadStoredViewMode(): ViewMode {
    if (!this.auth.user()) return 'published';
    const stored = localStorage.getItem('viewMode');
    if (VIEW_MODES.includes(stored as any)) {
      return stored as ViewMode;
    }
    return 'snapshot';
  }

  setSnapshotVersion(version: number | null): void {
    this.snapshotVersion.set(version);
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
        this.viewMode.set('draft');
      } else {
        this.viewMode.set('published');
      }
    }
  }

  setViewMode(mode: ViewMode): void {
    if (this.isDraftMode()) {
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

  isDraftMode(): boolean {
    return this.viewMode() === 'draft';
  }

  isPublishedMode(): boolean {
    return this.viewMode() === 'published';
  }

  isSnapshotMode(): boolean {
    return this.viewMode() === 'snapshot';
  }
}
