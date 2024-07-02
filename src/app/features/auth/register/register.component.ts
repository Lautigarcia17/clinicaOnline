import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { RegisterSpecialistComponent } from './register-specialist/register-specialist.component';
import { RegisterAdministratorComponent } from './register-administrator/register-administrator.component';
import { DatabaseService } from '../../../core/services/database.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RegisterPatientComponent,RegisterSpecialistComponent,RegisterAdministratorComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
    ])
  ]
})
export default class RegisterComponent implements OnInit{
  stateRegister : boolean;
  statePatient : boolean;
  stateAdministrator : boolean;
  stateSpecialsit: boolean;
  showTooltip : boolean;
  textTooltip : string;
  dniCharged! : number[];
  
  constructor(public globalData : GlobalDataService, private database : DatabaseService){
    this.stateRegister = false;
    this.statePatient = false;
    this.stateAdministrator = false;
    this.stateSpecialsit = false;
    this.showTooltip = false;
    this.textTooltip = '';
  }

  ngOnInit(): void {
    this.database.getDni()
    .subscribe((dni : number[]) =>{
      this.dniCharged = dni;
    })
  }


  changeStatePatient() : void{
    this.statePatient = true; 
    this.stateRegister = true;
  }
  
  changeStateSpecialist() : void{
    this.stateSpecialsit = true;
    this.stateRegister = true;
  }

  changeStateAdministrator() : void{
    this.stateAdministrator = true;
    this.stateRegister = true;
  }


  setStates() : void{
    this.stateRegister= false;
    this.statePatient = false;
    this.stateSpecialsit = false;
    this.stateAdministrator = false;
  }

  showName(description : string) : void{
    this.showTooltip = true;
    this.textTooltip = description;
  }

  hideName() : void{
    this.showTooltip = false;
    this.textTooltip = "";
  }

}
