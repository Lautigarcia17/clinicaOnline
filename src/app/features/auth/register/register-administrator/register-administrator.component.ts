import { Component, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../../../../core/services/database.service';
import { Specialist } from '../../../../core/class/specialist';
import { AuthService } from '../../../../core/services/auth.service';
import { Administrator } from '../../../../core/class/administrator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-administrator',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register-administrator.component.html',
  styleUrl: './register-administrator.component.css'
})
export class RegisterAdministratorComponent {
  img : File | undefined;
  @Input() dniCharged! : number[];

  constructor(private fb : FormBuilder, private database : DatabaseService, private toastr : ToastrService, private auth : AuthService){}


  formUser = this.fb.group({
    'name': ["",[Validators.required,Validators.pattern("[A-Za-z\s]+")]],
    'surname': ["",[Validators.required,Validators.pattern("[A-Za-z\s]+")]],
    'age': ["",[Validators.required,Specialist.ageMinMax]],
    'dni': ["",[Validators.required,Validators.min(1000000),Validators.max(99999999), (control : any) => Specialist.validateDni(control,this.dniCharged)]], // for tell that is a instance of this component
    'email': ["",[Validators.required,Validators.email]],
    'password': ["",[Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    'img': ["",[Validators.required]]
  })

  async register(){
    let name : string = this.formUser.get('name')?.value ?? '';
    let surname : string = this.formUser.get('surname')?.value ?? '';
    let age : string = this.formUser.get('age')?.value ?? '';
    let dni : string = this.formUser.get('dni')?.value ?? '';
    let email : string = this.formUser.get('email')?.value ?? '';
    let password : string = this.formUser.get('password')?.value ?? '';
    let img : string = '';



    this.auth.register(email,password)
    .then( async (response) =>{
      this.toastr.success("El administrador fue registrado","FELICIDADES!", {timeOut: 3000,progressBar: true,closeButton:true});
      this.auth.verifiyEmail(response.user);
      img = await this.database.uploadImage(this.img,dni + "/" + dni + "." + Date.now());
      let administrator : Administrator = new Administrator(name,surname,parseInt(age),parseInt(dni),email,password,img);
      this.database.saveAdministratorDatabase(administrator);
      this.emptyInputs();
    })
    .catch( () => {
      this.toastr.error("El mail ya fue registrado.","Aviso!", {timeOut: 3000,progressBar: true,closeButton:true});
    })



  }

  setImage($event : any)
  {
    this.img = $event.target.files[0];
  }

  emptyInputs(){
    this.formUser.reset({
      name: '',
      surname: '',
      age: '',
      dni: '',
      email: '',
      password: '',
      img: ''
    });
  }

}
