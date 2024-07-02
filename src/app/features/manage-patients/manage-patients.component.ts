import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { GlobalDataService } from '../../core/services/global-data.service';
import { FirstCapitalLetterPipe } from '../../shared/pipes/first-capital-letter.pipe';
import { PatientClinicHistoryComponent } from '../table/patient-clinic-history/patient-clinic-history.component';
import { DatabaseService } from '../../core/services/database.service';
import { Shift } from '../../core/models/shift';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [FirstCapitalLetterPipe,PatientClinicHistoryComponent,CommonModule],
  templateUrl: './manage-patients.component.html',
  styleUrls: ['./manage-patients.component.css','../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None
})
export default class ManagePatientsComponent implements OnInit,OnDestroy{
  shiftSubscription! : Subscription;
  filteredShifts! : Array<any>;
  patientSelected : any;
  arrayShifts! : Array<Shift>;

  constructor(public globalData : GlobalDataService,private database : DatabaseService){
    this.filteredShifts = [];
  }

  ngOnInit(): void {
    this.shiftSubscription = this.database.getShifts()
    .subscribe( (shifts : Shift[]) =>{
      this.arrayShifts = shifts.filter( (item : any) => item.emailSpecialist === this.globalData.getCurrentUser().email && item.stateShift === 'completado');
      let emails = new Set()
      this.filteredShifts = this.arrayShifts.filter( (item:any) =>{
        if(emails.has(item.emailPatient)){
          return false;
        }
        else{
          emails.add(item.emailPatient);
          return true;
        }
      })
    })
  }

  chargeClinicHistory(email : string){
    this.database.getUser(email)
    .subscribe( (response : any) =>{
      this.patientSelected = response[0];
    })
  }

  getDateShifts(emailPatient : string) {

    let completedShifts = this.globalData.getShifts().filter( (shift : Shift) =>
        shift.emailSpecialist === this.globalData.getCurrentUser().email  && shift.emailPatient == emailPatient
    );

    completedShifts.sort((a : Shift, b : Shift) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if(completedShifts.length > 3)
    {
      completedShifts = completedShifts.slice(0, 3);
    }

    return completedShifts;
  }



  ngOnDestroy(): void {
    if(this.shiftSubscription){
      this.shiftSubscription.unsubscribe();
    }
  }

}
