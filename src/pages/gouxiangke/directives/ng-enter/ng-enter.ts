import { Directive, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the NgEnterDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[ngEnter]', // Attribute selector
  host: {
    '(keyup)': 'onKeyup($event)'
  }
})
export class NgEnterDirective {

  @Output() ngEnter = new EventEmitter();

  constructor() { }

  onKeyup(event) {
    if (event.keyCode == 13) {
      this.ngEnter.emit();
    }
  }

}
