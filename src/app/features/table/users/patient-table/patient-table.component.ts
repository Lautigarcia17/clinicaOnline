import { Component, Input } from '@angular/core';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [FirstCapitalLetterPipe],
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.css','../../../manage-users/manage-users.component.css']
})
export class PatientTableComponent {
  @Input() users : any;

}
