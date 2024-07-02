import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltipTittle]',
  standalone: true
})
export class TooltipTittleDirective {
  @Input('appTooltipTittle') tooltipTitle!: string;
  tooltip: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) { this.showTooltip(); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) { this.hideTooltip(); }
  }

  private showTooltip() {
    this.tooltip = this.renderer.createElement('span');
    this.tooltip.innerText = this.tooltipTitle;
    this.renderer.appendChild(document.body, this.tooltip);
    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'backgroundColor', 'black');
    this.renderer.setStyle(this.tooltip, 'color', 'white');
    this.renderer.setStyle(this.tooltip, 'padding', '5px');
    this.renderer.setStyle(this.tooltip, 'borderRadius', '5px');
    this.setPosition();
  }

  private hideTooltip() {
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;
  }

  private setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();

    const top = hostPos.top - tooltipPos.height - 10;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }

}
