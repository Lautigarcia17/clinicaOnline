import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adjustMonthNumber',
  standalone: true
})
export class AdjustMonthNumberPipe implements PipeTransform {

  transform(value: number): number {
    return value == 12 ? 1 : value + 1;
  }
}
