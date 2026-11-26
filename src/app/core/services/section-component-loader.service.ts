import { Injectable, signal, Type } from '@angular/core';
import { getSectionDefinition } from '../constants/component-maps';

type SectionComponentKind = 'render' | 'editor';

@Injectable({ providedIn: 'root' })
export class SectionComponentLoader {
  private readonly cache = new Map<string, Type<unknown>>();
  private readonly pending = new Set<string>();
  private readonly resolved = signal(0);

  componentFor(selector: string, kind: SectionComponentKind): Type<unknown> | null {
    this.resolved();
    const key = `${kind}:${selector}`;
    const cached = this.cache.get(key);
    if (cached) return cached;
    const load = kind === 'render'
      ? getSectionDefinition(selector)?.render
      : getSectionDefinition(selector)?.editor;
    if (!load || this.pending.has(key)) return null;
    this.pending.add(key);
    load()
      .then((component) => {
        this.cache.set(key, component);
        this.resolved.update((v) => v + 1);
      })
      .catch(() => {})
      .finally(() => this.pending.delete(key));
    return null;
  }
}
