import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  private stateLogin: boolean;
  private profile! : string;
  private arraySpecialty! : Array<any>;
  private arrayUsers! : Array<any>;

  constructor(localStorage: LocalStorageService, database : DatabaseService) {
    this.stateLogin = localStorage.stateLogin;
    this.profile = localStorage.currentProfile == undefined ? "" : localStorage.currentProfile;

    database.getSpecialty()
    .subscribe((response : any) =>{
      this.arraySpecialty =[];
      for(let element of response)
      {
        this.arraySpecialty.push(element.name);         
      }
    });

    database.getUsersDatabase()
    .subscribe((response : any) =>{
      this.arrayUsers =[];
      for(let user of response)
      {
        this.arrayUsers.push(user);         
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
    return this.profile;
  }

  getSpecialtys() : Array<string>{
    return this.arraySpecialty;
  }

  getUsers() : Array<any>{
    return this.arrayUsers;
  }

  setLogout(): void {
    this.stateLogin = false;
    this.profile = '';
  }

  setLoggedInUser(profile: string): void {
    this.stateLogin = true;
    this.profile = profile
  }
  

}
