import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { DimensionInputComponent } from "../../../../shared/components/dimension-input/dimension-input.component";
import { BaseSectionEditorComponent } from '../base-section-editor.component';
import { BlankSectionContent } from "./blank-section.model";

@Component({
  selector: 'app-blank-section-editor',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DimensionInputComponent],
  templateUrl: './blank-section-editor.component.html',
  styleUrls: ['./blank-section-editor.component.scss'],
})
export class BlankSectionEditorComponent extends BaseSectionEditorComponent<BlankSectionContent>{
}
