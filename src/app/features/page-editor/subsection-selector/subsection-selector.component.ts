import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SectionRenderer } from '../../../core/models/page.model';
import { SidenavService } from '../../../core/services/sidenav.service';
import { TemplateSelectorComponent } from '../template-selector/template-selector.component';
import { EDITOR_COMPONENT_MAP } from '../../../core/constants/component-maps';
import { IconComponent } from "../../../shared/components/icon/icon.component";

@Component({
  selector: 'app-subsection-selector',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './subsection-selector.component.html',
  styleUrls: ['./subsection-selector.component.scss'],
})
export class SubsectionSelectorComponent {
  protected readonly sidenavService = inject(SidenavService);
  section = input.required<SectionRenderer>();
  readonly componentMap = EDITOR_COMPONENT_MAP;
  addingSection = false;
  get subSections() {
    return this.section().subSections || [];
  }
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
  selectSubsection(index: number): void {
    if (this.currentSubSectionIndex == index) {
      index = -1;
    }
    this.currentSubSectionIndex = index;
  }
  addSubSection(): void {
    if(this.addingSection) return;
    this.addingSection = true;
    var sidenavRef = this.sidenavService.open(TemplateSelectorComponent);
    sidenavRef.componentInstance.parentSectionId = this.section().id;
    sidenavRef.result.then((res) => {
      if (res.confirmed && res.data) {
        this.section().subSections?.push(res.data as SectionRenderer)
        this.currentSubSectionIndex = this.subSections.length - 1;
      };
      this.addingSection = false;
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
