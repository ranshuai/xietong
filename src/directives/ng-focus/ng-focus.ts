import { Directive, ElementRef, Input } from '@angular/core';
/**
 * Generated class for the NgShowDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[ngFocus]' // Attribute selector
})
export class ngFocusDirective {


  @Input() ngFocus: any;

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.element.nativeElement.getElementsByTagName("input")[0].focus()
        }, 850);
      }
}
