import { Component, Input } from '@angular/core';

/**
 * Generated class for the GoodsImgsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'public-goods-imgs',
  templateUrl: 'public-goods-imgs.html'
})
export class PublicGoodsImgsShared {

  @Input() data: any = [];

  constructor() { }

}
