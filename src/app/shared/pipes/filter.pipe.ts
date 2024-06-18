import { Pipe, PipeTransform } from '@angular/core';
import { Shift } from '../../core/models/shift';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(shifts: Array<Shift>, search : string, profile : string): any {

    if(search !== ''){
      search = search.toLowerCase()
      if(profile == 'administrador' ){
        return shifts.filter(s => s.specialty.toLowerCase().includes(search) || s.specialist.toLowerCase().includes(search))
      }
      else if(profile == 'especialista'){
        return shifts.filter(s => s.specialty.toLowerCase().includes(search) || s.patient.toLowerCase().includes(search) || 
                             this.formatDate(s.date,search) || s.emailPatient.toLowerCase().includes(search) || s.stateShift.toLowerCase().includes(search))
      }
      else{
        return shifts.filter(s => 
          (s.specialty.toLowerCase().includes(search) ) ||
          (s.specialist.toLowerCase().includes(search)) ||
          (this.formatDate(s.date,search)) ||
          (s.emailSpecialist.toLowerCase().includes(search) ) ||
          (s.stateShift.toLowerCase().includes(search)) ||
          (s.diagnosis?.height?.toString().includes(search) ?? false) ||
          (s.diagnosis?.weight?.toString().includes(search) ?? false) ||
          (s.diagnosis?.temperature?.toString().includes(search) ?? false) ||
          (s.diagnosis?.pressure?.toString().includes(search) ?? false) ||
          (s.diagnosis?.principalDiagnosis?.toLowerCase().includes(search) ?? false) ||
          (s.diagnosis?.comment?.toLowerCase().includes(search) ?? false) ||
          (s.diagnosis?.medicationsOrPrecautions?.toLowerCase().includes(search) ?? false) ||
          (s.review?.toLowerCase().includes(search) ?? false)
        );
      }
    }
    

    return shifts;
  }

  private formatDate(date: Date, search : string): boolean {
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString(); 
    const year = date.getUTCFullYear();
    const hour = date.getHours()
    const minute = date.getMinutes()

    const dateString = `${day}/${month}/${year} ${hour}:${minute}`;

    return dateString.includes(search);
  }

}
