import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { SectionRenderer } from '../../../core/models/page.model';
import { SectionComponentLoader } from '../../../core/services/section-component-loader.service';

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss'],
})
export class SectionEditorComponent {
  private readonly componentLoader = inject(SectionComponentLoader);
  close!: () => void;
  dismiss!: (reason?: any) => void;
  section = input.required<SectionRenderer>();
  onSetDeleteState = output<void>();

  get componentType() {
    return this.componentLoader.componentFor(this.componentSelector, 'editor');
  }
  get componentSelector(): string {
    return this.section().componentSelector;
  }
  get isDeleted() {
    return this.section().isDeleted;
  }
  triggerDelete(): void {
    this.onSetDeleteState.emit();
  }
}
