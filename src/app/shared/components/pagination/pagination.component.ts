import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { NumberInputComponent } from '../inputs/number-input/number-input.component';
import { PagedParameters } from '../../../core/models/common.models';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NumberInputComponent],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  page = input.required<PagedParameters>();
  readonly pageChanged = output<void>();
  get pageIndex(){
    return this.page().pageIndex;
  }
  get totalPages(){
    return this.page().totalPages;
  }
  onIndexChange(newValue: number | null): void {
    if (newValue !== null) {
      this.page().pageIndex = newValue;
    }
  }
  onSizeChange(newValue: number | null): void {
    if (newValue !== null) {
      this.page().pageSize = newValue;
    }
  }
  onPrevious(): void {
    if (this.pageIndex > 1) {
      this.page().pageIndex -= 1;
      this.emit()
    }
  }
  onNext(): void {
    if (this.pageIndex < this.totalPages) {
      this.page().pageIndex += 1;
      this.emit()
    }
  }
  emit(){
    this.pageChanged.emit()
  }
}
