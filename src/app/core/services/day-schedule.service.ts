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

  areEqualsDays(currentDays : Array<string>,workDays : Array<string>){ 
    if (currentDays.length !== workDays.length) {
      return false;
    }
    return currentDays.every((item: any) => workDays.indexOf(item) !== -1);
  }

  areEqualsHour(currentHours : {start : any; end : any}, start : Date, end : Date){ 

    currentHours.start = currentHours.start instanceof Date  ? currentHours.start : currentHours.start.toDate();
    currentHours.end = currentHours.end instanceof Date  ? currentHours.end : currentHours.end.toDate();


    return (currentHours.start.getHours() == start.getHours()  && currentHours.start.getMinutes() == start.getMinutes()) &&
           (currentHours.end.getHours() == end.getHours()  && currentHours.end.getMinutes() == end.getMinutes());
  }

  formatDate(date: Date): string {

    let month: number = date.getMonth() + 1;
    return date.getDate() + "/" + month + "/" + date.getFullYear();
  }

  formatDateTime(dateTime: Date): string {
    let formattedDateTime = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
    return formattedDateTime;
  }

}
