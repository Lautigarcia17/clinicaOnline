import { Component, Input } from '@angular/core';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';
import { DatabaseService } from '../../../../core/services/database.service';

@Component({
  selector: 'app-specialist-table',
  standalone: true,
  imports: [FirstCapitalLetterPipe],
  templateUrl: './specialist-table.component.html',
  styleUrls: ['./specialist-table.component.css','../../../manage-users/manage-users.component.css']
})
export class SpecialistTableComponent {
  @Input() users : any;

  constructor(private database : DatabaseService){}

  changeAuthorization(dni : number,state : boolean){
    this.database.updateVerificationByAdmin(dni,!state);
  }



}
