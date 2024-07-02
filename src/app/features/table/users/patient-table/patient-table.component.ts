import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';
import { PatientClinicHistoryComponent } from '../../patient-clinic-history/patient-clinic-history.component';
import { GlobalDataService } from '../../../../core/services/global-data.service';
import { ExcelService } from '../../../../core/services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { Shift } from '../../../../core/models/shift';

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
  constructor(public globalData : GlobalDataService, private excel : ExcelService, private toastr : ToastrService){}

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

  dowloadShiftByUser(user : any){
    const filterShift = this.globalData.getShifts().filter( (shift : Shift) =>  shift.emailPatient == user.email)
    console.log(filterShift);
    this.excel.downloadShiftByUserExcel(filterShift);
    this.toastr.success("Pacientes descargados!","FELICIDADES!", {timeOut: 3000,progressBar: true,closeButton:true});

  }

}
