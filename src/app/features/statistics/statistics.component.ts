import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ExcelService } from '../../core/services/excel.service';
import 'chartjs-plugin-datalabels';
import { GlobalDataService } from '../../core/services/global-data.service';
import { DatabaseService } from '../../core/services/database.service';
import { CommonModule } from '@angular/common';
import { Shift } from '../../core/models/shift';
import { FormsModule } from '@angular/forms';
import { DayScheduleService } from '../../core/services/day-schedule.service';
Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export default class StatisticsComponent {
  arraySpecialtys! : Array<any>;
  startDate! : string;
  endDate! : string;
  arrayShifts! : Shift[];

  constructor(public globalData : GlobalDataService, public database : DatabaseService, public excel : ExcelService, private dayService : DayScheduleService){}

  ngOnInit(): void {
    this.database.getShifts()
    .subscribe( (shifts : Shift[]) =>{
      this.calculateShiftsForSpecialty(shifts);
      this.calculateShiftsForDay(shifts);
      this.arrayShifts = shifts;
    })

  }





  calculateShiftsForSpecialty(shifts : Shift[]){

    this.database.getSpecialty()
    .subscribe( (specialties : any) =>{
      let specialtyCounts : any = {};
      let specialtyColours : any = {}

        specialties.forEach((specialty: any) => {
          specialtyCounts[specialty.name] = 0;
          specialtyColours[this.getRandomColor()] = ''; 
        });

        
        shifts.forEach((shift: Shift) => {
          specialtyCounts[shift.specialty]++; 
        });

        let labels = Object.keys(specialtyCounts);
        let values = Object.values(specialtyCounts);
        let colours = Object.keys(specialtyColours);

      this.renderChart('pie',labels,values,colours);
    })
  }

  calculateShiftsForDay(shifts : Shift[]){
    let shiftsForDay : any= 
    {
      'domingo' : 0 ,
      'lunes' : 0,
      'martes': 0 ,
      'miercoles': 0 ,
      'jueves': 0 ,
      'viernes': 0 ,
      'sabado': 0 
    };

    let labels = Object.keys(shiftsForDay);


    shifts.forEach((shift: Shift) => {
      let date = new Date(shift.date);
      let nameDays = labels[date.getDay()];
      shiftsForDay[nameDays]++;
    });

    labels.shift();
    let values = Object.values(shiftsForDay);
    this.renderChart('bar',labels,values,'rgba(16, 233, 179)');

  }

  


  renderChart(typeGrafic : any ,labels : any, data : any, colours : any = ''){
    let idGraph : any = document.getElementById(typeGrafic);
    if (idGraph !== null) {
      new Chart(idGraph, {
        type: typeGrafic, 
        data: {
          labels: labels,
          datasets: [{
            label: 'TURNOS',
            data: data, 
            borderWidth: 1,
            backgroundColor: colours
          }]
        },
        options: {
          aspectRatio: 2,
          plugins: {
            datalabels: {
              display: false
            },
            legend: {
              labels: {
                font: {
                  size: 18,
                  family: 'system-ui, -apple-system, BlinkMacSystemFont',
                }
              }
            }
          }
        }
      });
    }
    
  }



  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  convertDate(dateString : string) : any{
    const dateParts = dateString.split('-'); 
    return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2])); 
  }










  calculateShiftBySpecialist(){
    if(this.startDate && this.endDate){
      let dateStart = this.convertDate(this.startDate);
      let dateEnd = this.convertDate(this.endDate);

      this.database.getUsersDatabase()
      .subscribe( (users : any) =>{
        let specialistCounts : any = {};
        let specialtistColours : any = {}
  
          users.forEach((specialtist: any) => {
            if(specialtist.profile === 'especialista'){
              specialistCounts[specialtist.name + ' ' + specialtist.surname] = 0;
              specialtistColours[this.getRandomColor()] = ''; 
            }
          });
  
          
          this.arrayShifts.forEach((shift: Shift) => {
            let dateShift = new Date(shift.date.getFullYear(), shift.date.getMonth(), shift.date.getDate())
            if(dateShift >= dateStart && dateShift<= dateEnd )
            {
              specialistCounts[shift.specialist]++; 
            }
          });
  
          let labels = Object.keys(specialistCounts);
          let values = Object.values(specialistCounts);
          let colours = Object.keys(specialtistColours);
  
        // this.renderChart('pie',labels,values,colours);
      })
    }
  }

  calculateShiftCompletedBySpecialist(){
    if(this.startDate && this.endDate){
      let dateStart = this.convertDate(this.startDate);
      let dateEnd = this.convertDate(this.endDate);

      this.database.getUsersDatabase()
      .subscribe( (users : any) =>{
        let specialistCounts : any = {};
        let specialtistColours : any = {}
  
          users.forEach((specialtist: any) => {
            if(specialtist.profile === 'especialista'){
              specialistCounts[specialtist.name + ' ' + specialtist.surname] = 0;
              specialtistColours[this.getRandomColor()] = ''; 
            }
          });
  
          
          this.arrayShifts.forEach((shift: Shift) => {
            let dateShift = new Date(shift.date.getFullYear(), shift.date.getMonth(), shift.date.getDate())
            if((dateShift >= dateStart && dateShift<= dateEnd ) && shift.stateShift == 'completado')
            {
              specialistCounts[shift.specialist]++; 
            }
          });
  
          let labels = Object.keys(specialistCounts);
          let values = Object.values(specialistCounts);
          let colours = Object.keys(specialtistColours);
  
        // this.renderChart('pie',labels,values,colours);
      })
    }
  }
















}
