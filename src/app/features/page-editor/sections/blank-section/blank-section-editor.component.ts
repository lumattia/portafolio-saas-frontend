import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BaseSectionEditorComponent } from '../base-section-editor.component';
import { BlankSectionContent, createDefaultBlankSectionContent, HeightUnit, WidthUnit, clampValue, HEIGHT_UNIT_RANGES, WIDTH_UNIT_RANGES } from './blank-section.model';
import { SelectInputComponent } from "../../../../shared/components/inputs/select-input/select-input.component";
import { IdName } from '../../../../core/models/common.models';

@Component({
  selector: 'app-blank-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SelectInputComponent],
  templateUrl: './blank-section-editor.component.html',
  styleUrls: ['./blank-section-editor.component.scss'],
})
export class BlankSectionEditorComponent extends BaseSectionEditorComponent{
  readonly heightUnitOptions: IdName[] = [
    { id: 'px', name: 'px' },
    { id: 'rem', name: 'rem' },
    { id: 'em', name: 'em' },
    { id: '%', name: '%' },
    { id: 'vw', name: 'vw' },
    { id: 'auto', name: 'auto' }
  ];

  readonly widthUnitOptions: IdName[] = [
    { id: 'px', name: 'px' },
    { id: 'rem', name: 'rem' },
    { id: 'em', name: 'em' },
    { id: '%', name: '%' },
    { id: 'vw', name: 'vw' },
    { id: 'auto', name: 'auto' }
  ];

  heightValue: number = 0;
  widthValue: number = 0;

  constructor(private renderer: Renderer2) {
    super();
  }

  get content(): BlankSectionContent {
    return createDefaultBlankSectionContent(this.section().contentJson);
  }

  ngOnInit(): void {
    this.heightValue = this.content.styles.height.value;
    this.widthValue = this.content.styles.width.value;
  }

  onDimensionChange(dimension: 'height' | 'width', field: 'value' | 'unit', newValue: any, event?: Event): void {
    const currentDimension = this.content.styles[dimension];
    const updatedDimension = { ...currentDimension };

    if (field === 'value') {
      const clampedValue = clampValue(newValue, currentDimension.unit);
      updatedDimension.value = clampedValue;

      if (dimension === 'height') {
        this.heightValue = clampedValue;
      } else {
        this.widthValue = clampedValue;
      }

      if (event && event.target) {
        const inputElement = event.target as HTMLInputElement;
        this.renderer.setProperty(inputElement, 'value', clampedValue.toString());
      }
    } else {
      updatedDimension.unit = newValue as (HeightUnit | WidthUnit);
      const clampedValue = clampValue(currentDimension.value, updatedDimension.unit);
      updatedDimension.value = clampedValue;

      if (dimension === 'height') {
        this.heightValue = clampedValue;
      } else {
        this.widthValue = clampedValue;
      }
    }

    this.onContentChange(`styles.${dimension}`, updatedDimension);

    // Dispatch custom event to notify renderer
    window.dispatchEvent(new CustomEvent('blank-section-update', {
      detail: { sectionId: this.section().id }
    }));
  }

  getUnitRange(unit: string, dimension: 'height' | 'width'): { min: number; max: number } {
    if (dimension === 'height') {
      return HEIGHT_UNIT_RANGES[unit as HeightUnit] || { min: 0, max: 5000 };
    }
    return WIDTH_UNIT_RANGES[unit as WidthUnit] || { min: 0, max: 5000 };
  }
}
