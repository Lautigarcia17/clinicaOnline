import { Component } from '@angular/core';
import { GlobalDataService } from '../../core/services/global-data.service';
import { ToastrService } from 'ngx-toastr';
import { FirstCapitalLetterPipe } from '../../shared/pipes/first-capital-letter.pipe';
import { CommonModule } from '@angular/common';
import RegisterComponent from '../auth/register/register.component';
import { AdminTableComponent } from '../table/users/admin-table/admin-table.component';
import { SpecialistTableComponent } from '../table/users/specialist-table/specialist-table.component';
import { PatientTableComponent } from '../table/users/patient-table/patient-table.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule,FirstCapitalLetterPipe,RegisterComponent,AdminTableComponent,SpecialistTableComponent,PatientTableComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export default class ManageUsersComponent {

  stateNewUser : boolean = false;
  viewPatient : boolean;
  viewSpecialist : boolean;
  viewAdministrator : boolean;
  
  constructor( public globalData : GlobalDataService, private toastr : ToastrService){
    this.stateNewUser = false;
    this.viewAdministrator = false;
    this.viewSpecialist = false;
    this.viewPatient = true;
  }


  changeStateNewUser(){
    this.stateNewUser = !this.stateNewUser;
  }

  selectTable(typeUser : string){
    this.viewPatient = false;
    this.viewSpecialist = false;
    this.viewAdministrator = false;

    switch(typeUser){
      case 'paciente' :
        this.viewPatient = true;
      break;
      case 'especialista' :
        this.viewSpecialist = true;
      break;
      default :
        this.viewAdministrator = true;
      break;
    }
  }


}
