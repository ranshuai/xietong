import { HttpConfig } from './../../../../../providers/HttpConfig';
import { CommonModel } from './../../../../../providers/CommonModel';
import { Config } from './../../../providers/api/config.model';
import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { CommonProvider } from "../../../providers/common/common";
import { PayProvider } from "../../../providers/pay/pay";
// import { PaySuccessPage } from "../pay-success/pay-success";
import {CommonData} from "../../../providers/user/commonData.model";
import {Api} from "../../../providers/api/api";
import { ShoppingCart } from "../../../providers/user/shopping-cart";
import { GlobalDataProvider } from "../../../providers/global-data/global-data.model";
import {ThirdPartyApiProvider} from "../../../../../providers/third-party-api";
/**
 * Generated class for the OrderPayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-order-pay-old',
  templateUrl: 'order-pay-old.html',
})
export class OrderPayOldPage {

  paySuccessPage = 'PaySuccessPage';
  userSetPasswordPayPage='UserSetPasswordPayPage'; //设置密码|修改密码
  order: any;
  storeIds: any; //为了调用 支付方式查询 接口 需要的字段
  payTypes: any = {};
  payChannel: string = 'wx';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private common: CommonProvider,
    private pay: PayProvider,
    public commonData:CommonData,
    public api: Api,
    public shoppingCart: ShoppingCart,
    public globalDataProvider: GlobalDataProvider,
    public config: Config,
    public commonModel: CommonModel,
    public httpConfig:HttpConfig,private thirdPartProvider:ThirdPartyApiProvider

  ) {
    this.order = navParams.get('order');
    this.storeIds = navParams.get('storeIds');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPayPage');
    //查看购物车的数量
    this.shoppingCart.getShoppingCartInfo().subscribe(data => {

    })
    
     //支付方式查询
     this.api.get(this.api.config.host.org + 'companyInfo/payType/multiple', {
      storeIds:this.storeIds
    }).subscribe(data => { 
      if (data.success) {
        this.payTypes = data.result;
      }
    })

  }

  ionViewDidLeave(){
    console.log(this.navCtrl);
    console.log('LIKAI order-pay=========================>>>>>>>>>>>>>');
  }

  checkPayChannel(type) {
    this.payChannel = type;
  }

  payOrder() {
    if (this.order.payAmount == 0) {
      this.api.getUserInfo();
      if (this.commonModel.TAB_INIT_USERINFO.isPayPwd == 1) {
        this.common.openChangeModal('GxkPayPasswordModalPage', true, {orderSn: this.order.orderSn,}).subscribe(data => {
          if (data) {
            this.pay.balancePay(this.order.orderSn, 1, "{ parent: true }", data.payPassWord,).subscribe(data => {
              if (data.success) {
                if (data.result == 3001) {
                  this.common.tostMsg({msg: data.msg});
                } else {
                  // this.common.popToPage('UserInfoOrderPage');
                  this.navCtrl.push(this.paySuccessPage);
                  this.common.tostMsg({msg: data.msg});
                }
              } else {
                this.common.tostMsg({msg: data.msg});
              }
            });
          }
        })
      }
    }else {
      let dealResult = data => {
        if (data.result == 3001) {
          this.common.showToast(data.msg);
        } else {
          this.navCtrl.push(this.paySuccessPage)
        }
      };
      //微信支付||app支付宝支付||银联支付
      if (this.payChannel == 'wx' || (this.payChannel == 'alipay'&&this.httpConfig.platform=='android') || this.payChannel == 'upacp') {
        console.log(this.payChannel);
        this.pay.wxPay(this.order.orderSn,this.payChannel,true).subscribe(data => {
          if (data) {
            this.common.showToast('支付成功~');
            this.navCtrl.push(this.paySuccessPage)  
          }
        });
      } else if (this.payChannel == 'balance' || this.payChannel == 'prepay') {
        this.api.getUserInfo();
        if ( this.commonModel.TAB_INIT_USERINFO.isPayPwd == 1) {
          this.common.openChangeModal('GxkPayPasswordModalPage', true, {orderSn: this.order.orderSn,}).subscribe(data => {
            if (data) {
              if (this.payChannel == 'prepay') {
                this.pay.prepay(this.order.orderSn
                  , data.payPassWord, 1).subscribe(data => {
                    if (data.success) {
                      this.navCtrl.push(this.paySuccessPage);
                      this.common.tostMsg({msg: data.msg});
                    } else {
                      this.common.tostMsg({msg: data.msg});
                    }
                   })  
              } else {
                this.pay.balancePay(this.order.orderSn, 1, "{ parent: true }", data.payPassWord,).subscribe(data => {
                  if (data.success) {
                    if (data.result == 3001) {
                      this.common.tostMsg({msg: data.msg});
                    } else {
                      // this.common.popToPage('UserInfoOrderPage');
                      this.navCtrl.push(this.paySuccessPage);
                      this.common.tostMsg({msg: data.msg});
                    }
                  } else {
                    this.common.tostMsg({msg: data.msg});
                  }
                });
               }
            }
          })

        } else {
          this.navCtrl.push(this.userSetPasswordPayPage)
        }

      } else if (this.payChannel == 'delivery') {
        this.pay.deliveryPay(this.order.orderSn).subscribe(data => dealResult(data));
      }else if (this.payChannel == 'alipay'&&(this.httpConfig.platform=="wx"||this.httpConfig.platform=="web")) {//微信端--支付宝支付
          this.thirdPartProvider.pingppWebPay(this.order.orderSn,true,this.order.payAmount);

      }
    }
  }

}
