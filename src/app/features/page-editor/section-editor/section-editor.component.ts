import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EDITOR_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { IconComponent } from "../../../shared/components/icon/icon.component";
import { SectionRenderer } from '../../../core/models/page.model';

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss'],
})
export class SectionEditorComponent {
  close!: () => void;
  dismiss!: (reason?: any) => void;

  section : SectionRenderer = {} as SectionRenderer;
  onSetDeleteState!: () => void;
  readonly editorMap = EDITOR_COMPONENT_MAP;

  get componentSelector(): string {
    return this.section.componentSelector;
  }
  get isDeleted() {
    return this.section.isDeleted;
  }
}
