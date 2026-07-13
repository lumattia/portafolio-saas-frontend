import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { createDefaultFlexLayoutSectionContent, FlexLayoutSectionContent } from './flex-layout-section.model';
import { BaseContainerEditorComponent } from '../base-container-editor.component';

@Component({
  selector: 'app-flex-layout-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './flex-layout-section-editor.component.html',
  styleUrls: ['./flex-layout-section-editor.component.scss'],
})
export class FlexLayoutSectionEditorComponent  extends BaseContainerEditorComponent {
  get content(): FlexLayoutSectionContent {
    return createDefaultFlexLayoutSectionContent(this.section()!.contentJson);
  }
}
