import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselSectionContent, createDefaultCarouselSectionContent } from './carousel-section.model';
import { NumberInputComponent } from "../../../../shared/components/inputs/number-input/number-input.component";
import { BaseContainerEditorComponent } from '../base-container-editor.component';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { SubsectionSelectorComponent } from "../../subsection-selector/subsection-selector.component";
import { CollapsibleComponent } from "../../../../shared/components/collapsible/collapsible.component";

@Component({
  selector: 'app-carousel-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberInputComponent, ButtonComponent, SubsectionSelectorComponent, CollapsibleComponent],
  templateUrl: './carousel-section-editor.component.html',
  styleUrls: ['./carousel-section-editor.component.scss'],
})
export class CarouselSectionEditorComponent extends BaseContainerEditorComponent {
  get content(): CarouselSectionContent {
    return createDefaultCarouselSectionContent(this.section().contentJson);
  }
}
