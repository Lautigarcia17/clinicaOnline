import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {}

  saveDataUserLocalStorage(idUser : string){

    localStorage.setItem("id_user", idUser);
    localStorage.setItem("stateLogin","true");
  }



  get stateLogin() : boolean
  {
    let state : any = localStorage.getItem("stateLogin") != null ? localStorage.getItem("stateLogin") : null;
    return JSON.parse(state);
  }

  get currentId() : string{
    let data : any = localStorage.getItem("id_user") != null ? localStorage.getItem("id_user") : "";
    return data;
  }

}
