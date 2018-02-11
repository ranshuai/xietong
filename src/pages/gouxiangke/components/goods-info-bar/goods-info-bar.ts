import { Component, Input } from '@angular/core';

/**
 * Generated class for the GoodsInfoBarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-info-bar',
  templateUrl: 'goods-info-bar.html'
})
export class GoodsInfoBarComponent {

  @Input() data: any;

  constructor() {
    console.log('Hello GoodsInfoBarComponent Component');
  }

}
