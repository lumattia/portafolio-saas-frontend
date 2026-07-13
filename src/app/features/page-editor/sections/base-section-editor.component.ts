import { Directive, input, output } from '@angular/core';
import { SectionRenderer } from '../../../core/models/page.model';

@Directive()
export abstract class BaseSectionEditorComponent {
  section = input.required<SectionRenderer>();
  onDelete = input<() => void>();
  abstract get content(): any;
  
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
}