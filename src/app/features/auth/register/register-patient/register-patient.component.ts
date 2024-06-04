import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Patient } from '../../../../core/class/patient';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.css'
})
export class RegisterPatientComponent implements OnInit {
  imgOne : File | undefined;
  imgTwo : File | undefined;
  dniCharged : [] = [];
  constructor(private fb : FormBuilder, private database : DatabaseService, private toastr : ToastrService, private router : Router,private auth : AuthService){
  }

  ngOnInit(): void {
    this.dniCharged = this.database.getDni();
  }

  formUser = this.fb.group({
    'name': ["",[Validators.required,Validators.pattern('^[A-Za-z\\s]+$')]],
    'surname': ["",[Validators.required,Validators.pattern('^[A-Za-z\\s]+$')]],
    'age': ["",[Validators.required,Patient.ageMinMax]],
    'dni': ["",[Validators.required,Validators.min(1000000),Validators.max(99999999), (control : any) => Patient.validateDni(control,this.dniCharged)]], // for tell that is a instance of this component
    'socialSecurity': ["",[Validators.required,Validators.pattern('^[A-Za-z\\s]+$')]],
    'email': ["",[Validators.required,Validators.email]],
    'password': ["",[Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    'imgOne': ["",[Validators.required]],
    'imgTwo': ["",[Validators.required]],
    // 'recaptcha' : ["",Validators.required],

  })

  async register(){
    let name : string = this.formUser.get('name')?.value ?? '';
    let surname : string = this.formUser.get('surname')?.value ?? '';
    let age : string = this.formUser.get('age')?.value ?? '';
    let dni : string = this.formUser.get('dni')?.value ?? '';
    let socialSecurity : string = this.formUser.get('socialSecurity')?.value ?? '';
    let email : string = this.formUser.get('email')?.value ?? '';
    let password : string = this.formUser.get('password')?.value ?? '';
    let img : string[] = [];


    this.auth.register(email,password)
    .then( async (response) =>{
      this.toastr.success("El paciente fue registrado!","FELICIDADES!", {timeOut: 3000,progressBar: true,closeButton:true});

      let interval : any;
      let closedByUser : boolean = true;

      this.auth.verifiyEmail(response.user);
      Swal.fire({
        title: "Verifica tu mail",
        text: "Revisa tu mail. Si cierras esta ventana deberas verificar mas tarde.",
        icon: 'info',
        width: 600,
        allowOutsideClick: false,
        showCloseButton: true,
        didOpen: () => {
          Swal.showLoading();
          interval = setInterval(async () => {
            this.auth.login(email,password)
            .then( user => {
              if (user.user.emailVerified == true) {
                this.toastr.success("Verificacion realizada. Inicia sesion!","FELICIDADES!", {timeOut: 3000,progressBar: true,closeButton:true});
                closedByUser = false;
                Swal.close();
              }
            })
          },5000);
        },
        willClose: () => {
          if (closedByUser) {
            this.toastr.info("Deberias verificar tu mail!","Recuerda", {timeOut: 3000,progressBar: true,closeButton:true});
          }
          this.router.navigate(['login']);
          clearInterval(interval);
        } 
      })

      img.push(await this.database.uploadImage(this.imgOne,dni + "/" + dni + "." + Date.now()));
      img.push(await this.database.uploadImage(this.imgTwo,dni + "/" + dni + "." + Date.now()));
      let patient : Patient = new Patient(name,surname,parseInt(age),parseInt(dni),socialSecurity,email,password,img);
      this.database.savePatientDatabase(patient);
    })
    .catch( () => {
      this.toastr.warning("El mail ya estaba registrado","Aviso!", {timeOut: 3000,progressBar: true,closeButton:true});
    })
  }

  setImage($event : any, option : number)
  {
    const file = $event.target.files[0];

    if (option == 1) {
      this.imgOne = file;
    }
    else{  
      this.imgTwo = file;
    }
  }
}
