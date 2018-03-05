import { CommonModel } from './../../../../providers/CommonModel';
import { Component } from '@angular/core';
import { NavController, NavParams,Events,IonicPage } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';
import {UserInfoAddressNewPage } from '../user-info-address/user-info-address-new/user-info-address-new';
import { UserInfoAddressEditorPage } from '../user-info-address/user-info-address-editor/user-info-address-editor';
import { OrderAddressProvider } from '../../providers/user/order-address';
/**
 * Generated class for the UserInfoAddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-address',
  templateUrl: 'user-info-address.html',
})
export class UserInfoAddressPage {
  //地址列表
  addressList: any;
  userInfoAddressNewPage = 'UserInfoAddressNewPage';  //新建地址
  userInfoAddressEditorPage = 'UserInfoAddressEditorPage'; //编辑地址
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: Api, public common: CommonProvider,public orderAddressData:OrderAddressProvider,public events:Events,public commonModel:CommonModel) {
  }

 
  //查询地址
  querryAddres() {
    this.api.get(this.api.config.host.bl + 'address/all').subscribe(data => {
      console.log(data)
      if (data.success) {
        this.addressList = data.result;
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }
  //跳转添加地址页面
  goToPageAddressNewPage() {
    this.navCtrl.push(this.userInfoAddressNewPage)
  }
  
  //跳转地址编辑页面
  goToPageEditorAddressPage(_item) {
    if (this.api.config.isEditor) { 
      this.orderAddressData.data = _item;
      this.navCtrl.pop();
    } else {
        this.navCtrl.push(this.userInfoAddressEditorPage, {
          addressId: _item.addressId
        })
    }
    this.commonModel.freightOrderGoods = 0; //重新选择地址把运费设置为 0；
  }
 
  
  
  ionViewDidEnter() {
     this.querryAddres();
  }

    ionViewWillLeave() {
  }
}
