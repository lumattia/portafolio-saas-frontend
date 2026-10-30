import { Component, input, computed, HostListener, inject, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IdName } from '../../../../core/models/common.models';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent extends BaseInputComponent {
  private translateService = inject(TranslateService);
  private elementRef = inject(ElementRef);

  placeholderKey = input<string>('');
  options = input<IdName[]>([]);
  showSearch = input<boolean>(true);
  showClearButton = input<boolean>(true);

  isDropdownOpen = signal(false);
  searchTerm = signal('');

  protected override readonly validators = computed(() => {
    return this.required() ? [Validators.required] : [];
  });

  translatedOptions = computed(() => {
    return this.options().map((opt) => ({
      ...opt,
      name: this.translateService.instant(opt.name),
    }));
  });

  filteredOptions = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const optionsList = this.translatedOptions();
    if (!search) return optionsList;

    const normalizeText = (text: string) =>
      text ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

    const normalizedSearch = normalizeText(search);

    return optionsList.filter((opt) => {
      const normalizedOptionName = normalizeText(opt.name.toLowerCase());
      return normalizedOptionName.includes(normalizedSearch);
    });
  });

  selectedOptionName = computed(() => {
    const currentValue = this.value();
    if (currentValue === null || currentValue === undefined || currentValue === '') return '';
    const selectedOption = this.options().find((opt) => opt.id == currentValue);
    return selectedOption ? selectedOption.name : '';
  });

  get errorMessage(): { key: string; params?: any } | null {
    if (!this.shouldShowError) return null;

    if (this.control.hasError('required')) return { key: 'validation.required' };
    return { key: 'validation.invalid' };
  }

  get hasValue(): boolean {
    const val = this.value();
    return val !== null && val !== undefined && val !== '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isDropdownOpen()) return;
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen.set(false);
      this.searchTerm.set('');
    }
  }

  toggleDropdown(): void {
    if (!this.disabled() && !this.readonly()) {
      this.isDropdownOpen.update((open) => !open);
      this.searchTerm.set('');
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  override onValueChange(newValue: any): void {
    this.value.set(newValue);
    this.closeDropdown();
  }

  onSearchInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.searchTerm.set(inputEl.value);
  }

  clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.value.set(null);
  }
}
