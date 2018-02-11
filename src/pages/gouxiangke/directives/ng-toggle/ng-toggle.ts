import { Directive, ElementRef } from '@angular/core';

/**
 * Generated class for the NgToggleDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[ng-toggle]', // Attribute selector
  host: {
    '(click)': 'onClick($event)'
  }
})
export class NgToggleDirective {

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  onClick(event) {
    let ionToggle = this.element.nativeElement.querySelector('ion-toggle');
  }

}
