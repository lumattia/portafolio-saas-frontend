import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEditorService } from '../../../core/services/page-editor.service';
import { EDITOR_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss'],
})
export class SectionEditorComponent {
  private readonly pageEditorService = inject(PageEditorService);

  readonly selectedSection = this.pageEditorService.selectedSection;

  readonly editorMap = EDITOR_COMPONENT_MAP;

  get componentSelector(): string {
    return this.selectedSection()!.componentSelector;
  }
  get isDeleted() {
    return this.selectedSection()!.isDeleted;
  }

  close(): void {
    this.pageEditorService.deselectSection();
  }
  

  onSetDeletedState(event: Event, isDelete: boolean): void {
    event.stopPropagation();
    this.pageEditorService.setDeletedState(isDelete);
  }
}
