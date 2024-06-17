import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDoubleZero',
  standalone: true
})
export class FormatDoubleZeroPipe implements PipeTransform {

  transform(value: number): string | number {
    let number : string | number = value;

    if(number == 0){
      number = "00";
    }

    return number;
  }

}
