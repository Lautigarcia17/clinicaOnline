import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalDataService } from '../../core/services/global-data.service';
import { FirstCapitalLetterPipe } from '../../shared/pipes/first-capital-letter.pipe';
import { PatientClinicHistoryComponent } from '../table/patient-clinic-history/patient-clinic-history.component';
import { DatabaseService } from '../../core/services/database.service';
import { Shift } from '../../core/models/shift';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [FirstCapitalLetterPipe,PatientClinicHistoryComponent],
  templateUrl: './manage-patients.component.html',
  styleUrl: './manage-patients.component.css'
})
export default class ManagePatientsComponent implements OnInit,OnDestroy{
  shiftSubscription! : Subscription;
  filteredShifts! : Array<any>;
  patientSelected : any;
  viewClinicHistory:boolean;

  constructor(public globalData : GlobalDataService,private database : DatabaseService){
    this.viewClinicHistory = false;
    this.filteredShifts = [];
  }

  ngOnInit(): void {

    this.shiftSubscription = this.database.getShifts()
    .subscribe( (shifts : Shift[]) =>{
      const arrayShifts = shifts.filter( (item : any) => item.emailSpecialist === this.globalData.getCurrentUser().email && item.stateShift === 'completado');

      let emails = new Set()
      this.filteredShifts = arrayShifts.filter( (item:any) =>{
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
    this.viewClinicHistory = true;

    this.database.getUser(email)
    .subscribe( (response : any) =>{
      this.patientSelected = response[0];
    })

  }

  back(){
    this.patientSelected = '';
    this.viewClinicHistory = false;
  }

  ngOnDestroy(): void {
    if(this.shiftSubscription){
      this.shiftSubscription.unsubscribe();
    }
  }

}
