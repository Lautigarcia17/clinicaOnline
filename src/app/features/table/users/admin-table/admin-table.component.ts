import { Component, Input } from '@angular/core';
import { FirstCapitalLetterPipe } from '../../../../shared/pipes/first-capital-letter.pipe';

@Component({
  selector: 'app-admin-table',
  standalone: true,
  imports: [FirstCapitalLetterPipe],
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css','../../../manage-users/manage-users.component.css']
})
export class AdminTableComponent {
  @Input() users : any;


}
