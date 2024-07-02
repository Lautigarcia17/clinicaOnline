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
  arrayShifts! : Shift[];
  startDateShift! : string;
  endDateShift! : string;
  startDateShiftCompleted! : string;
  endDateShiftCompleted! : string;
  chartsSpecialist : any = {};

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

      this.renderChart('pie',labels,values,colours,'shiftBySpecialty');
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
    this.renderChart('bar',labels,values,'rgba(16, 233, 179)','shiftByDay');

  }

  


  renderChart(typeGrafic : any ,labels : any, data : any, colours : any = '', id : string){
    let idGraph : any = document.getElementById(id);
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



  calculateShiftCompletedBySpecialist(){
    if (this.startDateShiftCompleted && this.endDateShiftCompleted) {
      let dateStart = this.convertDate(this.startDateShiftCompleted);
      let dateEnd = this.convertDate(this.endDateShiftCompleted);
  
      this.database.getUsersDatabase().subscribe((users: any) => {
        let specialistCounts: any = {};
        let dates: any = {};
  
        users.forEach((specialist: any) => {
          if (specialist.profile === 'especialista') {
            specialistCounts[specialist.name + ' ' + specialist.surname] = {};
          }
        });
  
        this.arrayShifts.forEach((shift: Shift) => {
          let dateShift = new Date(shift.date.getFullYear(), shift.date.getMonth(), shift.date.getDate());
  
          if((dateShift >= dateStart && dateShift<= dateEnd ) && shift.stateShift == 'completado') {
            let dateKey = dateShift.getDate() + '/' + (dateShift.getMonth()+1)+ '/' + dateShift.getFullYear();
  
            if (!dates[dateKey]) {
              dates[dateKey] = {};
            }
  
            if (!dates[dateKey][shift.specialist]) {
              dates[dateKey][shift.specialist] = 0;
            }
  
            dates[dateKey][shift.specialist]++;
          }
        });
  
        let labels = Object.keys(dates);
        let datasets: any[] = [];
  
        users.forEach((specialist: any) => {
          if (specialist.profile === 'especialista') {
            let name = specialist.name + ' ' + specialist.surname;
            let data: number[] = [];
  
            labels.forEach((date: string) => {
              data.push(dates[date][name] || 0);
            });
  
            datasets.push({
              label: name,
              data: data,
              backgroundColor: this.getRandomColor(),
              borderColor: this.getRandomColor(),
              borderWidth: 1
            });
          }
        });
  
        this.renderChartSpecialist('bar', labels, datasets, "graphicSpecialistShiftCompleted");
      });
    }
  }


  calculateShiftBySpecialist() {
    if (this.startDateShift && this.endDateShift) {
      let dateStart = this.convertDate(this.startDateShift);
      let dateEnd = this.convertDate(this.endDateShift);
  
      this.database.getUsersDatabase().subscribe((users: any) => {
        let specialistCounts: any = {};
        let dates: any = {};
  
        users.forEach((specialist: any) => {
          if (specialist.profile === 'especialista') {
            specialistCounts[specialist.name + ' ' + specialist.surname] = {};
          }
        });
  
        this.arrayShifts.forEach((shift: Shift) => {
          let dateShift = new Date(shift.date.getFullYear(), shift.date.getMonth(), shift.date.getDate());
  
          if (dateShift >= dateStart && dateShift <= dateEnd) {
            let dateKey = dateShift.getDate() + '/' + (dateShift.getMonth() + 1)+ '/' + dateShift.getFullYear();
  
            if (!dates[dateKey]) {
              dates[dateKey] = {};
            }
  
            if (!dates[dateKey][shift.specialist]) {
              dates[dateKey][shift.specialist] = 0;
            }
  
            dates[dateKey][shift.specialist]++;
          }
        });
  
        let labels = Object.keys(dates);
        let datasets: any[] = [];
  
        users.forEach((specialist: any) => {
          if (specialist.profile === 'especialista') {
            let name = specialist.name + ' ' + specialist.surname;
            let data: number[] = [];
  
            labels.forEach((date: string) => {
              data.push(dates[date][name] || 0);
            });
  
            datasets.push({
              label: name,
              data: data,
              backgroundColor: this.getRandomColor(),
              borderColor: this.getRandomColor(),
              borderWidth: 1
            });
          }
        });
  
        this.renderChartSpecialist('bar', labels, datasets, "graphicSpecialistShift");
      });
    }
  }

  renderChartSpecialist(type: any, labels: string[], datasets: any[], id : string) {
    const ctx : any = (document.getElementById(id) as HTMLCanvasElement).getContext('2d');

    if (this.chartsSpecialist[id]) {
      this.chartsSpecialist[id].destroy();
    }

    this.chartsSpecialist[id]= new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => {
                let specialist = tooltipItem.dataset.label;
                let count = tooltipItem.raw;
                return `${specialist}: ${count} turno(s)`;
              }
            }
          }
        }
      }
    });
  }







  updateEndDateMin(idInput : string, start : string) {
    const endDateInput = document.querySelector(`input[name="${idInput}"]`) as HTMLInputElement;
    if (endDateInput) {
      const startDate = new Date(start);
      const endDate = new Date(endDateInput.value);
  
      if (startDate > endDate) {
        startDate.setDate(startDate.getDate() + 1);
        endDateInput.value = startDate.toISOString().split('T')[0];
      }
  
    }
  }



}
