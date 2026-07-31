import { Directive, input } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';
import { FileInfoRequest } from '../../../core/models/common.models';

@Directive()
export abstract class BaseSectionEditorComponent {
  section = input.required<SectionRenderer>();
  onDelete = input<() => void>();
  abstract get content(): any;
  get imageUrl(){
    const req = this.section().fileRequest;
    if (req?.base64 != null) return req.base64;

    const file = this.section().file;
    if (file?.url) return file.url;
    return undefined;
  };
  deleteSection(): void {
    this.onDelete()?.();
  }

  onContentChange(path: string, value: any): void {
    const keys = path.split('.');

    const newContent = { ...this.section().contentJson };
    let current = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      current[key] = current[key] ? { ...current[key] } : {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value ?? '';

    this.section().contentJson = newContent;
  }
   onFileChange(fileRequest: FileInfoRequest): void {
    this.section().fileRequest = fileRequest;
  }
}
