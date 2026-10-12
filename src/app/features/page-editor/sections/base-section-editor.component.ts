import { computed, Directive, input, model, ModelSignal } from '@angular/core';
import { BaseSectionComponent, BaseSectionContent } from './base-section.component';
import { notifySignal } from '../../../core/utils/notify-signal';
import { SectionRenderer } from '../../../core/models/page.model';

@Directive()
export abstract class BaseSectionEditorComponent<T extends BaseSectionContent = BaseSectionContent> extends BaseSectionComponent<T> {
  sectionSignal = model.required<ModelSignal<SectionRenderer>>({alias : "section"});
  get section(){
    return this.sectionSignal();
  }
  get content(): T {
    return this.section().contentJson as T;
  }
  onDelete = input<() => void>();
  protected notifySignal(){notifySignal(this.section)};
  deleteSection(): void {
    this.onDelete()?.();
  }
}
