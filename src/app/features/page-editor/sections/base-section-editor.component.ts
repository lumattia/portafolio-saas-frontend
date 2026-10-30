import { Directive, input } from '@angular/core';
import { BaseSectionComponent, BaseSectionContent } from './base-section.component';

@Directive()
export abstract class BaseSectionEditorComponent<T extends BaseSectionContent = BaseSectionContent> extends BaseSectionComponent<T> {
  onDelete = input<() => void>();
  deleteSection(): void {
    this.onDelete()?.();
  }
}
