import { Directive, inject } from '@angular/core';
import { SidenavService } from '../../../core/services/sidenav.service';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { SectionDto } from '../../../core/models/section.model';
import { EDITOR_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { BaseSectionEditorComponent } from './base-section-editor.component';

@Directive()
export abstract class BaseContainerEditorComponent extends BaseSectionEditorComponent {
  protected readonly sidenavService = inject(SidenavService);
    
  readonly componentMap = EDITOR_COMPONENT_MAP;

  get subSections() {
    return this.section().subSections || [];
  }
  get hasSubSection(): boolean {
    return this.subSections.length > 0;
  };
  get currentSubSectionIndex(): number{
    return this.section().subSectionIndex??0;
  }
  set currentSubSectionIndex(index: number){
    if (index > this.subSections.length - 1) {
      index = this.subSections.length - 1;
    }
    this.section().subSectionIndex = index;
  }
  get currentSubSection(): SectionDto | null {
    return this.subSections[this.currentSubSectionIndex] || null;
  }
  addSubSection(): void {
    var sidenavRef = this.sidenavService.open(TemplateSelectorComponent);
    sidenavRef.result.then((res) => {
      if (res.confirmed && res.data) {
        let newSection = res.data as SectionDto;
        newSection.order = this.subSections.length;
        newSection.parentSectionId = this.section().id;
        this.section().subSections?.push(newSection)
        this.currentSubSectionIndex = this.subSections.length - 1;
      };
    });
  }

  removeSubSection(subSection: SectionDto): void { 
    if (subSection.isPublished) {
      subSection.isDeleted = true;
    }else{
      subSection.subSections = subSection.subSections.filter(s => s.id !== subSection.id);
    }
    this.currentSubSectionIndex = this.currentSubSectionIndex;
  }
}