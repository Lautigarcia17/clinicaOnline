import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FirstCapitalLetterPipe } from '../../../shared/pipes/first-capital-letter.pipe';

@Component({
  selector: 'app-patient-clinic-history',
  standalone: true,
  imports: [CommonModule,FirstCapitalLetterPipe],
  templateUrl: './patient-clinic-history.component.html',
  styleUrl: './patient-clinic-history.component.css'
})
export class PatientClinicHistoryComponent {
  @Input() arrayShifts : any;
  @Input() user : any;

  constructor(){}


}
