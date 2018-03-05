import { NavController } from 'ionic-angular';
import { CommonModel } from './../../../../providers/CommonModel';
import { Component, Input } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ShoppingCart } from '../../providers/user/shopping-cart';
import { CommonProvider } from "../../providers/common/common";
import { GlobalDataProvider } from "../../providers/global-data/global-data.model";
/**
 * Generated class for the UserShoppingCartComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'user-shopping-cart',
  templateUrl: 'user-shopping-cart.html'
})
export class UserShoppingCartComponent {

  constructor(
    public shoppingCart: ShoppingCart,
    private common: CommonProvider,
    private viewCtrl: ViewController,
    private globalData: GlobalDataProvider,
    public commonModel: CommonModel,
    public navCtrl:NavController
  ) {
    shoppingCart.getShoppingCartInfo().subscribe();
  }

  openShoppingCartPage() {
    this.navCtrl.push('UserShoppingCartDetailPage', { shoppCartFlag: true });
  }

}
