import { Injectable } from '@angular/core';
import {Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver'


@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private workbook!: Workbook;

  constructor() { }



  downloadExcel(arrayUsers : Array<any>){
    this.workbook = new Workbook();
    this.workbook.creator = 'Lautaro Nahuel Garcia';
    let worksheet : Worksheet = this.generateWorksheet();

    for (let index = 0; index < arrayUsers.length; index++) {
      this.generateRowOfWorkSheet(arrayUsers[index],worksheet)
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

  generateWorksheet(){
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

  generateRowOfWorkSheet(user : any, worksheet : Worksheet){
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
      console.log(worksheet.getRow(row).getCell(firstCell).value);
      if (!worksheet.getRow(row).getCell(firstCell).value) {
        rowFree = row
        break;
      } 

      row++;
    } while (rowFree === -1);

    return rowFree;
  }

}
