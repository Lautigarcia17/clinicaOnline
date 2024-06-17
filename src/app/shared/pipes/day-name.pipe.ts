import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayName',
  standalone: true
})
export class DayNamePipe implements PipeTransform {

  constructor(){}  
  transform(value: Date): string {
    
    const dateString = value.toLocaleString(); // Format the JavaScript Date using toLocaleString()
    const [datePart] = dateString.split(",");
    const [month,day,year] = datePart.split("/").map(Number);


    const newDate = new Date(year,month-1,day);
    const numberDay = newDate.getDay();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const currentDay = dayNames[numberDay];

    return currentDay;
  }
}
