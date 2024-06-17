import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  siteKey : string;
  theme : any;

  constructor() {
    this.siteKey = '6Lf1jPUpAAAAAFsA3PZvTcUe1g199AaK8XTzSfzm';
    this.theme = 'Dark'
  }
}
