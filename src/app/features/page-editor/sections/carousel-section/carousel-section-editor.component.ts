import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEditorService } from '../../../../core/services/page-editor.service';
import { CarouselSectionContent, createDefaultCarouselSectionContent } from './carousel-section.model';
import { SectionDto } from '../../../../core/models/section.model';
import { EDITOR_COMPONENT_MAP } from '../../../../core/constants/component-maps';

@Component({
  selector: 'app-carousel-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carousel-section-editor.component.html',
  styleUrls: ['./carousel-section-editor.component.scss'],
})
export class CarouselSectionEditorComponent {
  private readonly pageEditorService = inject(PageEditorService);

  readonly selectedSection = this.pageEditorService.selectedSection;
  readonly currentSlideIndex = signal(0);

  readonly componentMap = EDITOR_COMPONENT_MAP;

  get content(): CarouselSectionContent {
    return createDefaultCarouselSectionContent(this.selectedSection()!.contentJson);
  }

  get subSections(): SectionDto[] {
    const section = this.selectedSection();
    return section?.subSections || [];
  }

  readonly hasSlides = computed(() => {
    return this.subSections.length > 0;
  });

  readonly currentSlide = computed(() => {
    return this.subSections[this.currentSlideIndex()] || null;
  });

  addSlide(): void {
    const section = this.selectedSection();
    if (!section) return;
    this.pageEditorService.openTemplateSelector(section.id);
  }

  removeSlide(): void {
    const slide = this.currentSlide();
    const section = this.selectedSection();
    if (!slide || !section) return;
    this.pageEditorService.setDeletedState(true);
    this.currentSlideIndex.set(0);
  }

  duplicateSlide(): void {
    const slide = this.currentSlide();
    const section = this.selectedSection();
    if (!slide || !section) return;
    // TODO: Add logic to duplicate sub-section
    console.log('Duplicate slide - needs sub-section duplication logic');
  }

  moveSlide(direction: 'up' | 'down'): void {
    const section = this.selectedSection()!;

    const currentIndex = this.currentSlideIndex();
    const subSections = [...this.subSections];
    
    if (direction === 'up' && currentIndex > 0) {
      [subSections[currentIndex], subSections[currentIndex - 1]] = [subSections[currentIndex - 1], subSections[currentIndex]];
      this.pageEditorService.updateSectionContent({ ...section.contentJson, subSections });
      this.currentSlideIndex.set(currentIndex - 1);
    } else if (direction === 'down' && currentIndex < subSections.length - 1) {
      [subSections[currentIndex], subSections[currentIndex + 1]] = [subSections[currentIndex + 1], subSections[currentIndex]];
      this.pageEditorService.updateSectionContent({ ...section.contentJson, subSections });
      this.currentSlideIndex.set(currentIndex + 1);
    }
  }

  setCurrentSlideIndex(index: number): void {
    this.currentSlideIndex.set(index);
  }
}
