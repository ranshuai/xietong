import { Component, Input } from '@angular/core';

/**
 * Generated class for the TitleMoreComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'title-more',
  templateUrl: 'title-more.html'
})
export class TitleMoreComponent {

  @Input() title: any;
  @Input() noMore: Boolean = false;

  constructor() { }
}
