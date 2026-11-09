import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdName, PagedParameters } from '../../../core/models/common.models';
import { SelectInputComponent } from '../../../shared/components/inputs/select-input/select-input.component';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { IconComponent } from "../../../shared/components/icon/icon.component";

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [CommonModule, SelectInputComponent, ButtonComponent, IconComponent],
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SortComponent {
  options = input<IdName[]>([]);
  value = model.required<PagedParameters>();
  onChange = output<void>();

  get sortIcon(): string {
    return this.value().isDescending ? 'sort-desc' : 'sort-asc';
  }

  onSortChanged(): void {
    this.value().isDescending = !this.value().isDescending;
    this.emit();
  }

  emit(){
    this.onChange.emit();
  }
}
