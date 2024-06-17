import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { Shift } from '../models/shift';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  dataCharged : boolean = false;
  private currentUser : any;
  private stateLogin: boolean;
  private arrayUsers! : Array<any>;
  private arrayShifts! : Array<any>;
  private observableUser! : any;

  constructor(localStorage: LocalStorageService, database : DatabaseService) {
    this.stateLogin = localStorage.stateLogin;

    if(localStorage.currentId == ''){
      this.dataCharged = true;
    }

    database.getUsersDatabase()
    .subscribe((response : any) =>{
      this.arrayUsers =[];
      for(let user of response)
      {
        this.arrayUsers.push(user);         
    
        if(user.id == localStorage.currentId){
          this.currentUser = user
          this.dataCharged = true;
        }


      }
    });

    database.getShifts()
    .subscribe((response : Shift[]) =>{
      this.arrayShifts =[];
      for(let shift of response)
      {
        this.arrayShifts.push(shift);         
      }
    });

  }

  getStateLogin(): boolean {
    return this.stateLogin;
  }

  setStateLogin(state: boolean): void {
    this.stateLogin = state;
  }

  getProfile() : string{

    return this.currentUser ? this.currentUser.profile : '';
  }


  getUsers() : Array<any>{
    return this.arrayUsers;
  }

  setLogout(): void {
    if (this.observableUser) {
      this.observableUser.unsubscribe();
    }
    this.stateLogin = false;
    this.currentUser = '';
  }

  getCurrentUser() : any{
    return this.currentUser;
  }

  setUser(user: any): void {
    this.stateLogin = true;
    this.currentUser = user;
  }
  
  getShifts() : any{
    return this.arrayShifts;
  }

}
