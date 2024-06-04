import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { RegisterSpecialistComponent } from './register-specialist/register-specialist.component';
import { RegisterAdministratorComponent } from './register-administrator/register-administrator.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RegisterPatientComponent,RegisterSpecialistComponent,RegisterAdministratorComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {

  stateRegister : boolean = false;
  statePatient : boolean = false;
  stateAdministrator : boolean = false;
  stateSpecialsit: boolean = false;
  showTooltip : boolean = false;
  textTooltip : string = "";
  
  constructor(public globalData : GlobalDataService){}


  changeStatePatient(){
    this.statePatient = true; 
    this.stateRegister = true;
  }
  
  changeStateSpecialist(){
    this.stateSpecialsit = true;
    this.stateRegister = true;
  }

  changeStateAdministrator(){
    this.stateAdministrator = true;
    this.stateRegister = true;
  }


  setStates(){
    this.stateRegister= false;
    this.statePatient = false;
    this.stateSpecialsit = false;
    this.stateAdministrator = false;
  }

  showName(description : string){
    this.showTooltip = true;
    this.textTooltip = description;
  }

  hideName(){
    this.showTooltip = false;
    this.textTooltip = "";
  }

}
