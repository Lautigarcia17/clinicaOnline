import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';
import { PatientClinicHistoryComponent } from '../../patient-clinic-history/patient-clinic-history.component';
import { GlobalDataService } from '../../../../core/services/global-data.service';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [FirstCapitalLetterPipe,PatientClinicHistoryComponent],
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css','../../../manage-users/manage-users.component.css','../../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientTableComponent {
  @Input() users : any;
  constructor(public globalData : GlobalDataService){}

  verifyHistoryClinic(user : any){
    let hasHistoryClinic : boolean = false;
    for(let item of this.globalData.getShifts()){
      if (item.emailPatient === user.email && item.stateShift === 'completado') {
        hasHistoryClinic = true;
        break;
      }
    } 
    return hasHistoryClinic;
  }
}
