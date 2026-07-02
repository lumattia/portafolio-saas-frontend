import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselSectionContent, createDefaultCarouselSectionContent } from './carousel-section.model';
import { SectionDto } from '../../../../core/models/section.model';
import { RENDER_COMPONENT_MAP } from '../../../../core/constants/component-maps';
import { SectionRendererComponent } from '../../section-renderer/section-renderer.component';
import { BaseContainerRendererComponent } from '../base-container-renderer.component';

@Component({
  selector: 'app-carousel-section-render',
  standalone: true,
  imports: [CommonModule, SectionRendererComponent],
  templateUrl: './carousel-section-render.component.html',
  styleUrls: ['./carousel-section-render.component.scss'],
})
export class CarouselSectionRenderComponent extends BaseContainerRendererComponent {
  get content(): CarouselSectionContent {
    return createDefaultCarouselSectionContent(this.section()!.contentJson);
  }
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

  nextSlide(): void {
    event?.stopPropagation();
    if (this.currentSlideIndex < this.subSections.length - 1) {
      this.currentSlideIndex = this.currentSlideIndex + 1;
    } else {
      this.currentSlideIndex = 0;
    }
  }

  previousSlide(): void {
    event?.stopPropagation();
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex = this.currentSlideIndex - 1;
    } else {
      this.currentSlideIndex = this.subSections.length - 1;
    }
  }

  goToSlide(index: number): void {
    event?.stopPropagation();
    this.currentSlideIndex = index;
  }
}
