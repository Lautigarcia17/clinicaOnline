import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { DatabaseService } from '../../../core/services/database.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  constructor(private globalData : GlobalDataService,private fb : FormBuilder, private toastr : ToastrService, private auth : AuthService,private database : DatabaseService, private router : Router, private localStorage : LocalStorageService){}

  formUser = this.fb.group({
    'email': ["",[Validators.required,Validators.email]],
    "password": ["",Validators.required]
  })

  login()
  {
    let email: string = this.formUser.get('email')?.value ?? ''; 
    let password: string = this.formUser.get('password')?.value ?? '';


    this.auth.login(email,password)
    .then( (response) =>{
        
        if (response.user.emailVerified == false) {
          this.toastr.info("No verificaste el email. Verifica el email para acceder!","Recuerda", {timeOut: 3000,progressBar: true,closeButton:true});
        }
        else{
          this.database.getUser(response.user.email ?? '')
          .subscribe( (user : any) => {
              if (user[0].profile == 'especialista' && user[0].adminVerified == false) {
                this.toastr.info("No has sido verificado por el administrador. Espera que te verifique!","Aviso", {timeOut: 3000,progressBar: true,closeButton:true});
              }
              else{
                this.localStorage.saveDataUserLocalStorage(user[0].id);
                this.globalData.setUser(user[0]);
                this.toastr.success("Has iniciado sesion","Felicidades!", {timeOut: 3000,progressBar: true,closeButton:true});
                this.router.navigate(["home"]); 
              }
          })

        }
    })
    .catch( () =>{
      this.toastr.info("El usuario ingresado no existe","Notice", {timeOut: 3000,progressBar: true,closeButton:true});
    } )
  }

  completeUser(email : string, password : string)
  {

      this.formUser.patchValue({
        "email": email,
        "password": password
      })

  }


}
