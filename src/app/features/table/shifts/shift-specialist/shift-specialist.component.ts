import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { DatabaseService } from '../../../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';
import { GlobalDataService } from '../../../../core/services/global-data.service';
import { Shift } from '../../../../core/models/shift';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-shift-specialist',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FirstCapitalLetterPipe,FilterPipe],
  templateUrl: './shift-specialist.component.html',
  styleUrl: './shift-specialist.component.css'
})
export class ShiftSpecialistComponent {
  @Input() arrayShifts! : Array<Shift>;
  @Input() cancelFunction?: Function;
  @Input() searchFilter! : string;

  patientSelected? : any = [];

  constructor(private fb : FormBuilder ,public localStorage : LocalStorageService,private database : DatabaseService, private toastr : ToastrService,public globalData : GlobalDataService){}

  formDiagnosis = this.fb.group({
    'principalDiagnosis': ["",[Validators.required]],
    'medicationsOrPrecautions': ["",[Validators.required]],
    'comment': ["",[Validators.required]],
    'height' : ["",[Validators.required,Validators.min(50),Validators.max(300)]],
    'weight' : ["",[Validators.required,Validators.min(1),Validators.max(500)]],
    'temperature' : ["",[Validators.required,Validators.min(25),Validators.max(50)]],
    'pressure' : ["",[Validators.required,Validators.min(40),Validators.max(200)]],
  })

  cancelShift(idReview : number,idShift : number,emailSpecialist : string, scheduleShift : Date, currentState : string){
    if (this.cancelFunction) {
      this.cancelFunction(idReview,idShift,emailSpecialist,scheduleShift, currentState);
    }
  }

  acceptShift(idShift : string){
    this.database.updateStateShift(idShift,'aceptado');
  }

  chargePatient(email : string){
    this.database.getUser(email)
    .subscribe( response =>{
      this.patientSelected = response;
    })
  }

  sendDiagnosis(idShift : string, emailSpecialist : string , scheduleShift : Date){
    let principalDiagnosis = this.formDiagnosis.get('principalDiagnosis')?.value ?? '';
    let medicationsOrPrecautions = this.formDiagnosis.get('medicationsOrPrecautions')?.value ?? '';
    let comment : any = this.formDiagnosis.get('comment')?.value ?? '';
    let height : any = this.formDiagnosis.get('height')?.value ?? '';
    let weight : any = this.formDiagnosis.get('weight')?.value ?? '';
    let temperature : any = this.formDiagnosis.get('temperature')?.value ?? '';
    let pressure : any = this.formDiagnosis.get('pressure')?.value ?? '';
    

    this.database.saveDiagnosis(idShift,principalDiagnosis,medicationsOrPrecautions,comment,height,weight,temperature,pressure);
    this.database.removeShiftInSpecialist(emailSpecialist,scheduleShift);
    this.database.updateStateShift(idShift,"completado");

    this.toastr.success("El diagnostico fue enviado","Felicitaciones!", {timeOut: 3000,progressBar: true,closeButton:true});
  }

}
