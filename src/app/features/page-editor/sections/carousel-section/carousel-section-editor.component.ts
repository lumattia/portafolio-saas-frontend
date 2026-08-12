import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { DimensionInputComponent } from "../../../../shared/components/dimension-input/dimension-input.component";
import { SubsectionSelectorComponent } from "../../subsection-selector/subsection-selector.component";
import { CollapsibleComponent } from '../../../../shared/components/collapsible/collapsible.component';
import { BaseContainerEditorComponent } from '../base-container-editor.component';
import { CarouselSectionContent } from './carousel-section.model';

@Component({
  selector: 'app-carousel-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SubsectionSelectorComponent, CollapsibleComponent, DimensionInputComponent],
  templateUrl: './carousel-section-editor.component.html',
  styleUrls: ['./carousel-section-editor.component.scss'],
})
export class CarouselSectionEditorComponent extends BaseContainerEditorComponent<CarouselSectionContent> {
}
