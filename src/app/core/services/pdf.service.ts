// pdf.service.ts
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async downloadPdf(title: string, tableData: Array<any>, watermark: string, namePdf: string) {
    let todayDate: Date = new Date();
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();


    const imageData = await this.transformImage('../../../assets/clinic.jpg');
    doc.addImage(imageData, 'PNG', (pageWidth - 50) / 2, 10, 50, 50);

    doc.setFontSize(20);
    doc.setTextColor('#4FC3A1');
    doc.text(title, pageWidth / 2, 70, { align: 'center' });

 
    doc.setTextColor(0); 
    const tableY = 80;
    autoTable(doc, {
      startY: tableY,
      head: [tableData[0]],
      body: tableData.slice(1),
      styles: { fontSize: 8, textColor: 0 }, 
    });

    
    const finalY = (doc as any).lastAutoTable.finalY || tableY;


    doc.setFontSize(10);
    doc.setTextColor(0); 
    doc.text('Fecha de emision : ' + todayDate.toLocaleString(), 10, finalY + 10);


    doc.setTextColor(200); 
    doc.setFontSize(40);
    const watermarkText = watermark.split('\n');
    watermarkText.forEach((text, index) => {
      doc.text(text, pageWidth / 2, pageHeight / 2 + (index * 10), {
        align: 'center',
        angle: 45,
      });
    });


    doc.save(namePdf + '.pdf');
  }

  private transformImage(url: string) {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  }
}