import { CommonProvider } from './../../providers/common/common';
import { Api } from './../../providers/api/api';
import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as IosSelect from 'iosselect';
import { ThirdPartyApiProvider } from './../../../../providers/third-party-api';
/**
 * Generated class for the CustomerServeDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-serve-detail',
  templateUrl: 'customer-serve-detail.html',
})
export class CustomerServeDetailPage {
  orderInfo;

  //售后信息详情
  returnInfo;
  deliveryList; //物流公司列表
  Logistics:any = {}; //物流信息


  constructor(public navCtrl: NavController, public navParams: NavParams, public mainCtrl: MainCtrl, public api: Api,public commonProvider:CommonProvider,public thirdPartyApiProvider:ThirdPartyApiProvider) {
    this.orderInfo = navParams.get('orderInfo')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerServeDetailPage');
    this.getReturnDetail();
    this.getDelivery();
  }

  //售后详情
  getReturnDetail() { 
    this.api.get(this.api.config.host.bl + 'order/return/detail/' + this.orderInfo.id).subscribe((data) => { 
      if (data.success) {
        this.returnInfo = data.result;
      } else { 
        this.commonProvider.showToast(data.msg);
      }
    })
  }

  //撤销申请
  revoke(){
    this.api.delete(this.api.config.host.bl +'order/return/cancel/'+this.orderInfo.id).subscribe(data=>{
      if(data.success){
        this.commonProvider.showToast(data.msg);
        this.navCtrl.pop();
      }else{
        this.commonProvider.showToast(data.msg);
      }
    })
  }
  //选择物流公司
  selectedLogisticsCompany(){
    var iosSelect = new IosSelect(1, [this.deliveryList], {
      headerHeight: 44,
      itemHeight: 35,
      callback: (data) => {
        console.log(data);
        this.Logistics.txt = data.cname;
        this.Logistics.code = data.cvalue;
      }
    });
  }
  //扫描二维码
  scanCode() { 
    // this.thirdPartyApiProvider.scanCode((data) => { 
    //   console.log(data);
    //   this.Logistics.scan = data;
    // });
  }

  //获取物流信息
  getDelivery(){
    this.api.get(this.api.config.host.bl + 'admin/order/delivery').subscribe(data => {
      if (data.success) {
        data.result.forEach(item => {
          item.id = item.cCode;
          item.value = item.cName;
        });
        this.deliveryList = data.result;
      } else {
        this.commonProvider.showToast('获取快递公司列表错误，请稍后再尝试发货~');
      }
    });
  }

  //保存买家的发货信息
  save(){
    if(0){
      this.commonProvider.showToast('请把信息填写完整');
      return 
    }else{
      this.api.get(this.api.config.host.bl + '/order/return/cancel/'+this.orderInfo.id,{ "id":this.orderInfo.id, "shippingCode":this.Logistics.code, "shippingName":this.Logistics.txt, "shippingNo":this.Logistics.scan }).subscribe(data => {
        if(data.success){
          this.commonProvider.showToast(data.msg);
        }else{
          this.commonProvider.showToast(data.msg);
        }
      })
    }

  }

}
