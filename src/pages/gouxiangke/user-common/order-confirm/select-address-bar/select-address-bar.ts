import { NavController } from 'ionic-angular';
import { CommonModel } from './../../../../../providers/CommonModel';
import { Api } from './../../../providers/api/api';
import { Component } from '@angular/core';
import { OrderAddressProvider } from "../../../providers/user/order-address";
import { CommonProvider } from "../../../providers/common/common";
import { GlobalDataProvider } from "../../../providers/global-data/global-data.model";

/**
 * Generated class for the SelectAddressComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'select-address-bar',
  templateUrl: 'select-address-bar.html'
})
export class SelectAddressBarComponent {

  userInfoAddressPage = 'UserInfoAddressPage';
  addressInfo: any;

  constructor(
    private orderAddress: OrderAddressProvider,
    private common: CommonProvider,
    private globalData: GlobalDataProvider,
    public api: Api,
    public navCtrl:NavController,
    public commonModel:CommonModel
  ) {
  }

  getAddress() {
    this.orderAddress.getOrderAddres().subscribe(data => {
      this.addressInfo = data;
      //缓存用户的地址信息 （默认信息||选中的信息）
      this.commonModel.userDefaultAndSetAddres = data;

      console.log( this.commonModel.userDefaultAndSetAddres);
    });
  }

  goToSelectAddress() {
    this.api.config.isEditor = true;
    this.navCtrl.push(this.userInfoAddressPage)
  }

}
