import { Injectable } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: Auth) { }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  verifiyEmail(user : any) : Promise<void>{
    return sendEmailVerification(user);
  }

  currentUser() : string {
    return this.auth.currentUser?.email ?? '';
  }

}
