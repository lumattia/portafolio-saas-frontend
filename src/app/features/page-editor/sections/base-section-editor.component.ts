import { Directive, input } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';
import { BaseSectionComponent, BaseSectionContent } from './base-section.component';

@Directive()
export abstract class BaseSectionEditorComponent<T extends BaseSectionContent = BaseSectionContent> extends BaseSectionComponent<T> {
  override section = input.required<SectionRenderer>();
  onDelete = input<() => void>();
  get content(): T {
    return this.section().contentJson as T;
  }

  deleteSection(): void {
    this.onDelete()?.();
  }

  onFileChange(file: File): void {
    this.section().fileRequest = file;
    this.section().imageUrl = file.size > 0 ? URL.createObjectURL(file) : '';
  }
}
