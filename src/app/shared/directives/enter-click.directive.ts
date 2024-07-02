import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEnterClick]',
  standalone: true
})
export class EnterClickDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Enter' ) {
      const button = this.el.nativeElement.querySelector('button');
      if (button && !button.disabled) {
        button.click();
      }
    }
  }

}
