import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appColourState]',
  standalone: true
})
export class ColourStateDirective {

  constructor(private el : ElementRef) { }
  @Input() state = '';
  ngOnInit(): void 
  {
    switch(this.state)
    {
      case "cancelado":
      case 'rechazado':
        this.el.nativeElement.style.color = "red";
      break;
      case 'pendiente':
        this.el.nativeElement.style.color = "rgb(20, 138, 192)";
      break;
      case 'completado':
        this.el.nativeElement.style.color = "green";
      break;
      case 'aceptado':
        this.el.nativeElement.style.color = "#4FC3A1";
      break;
    }
  }


}
