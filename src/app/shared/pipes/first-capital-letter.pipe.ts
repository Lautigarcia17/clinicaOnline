import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCapitalLetter',
  standalone: true
})
export class FirstCapitalLetterPipe implements PipeTransform {

  transform(value: string): string {
    let word = value.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1);

    return word;
  }
}
