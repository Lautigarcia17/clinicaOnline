import { Component} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { GlobalDataService } from './core/services/global-data.service';
import { Shift } from './core/models/shift';
import { KeyValuePipe } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{


  constructor(public globalData : GlobalDataService){}


}




/* 
shift: Shift = {
    id: '1',
    date: new Date(),
    diagnosis: {
      comment: '',
      height: '',
      pressure: '',
      principalDiagnosis: '',
      temperature: '',
      weight: '',
      additionalData: {} 
    },
    emailPatient: '',
    emailSpecialist: '',
    patient: '',
    qualification: '',
    review: '',
    specialist: '',
    specialty: '',
    stateShift: '',
    survey: {
      comment: '',
      experience: '',
      hygiene: ''
    },
  };


  newKey: string = '';
  newValue: string = '';
  additionalDataKeys: string[] = [];

  constructor(public globalData : GlobalDataService){
    this.shift.diagnosis.additionalData['key'] = 'value';
    this.shift.diagnosis.additionalData['animal'] = 'perro';
    console.log(this.shift);

  }
*/