import { Directive, input } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';

@Directive()
export abstract class BaseSectionEditorComponent {
  section = input.required<SectionRenderer>();
  onDelete = input<() => void>();
  abstract get content(): any;
  get imageUrl(){
    const req = this.section().imageUrl;
    if (req != null) return req;

    const file = this.section().file;
    if (file?.url) return file.url;
    return undefined;
  };
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
