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
      if(profile == 'administrador' || profile == 'paciente' ){
        return shifts.filter(s => s.specialty.toLowerCase().includes(search) || s.specialist.toLowerCase().includes(search))
      }
      else if(profile == 'especialista'){
        return shifts.filter(s => s.specialty.toLowerCase().includes(search) || s.patient.toLowerCase().includes(search))
      }
    }
    

    return shifts;
  }

}
