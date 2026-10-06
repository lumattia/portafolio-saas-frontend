import { Component, OnInit, input, model, computed, effect, HostListener, inject, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IdName } from '../../../../core/models/common.models';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent implements OnInit {
  private translateService = inject(TranslateService);
  private elementRef = inject(ElementRef);

  value = model<any>(null);

  labelKey = input<string>('');
  placeholderKey = input<string>('');
  controlInput = input<FormControl | null>(null, { alias: 'control' });
  options = input<IdName[]>([]);
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  errorKey = input<string>('');
  showSearch = input<boolean>(true);
  showDirtyIndicator = input<boolean>(false);
  showClearButton = input<boolean>(true);

  control!: FormControl;

  isDropdownOpen = signal(false);
  searchTerm = signal('');

  private readonly validators = computed(() => {
    return this.required() ? [Validators.required] : [];
  });

  translatedOptions = computed(() => {
    return this.options().map((opt) => ({
      ...opt,
      name: this.translateService.instant(opt.name || ''),
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
      if (!opt.name) return false;
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

  constructor() {
    effect(() => {
      if (this.control) {
        this.control.setValidators(this.validators());
        this.control.updateValueAndValidity({ emitEvent: false });
      }
    });

    effect(() => {
      const newVal = this.value();
      if (this.control && newVal !== this.control.value) {
        this.control.setValue(newVal, { emitEvent: false });
      }
    });

    effect(() => {
      if (this.control) {
        if (this.disabled() && this.control.enabled) {
          this.control.disable({ emitEvent: false });
        } else if (!this.disabled() && this.control.disabled) {
          this.control.enable({ emitEvent: false });
        }
      }
    });
  }

  ngOnInit(): void {
    this.control = this.controlInput() ?? new FormControl(this.value(), this.validators());

    this.control.valueChanges.subscribe((val: any) => {
      if (val !== this.value()) {
        this.value.set(val);
      }
    });
  }

  get isDirty(): boolean {
    return this.showDirtyIndicator() && !!this.control?.dirty;
  }

  get shouldShowError(): boolean {
    if (!this.control) return false;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get errorMessage(): { key: string; params?: any } | null {
    if (!this.control || !this.shouldShowError) return null;

    if (this.control.hasError('required')) {
      return { key: this.errorKey() || 'validation.required' };
    }

    return { key: this.errorKey() || 'validation.invalid' };
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

  selectOption(option: IdName): void {
    const newValue = option.id;
    this.control.setValue(newValue);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.value.set(newValue);
    this.closeDropdown();
  }

  onSearchInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.searchTerm.set(inputEl.value);
  }

  clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.control.setValue(null);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.value.set(null);
  }
}
