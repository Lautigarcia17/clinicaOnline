import { Injectable } from '@angular/core';
import {Workbook, Worksheet,ImagePosition } from 'exceljs';
import html2canvas from 'html2canvas';
import * as fs from 'file-saver'
import { DayScheduleService } from './day-schedule.service';
import { Shift } from '../models/shift';
import { Login } from '../models/login';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private workbook!: Workbook;

  constructor(private dayService : DayScheduleService) { }



  downloadUserExcel(arrayUsers : Array<any>){
    this.workbook = new Workbook();
    this.workbook.creator = 'Lautaro Nahuel Garcia';
    let worksheet : Worksheet = this.generateWorksheetUser();

    for (let index = 0; index < arrayUsers.length; index++) {
      this.generateRowOfWorkSheetUsers(arrayUsers[index],worksheet)
    }

    let date  : Date= new Date();
    let month : number = date.getMonth() == 12 ? 1 : date.getMonth() + 1;  
    let todayDate : string =  date.getDate() + "-" + month + "-" + date.getFullYear();

    this.workbook.xlsx.writeBuffer()
    .then( (data : any) =>{
      const blob : Blob = new Blob([data]);
      fs.saveAs(blob, `Usuarios_${todayDate}.xlsx`);
    })

  }

  generateWorksheetUser(){
    const worksheet : Worksheet = this.workbook.addWorksheet('usuarios');

    worksheet.mergeCells('B2:G2')
    worksheet.getCell('B2').value = "PACIENTES";
    worksheet.getCell('B2').font = {size:18};
    worksheet.getCell('B2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getCell('B2').fill = {type: 'pattern', pattern: 'solid' , fgColor : {argb: 'FF4FC3A1'}};

    worksheet.mergeCells('I2:N2')
    worksheet.getCell('I2').value = "ESPECIALISTAS";
    worksheet.getCell('I2').font = {size:18};
    worksheet.getCell('I2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getCell('I2').fill = {type: 'pattern', pattern: 'solid' , fgColor : {argb: 'FF4FC3A1'}};

    worksheet.mergeCells('P2:T2')
    worksheet.getCell('P2').value = "ADMINISTRADOR";
    worksheet.getCell('P2').font = {size:18};
    worksheet.getCell('P2').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getCell('P2').fill = {type: 'pattern', pattern: 'solid' , fgColor : {argb: 'FF4FC3A1'}};


    ['B','C','D','E','F','G','I','J','K','L','M','N','P','Q','R','S','T'].forEach( (letter: string) =>{
      worksheet.getColumn(letter).width = 25;
    })

    worksheet.getRow(3).values = 
    ['','Dni','Nombre','Apellido','Edad','Email','Obra social',
     '', 'Dni','Nombre','Apellido','Edad',"Email",'Especialidad',
     '', 'Dni','Nombre','Apellido','Edad',"Email",
    ];
    worksheet.getRow(3).alignment= {horizontal:'center', wrapText:true};

    ['B3','C3','D3','E3','F3','G3',
      'I3','J3','K3','L3','M3','N3',
      'P3','Q3','R3','S3','T3'
    ].forEach( (letter: string, index : number) =>{
      worksheet.getCell(letter).font = {bold:true, size:14, color: {'argb': 'FFFFFF'}};
      worksheet.getCell(letter).border = { top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'} };
      if (index % 2 == 0) {
        worksheet.getCell(letter).fill = {type: 'pattern', pattern: 'solid' , fgColor : {argb: 'FF324960'}};
      }
      else{
        worksheet.getCell(letter).fill = {type: 'pattern', pattern: 'solid' , fgColor : {argb: 'FF4FC3A1'}};
      }

    })

    return worksheet;
  }

  generateRowOfWorkSheetUsers(user : any, worksheet : Worksheet){
    let line = 0;

    if(user.profile === 'paciente'){
      line = this.findNextRowToFill('B',worksheet);

      ['B'+ line ,'C' + line,'D' + line ,'E' + line ,'F' + line,'G' + line].forEach( (letter: string) =>{
        worksheet.getCell(letter).border = {top:{style: 'thin'},left:{style: 'thin'},bottom:{style: 'thin'},right:{style: 'thin'}};
      })
      
      worksheet.getCell('B' + line).value = user.dni;
      worksheet.getCell('C' + line).value = user.name;
      worksheet.getCell('D' + line).value = user.surname;
      worksheet.getCell('E' + line).value = user.age;
      worksheet.getCell('F' + line).value = user.email;
      worksheet.getCell('G' + line).value = user.socialSecurity;
    }
    else if (user.profile === 'especialista'){
      line = this.findNextRowToFill('I',worksheet);
      ['I'+ line ,'J' + line,'K' + line ,'L' + line ,'M' + line,'N' + line].forEach( (letter: string) =>{
        worksheet.getCell(letter).border = {top:{style: 'thin'},left:{style: 'thin'},bottom:{style: 'thin'},right:{style: 'thin'}};
      })
      
      worksheet.getCell('I' + line).value = user.dni;
      worksheet.getCell('J' + line).value = user.name;
      worksheet.getCell('K' + line).value = user.surname;
      worksheet.getCell('L' + line).value = user.age;
      worksheet.getCell('M' + line).value = user.email;
      worksheet.getCell('N' + line).value = (user.specialty[0] ?? '') + ' ' + (user.specialty[1] ?? '');
    }
    else{
      line = this.findNextRowToFill('P',worksheet);
      ['P'+ line ,'Q' + line,'R' + line ,'S' + line ,'T' + line].forEach( (letter: string) =>{
        worksheet.getCell(letter).border = {top:{style: 'thin'},left:{style: 'thin'},bottom:{style: 'thin'},right:{style: 'thin'}};
      })

      worksheet.getCell('P' + line).value = user.dni;
      worksheet.getCell('Q' + line).value = user.name;
      worksheet.getCell('R' + line).value = user.surname;
      worksheet.getCell('S' + line).value = user.age;
      worksheet.getCell('T' + line).value = user.email;
    }

    worksheet.getRow(line).font = {size:12, color: {'argb': '000000'}};
    worksheet.getRow(line).alignment= {horizontal:'center'};
  }

  findNextRowToFill(firstCell : string, worksheet : Worksheet){
    let rowFree : number = -1;
    let row = 4; // where values begin
    do {
      if (!worksheet.getRow(row).getCell(firstCell).value) {
        rowFree = row
        break;
      } 

      row++;
    } while (rowFree === -1);

    return rowFree;
  }

  


  /*SHIFT*/

  downloadShiftByUserExcel(arrayShifts: Array<Shift>) {
    this.workbook = new Workbook();
    this.workbook.creator = 'Lautaro Nahuel Garcia';
    let worksheet: Worksheet = this.generateWorksheetShift();

    for (let index = 0; index < arrayShifts.length; index++) {
      this.generateRowOfWorkSheetShift(arrayShifts[index], worksheet);
    }

    let date: Date = new Date();
    let month: number = date.getMonth() == 12 ? 1 : date.getMonth() + 1;
    let todayDate: string = date.getDate() + "-" + month + "-" + date.getFullYear();

    this.workbook.xlsx.writeBuffer()
      .then((data: any) => {
        const blob: Blob = new Blob([data]);
        fs.saveAs(blob, `Turnos_${arrayShifts[0].patient}_${todayDate}.xlsx`);
      });
  }

  generateWorksheetShift() {
    const worksheet: Worksheet = this.workbook.addWorksheet('turnos');

    worksheet.mergeCells('B2:F2');
    worksheet.getCell('B2').value = "TURNOS";
    worksheet.getCell('B2').font = { size: 18 };
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4FC3A1' } };

    ['B', 'C', 'D', 'E', 'F'].forEach((letter: string) => {
      worksheet.getColumn(letter).width = 25;
    });

    worksheet.getRow(3).values =
      ['', 'Paciente', 'Especialista', 'Fecha', 'Hora', 'Estado'];
    worksheet.getRow(3).alignment = { horizontal: 'center', wrapText: true };

    ['B3', 'C3', 'D3', 'E3', 'F3'].forEach((letter: string, index: number) => {
      worksheet.getCell(letter).font = { bold: true, size: 14, color: { 'argb': 'FFFFFF' } };
      worksheet.getCell(letter).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (index % 2 == 0) {
        worksheet.getCell(letter).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF324960' } };
      } else {
        worksheet.getCell(letter).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4FC3A1' } };
      }
    });

    return worksheet;
  }

  generateRowOfWorkSheetShift(shift: Shift, worksheet: Worksheet) {
    let line = 0;

    line = this.findNextRowToFill('B', worksheet);

    ['B' + line, 'C' + line, 'D' + line, 'E' + line, 'F' + line].forEach((letter: string) => {
      worksheet.getCell(letter).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    worksheet.getCell('B' + line).value = shift.patient;
    worksheet.getCell('C' + line).value = shift.specialist;
    worksheet.getCell('D' + line).value = this.dayService.formatDate(shift.date);
    worksheet.getCell('E' + line).value = this.dayService.formatDateTime(shift.date);
    worksheet.getCell('F' + line).value = shift.stateShift;
  }
  /**/

  /* GRAPHIC */
  downloadGraphicExcel(idElement : any) {
    const element = document.getElementById(idElement);
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
  
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
  
        const imageId2 = workbook.addImage({
          base64: imgData,
          extension: 'png',
        });
  
        worksheet.addImage(imageId2, {
          tl: { col: 0, row: 0 },
          ext: { width: 1500, height: 600 },
        } as ImagePosition);
  
        workbook.xlsx.writeBuffer().then((buffer) => {
          fs.saveAs(new Blob([buffer]), 'chart.xlsx');
        });
      });
    }
  }
  /**/

  /* LOGINS*/
  downloadLoginExcel(arrayLogins: Array<Login>) {
    this.workbook = new Workbook();
    this.workbook.creator = 'Lautaro Nahuel Garcia';
    let worksheet: Worksheet = this.generateWorksheetLogins();

    for (let index = 0; index < arrayLogins.length; index++) {
      this.generateRowOfWorkSheetLogin(arrayLogins[index], worksheet);
    }

    let date: Date = new Date();
    let month: number = date.getMonth() == 12 ? 1 : date.getMonth() + 1;
    let todayDate: string = date.getDate() + "-" + month + "-" + date.getFullYear();

    this.workbook.xlsx.writeBuffer()
      .then((data: any) => {
        const blob: Blob = new Blob([data]);
        fs.saveAs(blob, `Logins_${todayDate}.xlsx`);
      });
  }


  generateRowOfWorkSheetLogin(shift: Login, worksheet: Worksheet) {
    let line = 0;

    line = this.findNextRowToFill('B', worksheet);

    ['B' + line, 'C' + line, 'D' + line].forEach((letter: string) => {
      worksheet.getCell(letter).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    worksheet.getCell('B' + line).value = shift.user;
    worksheet.getCell('C' + line).value = this.dayService.formatDate(shift.date);
    worksheet.getCell('D' + line).value = this.dayService.formatDateTime(shift.date);
  }
  

  generateWorksheetLogins() {
    const worksheet: Worksheet = this.workbook.addWorksheet('logins');

    worksheet.mergeCells('B2:D2');
    worksheet.getCell('B2').value = "LOGINS";
    worksheet.getCell('B2').font = { size: 18 };
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4FC3A1' } };

    ['B', 'C', 'D'].forEach((letter: string) => {
      worksheet.getColumn(letter).width = 25;
    });

    worksheet.getRow(3).values =
      ['', 'Usuario','Fecha', 'Hora'];
    worksheet.getRow(3).alignment = { horizontal: 'center', wrapText: true };

    ['B3', 'C3', 'D3'].forEach((letter: string, index: number) => {
      worksheet.getCell(letter).font = { bold: true, size: 14, color: { 'argb': 'FFFFFF' } };
      worksheet.getCell(letter).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (index % 2 == 0) {
        worksheet.getCell(letter).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF324960' } };
      } else {
        worksheet.getCell(letter).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4FC3A1' } };
      }
    });

    return worksheet;
  }

  /**/
}
