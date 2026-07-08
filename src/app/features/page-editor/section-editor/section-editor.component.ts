import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EDITOR_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SectionRenderer } from '../../../core/models/page.model';

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss'],
})
export class SectionEditorComponent {
  section = input.required<SectionRenderer>();
  onClose = output<void>();
  onSetDeleteState = output<boolean>();
  readonly editorMap = EDITOR_COMPONENT_MAP;

  get componentSelector(): string {
    return this.section().componentSelector;
  }
  get isDeleted() {
    return this.section().isDeleted;
  }

  close(): void {
    this.onClose.emit();
  }
  

  setDeletedState(isDelete: boolean): void {
    this.onSetDeleteState.emit(isDelete);
  }
}
