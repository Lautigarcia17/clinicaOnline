import { Component} from '@angular/core';
import { FirstCapitalLetterPipe } from '../../shared/pipes/first-capital-letter.pipe';
import { GlobalDataService } from '../../core/services/global-data.service';
import { DatabaseService } from '../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { PatientClinicHistoryComponent } from '../table/patient-clinic-history/patient-clinic-history.component';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../core/services/pdf.service';
import { FormatDoubleZeroPipe } from '../../shared/pipes/format-double-zero.pipe';
import { DayScheduleService } from '../../core/services/day-schedule.service';
import { Shift } from '../../core/models/shift';
import { FormsModule } from '@angular/forms';
import { TooltipTittleDirective } from '../../shared/directives/tooltip-tittle.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FirstCapitalLetterPipe,PatientClinicHistoryComponent,CommonModule,FormatDoubleZeroPipe,CommonModule,FormsModule,TooltipTittleDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent{
  checkboxes! : NodeListOf<HTMLInputElement>;
  shiftTabs! : HTMLButtonElement;
  aboutTabs! : HTMLButtonElement;
  viewShifts : boolean;
  flag : boolean;
  viewClinicHistory : boolean;
  timeSlotsStart!: Array<any>;
  timeSlotsEnd!: Array<any>;
  startTime!: Date;
  endTime!: Date;
  filteredSpecialties! : Set<string>;
  specialtyDowload! : string;

  constructor(public globalData : GlobalDataService, private database : DatabaseService, private toastr : ToastrService, private pdf : PdfService, private daySchedule : DayScheduleService){
    this.flag = false;
    this.viewShifts = false;
    this.viewClinicHistory = false;
    this.filteredSpecialties = new Set();
    this.specialtyDowload = 'todas';
  }

  ngOnInit(): void {
    this.database.getShifts()
    .subscribe((shifts: Shift[]) => {
      const completedShifts = shifts.filter((shift: Shift) => 
        shift.emailPatient === this.globalData.getCurrentUser().email && 
        shift.stateShift === 'completado'
      );

      completedShifts.forEach((shift: Shift) => {
        this.filteredSpecialties.add(shift.specialty);
      });
  

    });
  }



  switchViewElement(element : string){

    if (!this.flag) {
      this.aboutTabs = document.getElementById("about-tab") as HTMLButtonElement;
      this.shiftTabs = document.getElementById("shifts-tab") as HTMLButtonElement;
      this.checkboxes = document.querySelectorAll('.checkbox-day input[type="checkbox"]');
      this.flag = true;
    }


    if(element == "about"){
      this.aboutTabs.classList.add("active");
      this.shiftTabs.classList.remove("active");
      this.viewShifts = false;
    }
    else{
      this.aboutTabs.classList.remove("active");
      this.shiftTabs.classList.add("active");
      this.setWorkDays();
      this.setWorkHour();
      this.generateTimeSlots();
      this.viewShifts = true;
    }
  }

  clearCheckbox(){
    this.checkboxes.forEach(item =>{
      if (item.checked) {
        console.log(item.value)
      }
      item.checked = false;
    })
  }

  setWorkDays(){
    if (this.globalData.getCurrentUser().workDays.length > 0) {
      this.checkboxes.forEach(item =>{
        for (let day of this.globalData.getCurrentUser().workDays) {
          if (item.value == day) {
            item.checked = true;
          }
        }
      })
    }
  }




  switchViewClinicHistory(){
    this.viewClinicHistory = !this.viewClinicHistory;
  }

  downloadPdf(){
    let tableData : Array<any> = [['Especialidad','Especialista','Fecha','Altura','Peso','Temperatura','Presion','Principal diagnostico', 'Comentario','Datos adicionales']]

    for (let shift of this.globalData.getShifts()) {
      if (shift.emailPatient == this.globalData.getCurrentUser().email && shift.stateShift === 'completado') {
        if(this.specialtyDowload == 'todas' || this.specialtyDowload == shift.specialty)
        {
          let additionalData : string = '';

          for(let key in shift.diagnosis.additionalData){
            additionalData += key + ' : ' + shift.diagnosis.additionalData[key] + '\n';
          }
  
          let dataPatient = [shift.specialty, shift.specialist, this.convertDate(shift.date) ,shift.diagnosis.height ,shift.diagnosis.weight ,shift.diagnosis.temperature ,shift.diagnosis.pressure,
            shift.diagnosis.principalDiagnosis,shift.diagnosis.comment,additionalData]
  
          tableData.push(dataPatient);
        }

      }
    }
    let namePdf = this.globalData.getCurrentUser().dni + '-historialClinico';

    this.pdf.downloadPdf('Historial Clinico', tableData, 'Clinica Lautaro Nahuel Garcia' ,namePdf);
  }

  convertDate(date : Date){
    let month = date.getMonth() == 12 ? 1 : date.getMonth() + 1;
    
    return date.getDate() + "/" + month + "/" + date.getFullYear();
  }



  generateTimeSlots(): void {
    let date: Date = new Date();
    date.setHours(8);
    date.setMinutes(0);
    date.setSeconds(0);
    let closingTime: number = 19;
  
    do {
      this.timeSlotsStart.push(new Date(date));
      date.setMinutes(date.getMinutes() + 30);
    } while (date.getHours() !== closingTime);
    this.updateEndTimeSlots(this.startTime);
  }
  

  
  onStartTimeChange(event: any): void {
    this.startTime = this.timeSlotsStart[event.target.value];
    this.updateEndTimeSlots(this.startTime);
  }
  
  onEndTimeChange(event: any): void {
    this.endTime = this.timeSlotsEnd[event.target.value];
  }

  updateEndTimeSlots(startTime: Date): void {
    const startIndex = this.timeSlotsStart.findIndex(time => time.getHours() === startTime.getHours() && time.getMinutes() === startTime.getMinutes());
    this.timeSlotsEnd = [...this.timeSlotsStart.slice(startIndex + 1)];
  }

  setWorkHour(){

    if(this.globalData.getCurrentUser().workHour && this.globalData.getCurrentUser().workHour.start !== ''){
      this.startTime = this.globalData.getCurrentUser().workHour.start;
      this.endTime = this.globalData.getCurrentUser().workHour.end;
    }
    else{
      this.startTime = new Date();
      this.endTime = new Date();
      this.startTime .setHours(8);
      this.startTime .setMinutes(0);
      this.startTime .setSeconds(0);
      this.endTime .setHours(8);
      this.endTime .setMinutes(0);
      this.endTime .setSeconds(0);
    }

    this.timeSlotsEnd = [];
    this.timeSlotsStart = [];
  }

  saveDataWork(){
    let daysWork : Array<string> = [];
    this.checkboxes.forEach(item =>{
        if (item.checked) {
          daysWork.push(item.value);
        }
    })
    if(!this.daySchedule.areEqualsDays(this.globalData.getCurrentUser().workDays,daysWork)  || (this.globalData.getCurrentUser().workHour.start === "" || !this.daySchedule.areEqualsHour(this.globalData.getCurrentUser().workHour,this.startTime,this.endTime)))
    {
      this.database.updateWorkDays(this.globalData.getCurrentUser().email,daysWork);
      this.database.updateWorkHour(this.globalData.getCurrentUser().email,this.startTime,this.endTime);
      this.toastr.success("Los dias fueron guardados!","FELICIDADES!", {timeOut: 3000,progressBar: true,closeButton:true});
      this.switchViewElement('about');
    }
    else{
      this.toastr.error("Son los mismos datos!","Aviso!", {timeOut: 3000,progressBar: true,closeButton:true});
    }

  }

}


