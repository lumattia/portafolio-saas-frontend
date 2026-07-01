import { Injectable, signal, computed, inject } from '@angular/core';
import {
  EditorState,
} from '../models/editor.models';
import { SectionTemplateService } from './section-template.service';
import { SectionDto } from '../models/section.model';

@Injectable({ providedIn: 'root' })
export class PageEditorService {
  private readonly sectionTemplateService = inject(SectionTemplateService);

  // Signals for state management
  private readonly sections = signal<SectionDto[]>([]);
  private readonly isTemplateSelectorOpen = signal(false);
  private readonly isEditorOpen = signal(false);
  private readonly parentSectionIdForNewSection = signal<string | null>(null);
  
  readonly selectedSection = signal<SectionDto | null>(null);
  
  readonly editorState = computed<EditorState>(() => ({
    sections: this.sections(),
    selectedSection: this.selectedSection(),
    isTemplateSelectorOpen: this.isTemplateSelectorOpen(),
    isEditorOpen: this.isEditorOpen(),
    currentSlideIndex: 0,
  }));

  // Actions
  loadSections(sections: SectionDto[]): void {
    this.sections.set(sections.map(s => ({
      ...s,
      contentJson: JSON.parse(s.contentJson)
    })));
  }

  async addSection(templateId: string): Promise<void> {
    const template = await this.sectionTemplateService.getById(templateId).toPromise();
    if (!template) {
      console.error(`Template not found for id: ${templateId}`);
      return;
    }
    const newSection: SectionDto = {
      id: crypto.randomUUID(),
      sectionTemplateId: templateId,
      componentSelector: template.componentSelector,
      contentJson: template.defaultContentJson,
      order: 0,
      isEnabled: true,
      isDeleted: false,
      subSections: []
    };

    const parentSectionId = this.parentSectionIdForNewSection();
    
    if (parentSectionId) {
      // Add to parent's subSections
      this.sections.update((current) => {
        const addToParent = (sections: SectionDto[]): SectionDto[] => {
          return sections.map(s => {
            if (s.id === parentSectionId) {
              return { ...s, subSections: [...s.subSections, newSection] };
            }
            if (s.subSections.length > 0) {
              return { ...s, subSections: addToParent(s.subSections) };
            }
            return s;
          });
        };
        return addToParent(current);
      });
    } else {
      // Add to root sections
      newSection.order = this.sections().length;
      this.sections.update((current) => [...current, newSection]);
    }

    this.selectSection(newSection);
    this.closeTemplateSelector();
    this.parentSectionIdForNewSection.set(null);
  }

  selectSection(section: SectionDto): void {
    this.selectedSection.set(section);
    this.isEditorOpen.set(true);
  }

  deselectSection(): void {
    this.selectedSection.set(null);
    this.isEditorOpen.set(false);
  }

  setDeletedState(isDeleted: boolean = false): void {
    var selectedSection = this.selectedSection();
    if (!selectedSection) return;
    selectedSection.isDeleted = isDeleted;
  }
  
  updateSectionContent(contentJson: any): void {
    var selectedSection = this.selectedSection();
    if (!selectedSection) return;
    selectedSection.contentJson = contentJson;
  }

  reorderSections(sectionIds: string[]): void {
    const sectionsMap = new Map(this.sections().map((s) => [s.id, s]));
    this.sections.set(
      sectionIds.map((id, index) => {
        const section = sectionsMap.get(id);
        return section ? { ...section, order: index } : section!;
      })
    );
  }

  // Template selector actions
  openTemplateSelector(parentSectionId?: string): void {
    this.parentSectionIdForNewSection.set(parentSectionId || null);
    this.isTemplateSelectorOpen.set(true);
  }

  closeTemplateSelector(): void {
    this.isTemplateSelectorOpen.set(false);
    this.parentSectionIdForNewSection.set(null);
  }

  getSectionsForSave(): SectionDto[] {
    return this.sections().map((s) => ({
      id: s.id,
      sectionTemplateId: s.sectionTemplateId,
      componentSelector: "", // used on get, not for save
      contentJson: JSON.stringify(s.contentJson),
      order: s.order,
      isEnabled: s.isEnabled,
      isDeleted: s.isDeleted,
      parentSectionId: s.parentSectionId,
      subSections: s.subSections,
    }));
  }
}
