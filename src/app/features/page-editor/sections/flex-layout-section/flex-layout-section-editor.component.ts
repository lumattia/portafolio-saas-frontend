import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FlexLayoutSectionContent } from './flex-layout-section.model';
import { BaseContainerEditorComponent } from '../base-container-editor.component';
import { CollapsibleComponent } from '../../../../shared/components/collapsible/collapsible.component';
import { SelectInputComponent } from "../../../../shared/components/inputs/select-input/select-input.component";
import { NumberInputComponent } from "../../../../shared/components/inputs/number-input/number-input.component";
import { IdName } from '../../../../core/models/common.models';
import { SubsectionSelectorComponent } from "../../subsection-selector/subsection-selector.component";

@Component({
  selector: 'app-flex-layout-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, CollapsibleComponent, SelectInputComponent, NumberInputComponent, SubsectionSelectorComponent],
  templateUrl: './flex-layout-section-editor.component.html',
  styleUrls: ['./flex-layout-section-editor.component.scss'],
})
export class FlexLayoutSectionEditorComponent  extends BaseContainerEditorComponent<FlexLayoutSectionContent> {
  readonly showStylePanel = signal(false);
  justifyContentOption: IdName[] = [
    {id:'flex-start', name:'Flex Start'},
    {id:'center',name:'Center'},
    {id:'flex-end',name:'Flex End'},
    {id:'space-between',name:'Space Between'},
    {id:'space-around',name:'Space Around'},
    {id:'space-evenly',name:'Space Evenly'}
  ]
  alignItemsOption: IdName[] = [
    {id:'flex-start', name:'Flex Start'},
    {id:'center',name:'Center'},
    {id:'flex-end',name:'Flex End'},
    {id:'stretch',name:'Stretch'},
  ]
}
