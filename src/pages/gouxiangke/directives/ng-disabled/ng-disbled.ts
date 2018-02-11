import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Generated class for the NgShowDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[ngDisbled]' // Attribute selector
})
export class NgDisbledDirective {

  @Input() ngDisbled: any;

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  ngOnChanges(changes) {
    let show = changes.ngDisbled.currentValue;
    if (show) {
      this.element.nativeElement.style.pointerEvents = 'none';
    } else {
      this.element.nativeElement.style.pointerEvents = 'auto';
    }
  }
}
