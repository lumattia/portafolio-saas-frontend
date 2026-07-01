import { Component, inject, computed, signal, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselSectionContent, createDefaultCarouselSectionContent } from './carousel-section.model';
import { SectionDto } from '../../../../core/models/section.model';
import { EDITOR_COMPONENT_MAP } from '../../../../core/constants/component-maps';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { TemplateSelectorComponent } from '../../template-selector/template-selector.component';

@Component({
  selector: 'app-carousel-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carousel-section-editor.component.html',
  styleUrls: ['./carousel-section-editor.component.scss'],
})
export class CarouselSectionEditorComponent {
  section = model.required<SectionDto>();

  private readonly sidenavService = inject(SidenavService);

  readonly componentMap = EDITOR_COMPONENT_MAP;

  get content(): CarouselSectionContent {
    return createDefaultCarouselSectionContent(this.section().contentJson);
  }

  get subSections(): SectionDto[] {
    return this.section()?.subSections || [];
  }

  get hasSlides(): boolean {
    return this.subSections.length > 0;
  };
  get currentSlideIndex(): number{
    return this.section().subSectionIndex??0;
  }
  set currentSlideIndex(index: number){
    if (index > this.subSections.length - 1) {
      index = this.subSections.length - 1;
    }
    this.section().subSectionIndex = index;
  }
  get currentSlide(): SectionDto | null {
    return this.subSections[this.currentSlideIndex] || null;
  }

 addSlide(): void {
    var sidenavRef = this.sidenavService.open(TemplateSelectorComponent);
    sidenavRef.result.then((res) => {
      if (res.confirmed && res.data) {
        let newSection = res.data as SectionDto;
        newSection.order = this.subSections.length;
        this.section().subSections?.push(newSection)
        this.setCurrentSlideIndex(this.subSections.length - 1)
      };
    });
  }

  removeSlide(): void {
    const slide = this.currentSlide;
    const section = this.section();
    if (!slide || !section) return;
    if (slide.isPublished) {
      slide.isDeleted = true;
    }else{
      section.subSections = section.subSections.filter(s => s.id !== slide.id);
    }
    this.setCurrentSlideIndex(this.currentSlideIndex);
  }

  duplicateSlide(): void {
    const slide = this.currentSlide;
    const section = this.section();
    if (!slide || !section) return;
    // TODO: Add logic to duplicate sub-section
    console.log('Duplicate slide - needs sub-section duplication logic');
  }

  moveSlide(direction: 'up' | 'down'): void {
    const section = this.section()!;

    const currentIndex = this.currentSlideIndex;
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
    this.currentSlideIndex = index;
  }
}
