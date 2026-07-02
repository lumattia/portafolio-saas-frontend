import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselSectionContent, createDefaultCarouselSectionContent } from './carousel-section.model';
import { SectionDto } from '../../../../core/models/section.model';
import { EDITOR_COMPONENT_MAP } from '../../../../core/constants/component-maps';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { TemplateSelectorComponent } from '../../template-selector/template-selector.component';
import { NumberInputComponent } from "../../../../shared/components/inputs/number-input/number-input.component";
import { BaseContainerEditorComponent } from '../base-container-editor.component';

@Component({
  selector: 'app-carousel-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberInputComponent],
  templateUrl: './carousel-section-editor.component.html',
  styleUrls: ['./carousel-section-editor.component.scss'],
})
export class CarouselSectionEditorComponent extends BaseContainerEditorComponent {
  get content(): CarouselSectionContent {
    return createDefaultCarouselSectionContent(this.section().contentJson);
  }

  duplicateSubSection(): void {
    const subSection = this.currentSubSection;
    const section = this.section();
    if (!subSection) return;
    // TODO: Add logic to duplicate sub-section
    console.log('Duplicate slide - needs sub-section duplication logic');
  }

  moveSlide(direction: 'up' | 'down'): void {
    const section = this.section()!;

    const currentIndex = this.currentSubSectionIndex;
    const subSections = [...this.subSections];
    
    if (direction === 'up' && currentIndex > 0) {
      [subSections[currentIndex], subSections[currentIndex - 1]] = [subSections[currentIndex - 1], subSections[currentIndex]];
      section.subSections = subSections;
      this.setCurrentSlideIndex(currentIndex - 1);
    } else if (direction === 'down' && currentIndex < subSections.length - 1) {
      [subSections[currentIndex], subSections[currentIndex + 1]] = [subSections[currentIndex + 1], subSections[currentIndex]];
      section.subSections = subSections;
      this.setCurrentSlideIndex(currentIndex + 1);
    }
  }

  setCurrentSlideIndex(index: number): void {
    if (this.currentSubSectionIndex == index) {
      index = -1;
    }
    this.currentSubSectionIndex = index;
  }
}
