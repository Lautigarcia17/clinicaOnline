import { Component, Input, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../../core/services/global-data.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Specialist } from '../../../../core/class/specialist';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';
import { RecaptchaService } from '../../../../core/services/recaptcha.service';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-register-specialist',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FirstCapitalLetterPipe,NgxCaptchaModule],
  templateUrl: './register-specialist.component.html',
  styleUrl: './register-specialist.component.css'
})
export class RegisterSpecialistComponent implements OnInit{
  @Input() dniCharged! : number[];
  specialtyCharged! : string[]
  img : File | undefined;


  constructor(public globalData : GlobalDataService, private fb : FormBuilder, private database : DatabaseService, private toastr : ToastrService, private router : Router, private auth : AuthService, public recaptcha : RecaptchaService){}

  ngOnInit(): void {
    this.database.getSpecialty()
    .subscribe( (specialty : string[]) =>{
      this.specialtyCharged = specialty;
    })
  }
  


  formUser = this.fb.group({
    'name': ["",[Validators.required,Validators.pattern("[A-Za-z\s]+")]],
    'surname': ["",[Validators.required,Validators.pattern("[A-Za-z\s]+")]],
    'age': ["",[Validators.required,Specialist.ageMinMax]],
    'dni': ["",[Validators.required,Validators.min(1000000),Validators.max(99999999), (control : any) => Specialist.validateDni(control,this.dniCharged)]], // for tell that is a instance of this component
    'specialty': ["",[Validators.required]],
    'email': ["",[Validators.required,Validators.email]],
    'password': ["",[Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    'img': ["",[Validators.required]],
    'specialtyAdd': [''],
    'secondSpecialty': [''],
    'recaptcha': [''],
  })

  async register(){
    let name : string = this.formUser.get('name')?.value ?? '';
    let surname : string = this.formUser.get('surname')?.value ?? '';
    let age : string = this.formUser.get('age')?.value ?? '';
    let dni : string = this.formUser.get('dni')?.value ?? '';
    let email : string = this.formUser.get('email')?.value ?? '';
    let password : string = this.formUser.get('password')?.value ?? '';
    let img : string = '';

    let specialtys : Array<string> = [this.formUser.get('specialty')?.value?.toLowerCase() ?? ''];
    if(this.formUser.get('secondSpecialty')?.value !== ''){
      specialtys.push(this.formUser.get('secondSpecialty')?.value?.toLowerCase() ?? '');
    }

    this.auth.register(email,password)
    .then( async ( response ) =>{
      this.toastr.success("El paciente fue registrado!","FELICIDADES!", {timeOut: 3000,progressBar: true,closeButton:true});
      let interval : NodeJS.Timeout;
      let closedByUser : boolean = true;

      this.auth.verifiyEmail(response.user);
      if (this.globalData.getProfile() !== 'administrador') {       
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
              this.toastr.error("Deberias verificar tu mail!","Recuerda", {timeOut: 3000,progressBar: true,closeButton:true});
            }
            this.router.navigate(['login']);
            clearInterval(interval);
          } 
        })
      }

      img = await this.database.uploadImage(this.img,dni + "/" + dni + "." + Date.now());
      let specialist : Specialist = new Specialist(name,surname,parseInt(age),parseInt(dni),specialtys,email,password,img);
      this.database.saveSpecialistDatabase(specialist);
      this.emptyInputs();
    })
    .catch( () => {
      this.toastr.error("El mail ya estaba registrado","Aviso!", {timeOut: 3000,progressBar: true,closeButton:true});
    })



  }

  setImage($event : any) : void{
    this.img = $event.target.files[0];
  }

  addSpecialty() : void{
    let specialty : string | any =  this.formUser.get('specialtyAdd')?.value
    if (specialty) {
      specialty = specialty.toLowerCase();
      this.database.addSpecialty(specialty);
    }
  }

  emptyInputs(){
    this.formUser.reset({
      name: '',
      surname: '',
      age: '',
      dni: '',
      email: '',
      password: '',
      img: '',
      specialtyAdd: '',
      secondSpecialty: '',
    });
  }

  onValueChange(){
    console.log(this.formUser.get('specialty')?.value);
    console.log(this.formUser.get('secondSpecialty')?.value);

    if (this.formUser.get('specialty')?.value  == this.formUser.get('secondSpecialty')?.value) {
      this.formUser.get('secondSpecialty')?.setValue('');
    }
  }
}
