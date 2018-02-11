import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Generated class for the NgShowDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[ngShow]' // Attribute selector
})
export class NgShowDirective {

  @Input() ngShow: any;

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  ngOnChanges(changes) {
    let show = changes.ngShow.currentValue;
    if (show) {
      this.element.nativeElement.style.display = 'block';
    } else {
      this.element.nativeElement.style.display = 'none';
    }
  }
}
