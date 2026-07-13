import { Directive, inject } from '@angular/core';
import { SidenavService } from '../../../core/services/sidenav.service';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { EDITOR_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { BaseSectionEditorComponent } from './base-section-editor.component';
import { SectionRenderer } from '../../../core/models/page.model';

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
  get currentSubSection(): SectionRenderer | null {
    return this.subSections[this.currentSubSectionIndex] || null;
  }
  addSubSection(): void {
    var sidenavRef = this.sidenavService.open(TemplateSelectorComponent);
    sidenavRef.componentInstance.parentSectionId = this.section().id;
    sidenavRef.result.then((res) => {
      if (res.confirmed && res.data) {
        this.section().subSections?.push(res.data as SectionRenderer)
        this.currentSubSectionIndex = this.subSections.length - 1;
      };
    });
  }

  removeSubSection(subSection: SectionRenderer): void { 
    if (subSection.isPublished) {
      subSection.isDeleted = !subSection.isDeleted;
    }else{
      this.section().subSections = this.section().subSections?.filter(s => s.id !== subSection.id);
    }
    this.currentSubSectionIndex = this.currentSubSectionIndex;
  }
}