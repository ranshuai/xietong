import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the GoodsImgsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-imgs',
  templateUrl: 'goods-imgs.html'
})
export class GoodsImgsComponent {

  @Input() data: any = [];

  constructor(public mainCtrl: MainCtrl) {
    
   }

}
