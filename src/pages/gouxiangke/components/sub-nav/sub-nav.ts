import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the SubNavComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'sub-nav',
  templateUrl: 'sub-nav.html'
})
export class SubNavComponent {

  @Input() data: any;
  @Output() changeNavEmit = new EventEmitter();

  view: string = 'left';

  constructor() {
  }

  changeNav(view) {
    this.data.view = view;
    this.changeNavEmit.emit(view);
  }

}
