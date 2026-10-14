import { Pipe, PipeTransform } from '@angular/core';
import { DimensionValue } from '../../core/models/dimension.model';

@Pipe({
  name: 'formatDimension',
  standalone: true
})
export class FormatDimensionPipe implements PipeTransform {
  transform(dim?: DimensionValue | null): string {
    if (!dim || dim.unit === 'auto') return 'auto';
    return `${dim.value ?? 0}${dim.unit}`;
  }
}
