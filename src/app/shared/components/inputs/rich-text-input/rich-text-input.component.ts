import { Component, input, output, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-rich-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './rich-text-input.component.html',
  styleUrls: ['./rich-text-input.component.scss'],
})
export class RichTextInputComponent implements AfterViewInit {
  value = input<string>('');
  valueChange = output<string>();
  placeholder = input<string>('Enter text...');
  readonly = input<boolean>(false);

  editorContent = '';

  readonly editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ]
  };

  constructor() {
    effect(() => {
      this.editorContent = this.value();
    });
  }

  ngAfterViewInit(): void {
    this.editorContent = this.value();
  }

  onContentChanged(content: string | null): void {
    const safeContent = content ?? '';
    this.editorContent = safeContent;
    this.valueChange.emit(safeContent);
  }
}
