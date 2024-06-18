import { Component} from '@angular/core';
import { FirstCapitalLetterPipe } from '../../shared/pipes/first-capital-letter.pipe';
import { GlobalDataService } from '../../core/services/global-data.service';
import { DatabaseService } from '../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { PatientClinicHistoryComponent } from '../table/patient-clinic-history/patient-clinic-history.component';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FirstCapitalLetterPipe,PatientClinicHistoryComponent,CommonModule],
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


  constructor(public globalData : GlobalDataService, private database : DatabaseService, private toastr : ToastrService, private pdf : PdfService){
    this.flag = false;
    this.viewShifts = false;
    this.viewClinicHistory = false;
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
      this.setDaysWork();
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

  setDaysWork(){
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

  saveDaysWork(){
    let daysWork : Array<string> = [];
    this.checkboxes.forEach(item =>{
        if (item.checked) {
          daysWork.push(item.value);
        }
    })
    if(!this.areEqualsDays(daysWork))
    {
      this.database.updateDaysWork(this.globalData.getCurrentUser().email,daysWork);
      this.toastr.success("Los dias fueron guardados!","FELICIDADES!", {timeOut: 3000,progressBar: true,closeButton:true});
      this.switchViewElement('about');
    }
    else{
      this.toastr.error("Son los mismos dias!","Aviso!", {timeOut: 3000,progressBar: true,closeButton:true});
    }
  }

  areEqualsDays(daysWork : Array<string>){  // true if the arrays are equal, false otherwise
    if (this.globalData.getCurrentUser().workDays.length !== daysWork.length) {
      return false;
    }
    return this.globalData.getCurrentUser().workDays.every((item: any) => daysWork.indexOf(item) !== -1);
  }

  switchViewClinicHistory(){
    this.viewClinicHistory = !this.viewClinicHistory;
  }

  downloadPdf(){
    let tableData : Array<any> = [['Specialty','Specialist','Date','Height','Weight','Temperature','Pressure','Principal diagnosis', 'Medications / Precautions', 'Comment']]

    for (let shift of this.globalData.getShifts()) {
      if (shift.emailPatient == this.globalData.getCurrentUser().email && shift.stateShift === 'completado') {
        let dataPatient = [shift.specialty, shift.specialist, this.convertDate(shift.date) ,shift.diagnosis.height ,shift.diagnosis.weight ,shift.diagnosis.temperature ,shift.diagnosis.pressure,
                          shift.diagnosis.principalDiagnosis, shift.diagnosis.medicationsOrPrecautions, shift.diagnosis.comment]
        tableData.push(dataPatient);
      }
    }
    let namePdf = this.globalData.getCurrentUser().dni + '-historialClinico';

    this.pdf.downloadPdf('Historial Clinico', tableData, 'Clinica Lautaro Nahuel Garcia' ,namePdf);
  }

  convertDate(date : Date){
    let month = date.getMonth() == 12 ? 1 : date.getMonth() + 1;
    
    return date.getDate() + "/" + month + "/" + date.getFullYear();
  }

}
