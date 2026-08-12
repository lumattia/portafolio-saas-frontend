import { Directive } from '@angular/core';
import { BaseSectionEditorComponent } from './base-section-editor.component';
import { BaseSectionContent } from './base-section.component';

@Directive()
export abstract class BaseContainerEditorComponent<T extends BaseSectionContent = BaseSectionContent> extends BaseSectionEditorComponent<T> {
}
