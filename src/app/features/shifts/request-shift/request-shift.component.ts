import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { DatabaseService } from '../../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { DayScheduleService } from '../../../core/services/day-schedule.service';
import Swal from 'sweetalert2';
import { FirstCapitalLetterPipe } from '../../../shared/pipes/first-capital-letter.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayNamePipe } from '../../../shared/pipes/day-name.pipe';
import { Specialty } from '../../../core/models/specialty';
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';
import { FormatTimePipe } from '../../../shared/pipes/format-time.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormatDoubleZeroPipe } from '../../../shared/pipes/format-double-zero.pipe';

@Component({
  selector: 'app-request-shift',
  standalone: true,
  imports: [CommonModule,FormsModule,FirstCapitalLetterPipe,DayNamePipe,FormatDatePipe,FormatTimePipe,FormatDoubleZeroPipe],
  templateUrl: './request-shift.component.html',
  styleUrl: './request-shift.component.css',
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
    ])
  ]
})
export default class RequestShiftComponent implements OnInit{
  specialtysCharged!: Array<Specialty>;
  specialtySearched!: string;
  stateSchedules! : boolean;
  stateDays! : boolean;
  hours!: Array<any>;
  specialistSelected! : any;
  daysForShifts! : Array<Date>;
  currentPatient! : any;
  hasSpecialist : boolean = false;
  emailSelectedForAdmin : string = "";

  constructor(public globalData : GlobalDataService ,private database : DatabaseService, private toastr : ToastrService, private daySchedule : DayScheduleService, public localStorage : LocalStorageService){
    this.setDefaultValues();
    this.currentPatient = {
      name : '',
      email : '',
    }
  }

  ngOnInit(): void {
    this.database.getSpecialty()
    .subscribe((response : Array<Specialty>)=>{
      this.specialtysCharged = response;
    })
  }


  onPatientSelected(event : any) {
    this.emailSelectedForAdmin = event?.target.value;
    let patient = this.globalData.getUsers().find(user => user.email === this.emailSelectedForAdmin);
    this.currentPatient.name = patient.name + " " + patient.surname;
    this.currentPatient.email = patient.email;
  }


  setSpecialist(specialty : string) : void{
    if (this.emailSelectedForAdmin == '' && this.globalData.getCurrentUser().profile == 'administrador') {
      this.toastr.error("Debes seleccionar un paciente","Recuerda selecionar el paciente!", {timeOut: 3000,progressBar: true,closeButton:true});
    }else{
      this.specialtySearched = specialty;
      this.hasSpecialist = this.globalData.getUsers().some(user => user.profile === 'especialista' && (user.specialty[0] === ( this.specialtySearched.toLowerCase()) || user.specialty[1] === ( this.specialtySearched.toLowerCase()) ) );
    }
  }


  setDays(user : any) : void{
    let date : Date = new Date();
    let closingTime : number = this.daySchedule.getNameDay(date) == 'Sabado' ? 14 : 19;
    this.specialistSelected = user;
    this.stateDays = true;

    if((date.getHours() >= closingTime || date.getHours() + 1 >= closingTime) || date.getHours() >= this.specialistSelected.workHour.end.getHours()){ // no se pueden reservar turnos 1 hora antes del turno
      console.log('No hay turnos después de esta hora, se le mostrara los del día siguiente');
      if (closingTime == 14) {
        date.setDate(date.getDate()+2);
      }else{
        date.setDate(date.getDate()+1);
      }
      
      date.setMinutes(0);
      date.setHours(8);
    }else if (date.getMinutes() >= 30) {
      date.setHours(date.getHours() + 1);
      date.setMinutes(0);
    }
    else if(date.getMinutes() > 0){
      date.setMinutes(30);
    }
    date.setSeconds(0);


    if (user.workDays.length > 0) {
      for (let index = 0; index < 15; index++) {
        if (user.workDays.includes( this.daySchedule.getNameDay(date) )) {
          this.daysForShifts.push(new Date(date));
        }   
        date.setDate(date.getDate() + 1);
        date.setHours(8)
        date.setMinutes(0);
      }
    }
  }

  setSchedules(day : Date) : void{

    if(this.specialistSelected.workHour.start !==''){
      let date = new Date(day);
      let closingTime = this.daySchedule.getNameDay(date) == 'Sabado' ? 14 : 19;
      this.stateSchedules = true;
      date.setHours(this.specialistSelected.workHour.start.getHours());
      date.setMinutes(this.specialistSelected.workHour.start.getMinutes());

      
      do{
        if (this.daySchedule.isScheduleAvailable(date,this.specialistSelected)) {
          this.hours.push(new Date(date));
        }
        date.setMinutes(date.getMinutes() + 30);
      } while (date.getHours() !=closingTime &&  (date.getHours() <= this.specialistSelected.workHour.end.getHours()) );
    }
    else{
      this.toastr.error("El especialista no tiene franja horaria cargada!","AVISO!", {timeOut: 3000,progressBar: true,closeButton:true});
    }


  }

  saveShift(date : Date){

    if(this.currentPatient.name == ''){
      this.currentPatient.name = this.globalData.getCurrentUser().name + " " + this.globalData.getCurrentUser().surname;
      this.currentPatient.email = this.globalData.getCurrentUser().email;
    }

    Swal.fire({
      title:"Estas seguro/a de que quieres reservar este horario?",
      icon: 'question',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      confirmButtonColor: '#4FC3A1',
      cancelButtonColor: 'black',
    }).then( async (result) => {
        if (result.isConfirmed) {
          let dataShift = {
            patient : this.currentPatient.name,
            emailPatient : this.currentPatient.email,
            specialist: this.specialistSelected.name + " " + this.specialistSelected.surname,
            emailSpecialist: this.specialistSelected.email,
            specialty : this.specialtySearched,
            date : date,
          }
      
          this.database.saveShiftInSpecialist(this.specialistSelected.email,date);
          this.database.saveShiftDatabase(dataShift);
          this.toastr.success("Turno Reservado!","FELICADADES!", {timeOut: 3000,progressBar: true,closeButton:true});
          this.setDefaultValues();
        }
    })
  }





  back() : void{
    if(this.stateSchedules){
      this.stateSchedules = false;
      this.hours = [];
    }
    else if (this.stateDays) {
      this.stateDays = false;
      this.daysForShifts = [];
    }
    else{
      this.specialtySearched = '';
      this.hasSpecialist = false;
    }
  }

  setDefaultValues() : void{
    this.stateSchedules = false;
    this.stateDays = false;
    this.specialistSelected = {};
    this.specialtySearched = '';
    this.hours = [];
    this.daysForShifts = [];
    this.hasSpecialist = false;
  }

  

}
