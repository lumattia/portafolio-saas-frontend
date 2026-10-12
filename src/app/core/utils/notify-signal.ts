import { WritableSignal } from '@angular/core';

/**
 * Creates a shallow copy of the signal's object to give it a new
 * memory reference, instantly triggering computed() and change detection.
 */
export function notifySignal<T extends object>(signal: WritableSignal<T>): void {
  signal.update((s) => ({ ...s }));
}
