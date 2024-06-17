import { Component, ViewEncapsulation } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { DatabaseService } from '../../../core/services/database.service';
import { ToastrService } from 'ngx-toastr';
import { ShiftAdminComponent } from '../../table/shifts/shift-admin/shift-admin.component';
import { ShiftSpecialistComponent } from '../../table/shifts/shift-specialist/shift-specialist.component';
import { ShiftPatientComponent } from '../../table/shifts/shift-patient/shift-patient.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';



@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [ShiftAdminComponent,ShiftSpecialistComponent,ShiftPatientComponent,FormsModule,FilterPipe,CommonModule],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css','../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
  encapsulation: ViewEncapsulation.None
})
export default class ShiftsComponent {
  searchFilter : string;
  constructor(public globalData : GlobalDataService, public database : DatabaseService, private toastr : ToastrService){
    this.searchFilter = '';
  }
  
  cancelShift(idReview : number, idShift : string,emailSpecialist : string, scheduleShift : Date, currentState : string){
    let review : any = document.getElementById('messageText' + idReview);
    let newState : string;
    if( (currentState === "pendiente" || currentState === 'aceptado') && (this.globalData.getProfile()  === 'paciente' || this.globalData.getProfile()  === 'administrador') ){
      newState = "cancelado";
    }
    else if (currentState === 'accepted' && this.globalData.getProfile()  === 'especialista') {
      newState = 'cancelado';
    }else{
      newState = 'rechazado';
    }

    if (review.value.length > 4) {
      this.database.updateStateShift(idShift,newState);
      this.database.saveReviewShift(idShift,review.value);
      this.database.removeShiftInSpecialist(emailSpecialist,scheduleShift);
      this.toastr.success("El turno fue cancelado y tu comentario fue enviado.","Felicidades!", {timeOut: 3000,progressBar: true,closeButton:true});
    }else{
      this.toastr.error("El comentario debe tener más de 4 caracteres. El turno no fue cancelado.","Recuerda escribir una reseña!", {timeOut: 3000,progressBar: true,closeButton:true});
      review.value = '';
    }
  }

}
