import { inject, Injectable, OnDestroy } from '@angular/core';
import { signal } from '@angular/core';
import { ModalService } from './modal.service';
import { UnsavedChangesModalComponent } from '../../shared/components/modals/unsaved-changes-modal/unsaved-changes-modal.component';

@Injectable({ providedIn: 'root' })
export class ChangeTrackingService implements OnDestroy {
  private modalService = inject(ModalService);

  readonly hasChanges = signal(false);

  constructor() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  private handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (this.hasChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  markAsChanged(): void {
    this.hasChanges.set(true);
  }

  reset(): void {
    this.hasChanges.set(false);
  }

  getChanges(): boolean {
    return this.hasChanges();
  }

  deployMessage(): Promise<boolean>{
    if(!this.getChanges()) return Promise.resolve(true);
    const modalRef = this.modalService.open(UnsavedChangesModalComponent);
    return modalRef.result
      .then((result) => result.data === true)
      .catch(() => false);
  }
}
