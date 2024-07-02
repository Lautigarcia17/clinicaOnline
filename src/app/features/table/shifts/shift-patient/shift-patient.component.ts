import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';
import { CommonModule } from '@angular/common';
import { GlobalDataService } from '../../../../core/services/global-data.service';
import { Shift } from '../../../../core/models/shift';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { ColourStateDirective } from '../../../../shared/directives/colour-state.directive';

@Component({
  selector: 'app-shift-patient',
  standalone: true,
  imports: [FirstCapitalLetterPipe,CommonModule,ReactiveFormsModule,FilterPipe,ColourStateDirective],
  templateUrl: './shift-patient.component.html',
  styleUrl: './shift-patient.component.css'
})
export class ShiftPatientComponent {
  @Input() arrayShifts! : Array<Shift>;
  @Input() cancelFunction?: Function;
  @Input() searchFilter! : string;
  
  patientSelected? : any = [];
  
  constructor(public globalData : GlobalDataService, private fb : FormBuilder, private database : DatabaseService, private toastr : ToastrService){}



  formSurvey = this.fb.group({
    'experience': ["",[Validators.required]],
    'hygiene': ["",[Validators.required]],
    'comment': ['']
  })

  formQualification = this.fb.group({
    'qualification': ["",[Validators.required]]
  })


  cancelShift(idReview : number,idShift : number,emailSpecialist : string, scheduleShift : Date, currentState : string){
    if (this.cancelFunction) {
      this.cancelFunction(idReview,idShift,emailSpecialist,scheduleShift, currentState);
    }
  }

  sendSurvey(idShift : string){
    let experience = this.formSurvey.get('experience')?.value ?? '';
    let hygiene = this.formSurvey.get('hygiene')?.value ?? '';
    let comment : any = this.formSurvey.get('comment')?.value ?? '';
    
    this.database.saveSurvey(idShift,experience,hygiene,comment);
    this.toastr.success("La respuesta fue enviada","Felicidades!", {timeOut: 3000,progressBar: true,closeButton:true});
  }

  sendQualification(idShift : string){
    let qualification = this.formQualification.get('qualification')?.value ?? '';
    
    this.database.saveQualification(idShift,qualification);
    this.toastr.success("La calificacion fue enviada","Felicidades!", {timeOut: 3000,progressBar: true,closeButton:true});
  }






}
