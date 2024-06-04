import { Component } from '@angular/core';
import { DatabaseService } from '../../core/services/database.service';
import { GlobalDataService } from '../../core/services/global-data.service';
import { ToastrService } from 'ngx-toastr';
import { FirstCapitalLetterPipe } from '../../shared/pipes/first-capital-letter.pipe';
import { CommonModule } from '@angular/common';
import RegisterComponent from '../auth/register/register.component';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule,FirstCapitalLetterPipe,RegisterComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export default class ManageUsersComponent {

  stateNewUser : boolean = false;

  
  constructor(private database : DatabaseService, public globalData : GlobalDataService, private toastr : ToastrService){
    this.stateNewUser = false;
  }

  changeAuthorization(dni : number,state : boolean){
    this.database.updateVerificationByAdmin(dni,!state);
  }

  changeStateNewUser(){
    this.stateNewUser = !this.stateNewUser;
  }
}
