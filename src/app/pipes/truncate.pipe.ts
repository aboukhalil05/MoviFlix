import { Pipe, PipeTransform } from '@angular/core';

/** Custom pipe: truncates a string to a given max length and appends '…' */
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 80): string {
    if (!value) return '';
    return value.length <= maxLength ? value : value.substring(0, maxLength) + '…';
  }
}
