import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

export type ViewMode = 'admin' | 'snapshot' | null;

@Injectable({ providedIn: 'root' })
export class ViewModeService {
  private readonly auth = inject(AuthService);
  
  readonly viewMode = signal<ViewMode>(this.loadStoredViewMode());

  constructor() {
  }

  private loadStoredViewMode(): ViewMode {
    const stored = localStorage.getItem('viewMode');
    if (stored === 'admin' || stored === 'snapshot') {
      return stored;
    }
    return null;
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
    this.viewMode.set(mode);
    this.saveViewMode(mode);
  }

  isAdminMode(): boolean {
    return this.viewMode() === 'admin';
  }

  isSnapshotMode(): boolean {
    return this.viewMode() === 'snapshot';
  }
}
