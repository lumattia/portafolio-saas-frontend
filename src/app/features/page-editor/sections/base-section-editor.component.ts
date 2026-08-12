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

  onContentChange(path: string, value: any, targetSection?: SectionRenderer): void {
    const section = targetSection || this.section();
    const keys = path.split('.');
    const newContent = { ...section.contentJson };
    let current = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current[key] = current[key] ? { ...current[key] } : {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value ?? '';
    section.contentJson = newContent;
  }

  onFileChange(file: File): void {
    this.section().fileRequest = file;
    this.section().imageUrl = file.size > 0 ? URL.createObjectURL(file) : '';
  }
}
