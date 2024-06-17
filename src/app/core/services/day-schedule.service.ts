import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DayScheduleService {

  constructor() {}

  getNameDay(date : Date) : string{
    const daysOfWeek: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const dayIndex: number = date.getDay();
    return daysOfWeek[dayIndex];
  }

  isScheduleAvailable(date : Date, shiftsSpecialist : any){
    let available = true;

    for (let index = 0; index < shiftsSpecialist.shifts.length; index++) {
      const reservedShifts = new Date(shiftsSpecialist.shifts[index].seconds * 1000); 
      if (this.isEqualSchedule(reservedShifts,date)) {
        available = false;
        break;
      }
    }
    
    return available
  }

  isEqualSchedule(dateOne : Date, dateTwo : Date) : boolean{
    return dateOne.getFullYear() == dateTwo.getFullYear()  && dateOne.getMonth() == dateTwo.getMonth() && dateOne.getDay() == dateTwo.getDay() && 
          dateOne.getHours() == dateTwo.getHours() &&  dateOne.getMinutes() == dateTwo.getMinutes();
  }

}
