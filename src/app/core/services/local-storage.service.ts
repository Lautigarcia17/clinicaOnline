import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  

  saveDataUserLocalStorage(name: string, email: string, profile: string){
    let data : any = {
      "name" : name,
      "email" : email,
      "profile" : profile
    }
    localStorage.setItem("user",JSON.stringify(data));
    localStorage.setItem("stateLogin","true");
  }


  private readDataUser() 
  {
    let data : any = "";
    data = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user") as string) : "";
    return data;
  }

  get currentUser()
  {
    let data = this.readDataUser();
    return data['name'];
  }

  get currentEmail()
  {
    let data = this.readDataUser();
    return data['email'];
  }

  get currentProfile()
  {
    let data = this.readDataUser();
    return data['profile'];
  }

  get stateLogin()
  {
    let state : any = localStorage.getItem("stateLogin") != null ? localStorage.getItem("stateLogin") : null;
    return JSON.parse(state);
  }

}
