import { Component, Input } from '@angular/core';

/**
 * Generated class for the GoodsInfoBarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'public-goods-info-bar',
  templateUrl: 'public-goods-info-bar.html'
})
export class PublicGoodsInfoBarShared {

  @Input() data: any;

  constructor() {
    console.log('Hello GoodsInfoBarComponent Component');
  }

}
