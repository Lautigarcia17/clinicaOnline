import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true
})
export class FormatTimePipe implements PipeTransform {

  transform(date: Date): string {
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours > 12 ? 'pm' : 'am';
    const strHours = ('0' + hours).slice(-2);
    
    return `${strHours}:${minutes} ${ampm}`;
  }

}
