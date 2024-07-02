import { Component, Input,  ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';
import { CommonModule } from '@angular/common';
import { GlobalDataService } from '../../../../core/services/global-data.service';
import { DatabaseService } from '../../../../core/services/database.service';
import { Shift } from '../../../../core/models/shift';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { ColourStateDirective } from '../../../../shared/directives/colour-state.directive';

@Component({
  selector: 'app-shift-admin',
  standalone: true,
  imports: [FirstCapitalLetterPipe,CommonModule,FilterPipe,ColourStateDirective],
  templateUrl: './shift-admin.component.html',
  styleUrls: ['./shift-admin.component.css'],

})
export class ShiftAdminComponent {
  @Input() arrayShifts! : Array<Shift>;
  @Input() cancelFunction?: Function;
  @Input() searchFilter! : string;

  constructor(public globalData : GlobalDataService,private toastr : ToastrService, private database: DatabaseService){} // The service works for the function cancelShift


  cancelShift(idReview : number,idShift : number,emailSpecialist : string, scheduleShift : Date, currentState : string){
    if (this.cancelFunction) {
      this.cancelFunction(idReview,idShift,emailSpecialist,scheduleShift, currentState);
    }
  }

}
