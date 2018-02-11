import { CommonModel } from './../../../../../providers/CommonModel';
import { Config } from './../../../providers/api/config.model';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonData } from '../../../providers/user/commonData.model';
import { Api } from '../../../providers/api/api';
import { CommonProvider } from '../../../providers/common/common';
import { OrderProvider } from "../../../providers/user/order";
import { PayProvider } from "../../../providers/pay/pay";
import { UserInfoOrderPage } from '../../../user-info/user-info-order/user-info-order';
import { PaySuccessPage } from "../../../user-common/order-confirm/pay-success/pay-success";
import { UserSetPasswordPayPage } from "../../user-set/user-set-password/user-set-password-pay/user-set-password-pay";
import {HttpConfig} from "../../../../../providers/HttpConfig";
import {ThirdPartyApiProvider} from "../../../../../providers/third-party-api";
/**
 * Generated class for the UserInfoOrderConfirmPage page.
 *this.mainCtrl.commonModel.TAB_INIT_USERINFO
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-info-order-confirm',
  templateUrl: 'user-info-order-confirm.html',
})
export class UserInfoOrderConfirmPage {
  orderDetail: any;
  payType = 'wx';
    all=true;
  userInfoOrderPage = UserInfoOrderPage;
  paySuccessPage = PaySuccessPage;
  userSetPasswordPayPage=UserSetPasswordPayPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public common: CommonProvider, public api: Api, public commonData: CommonData,
    private order: OrderProvider, private payApi: PayProvider, public config: Config,private httpConfig:HttpConfig,
    public commonModel:CommonModel,private thirdPartProvider:ThirdPartyApiProvider
  ) {
      // 获取all字段值
      this.all=this.navParams.get("all");
    this.getOrderDetail();
  }

  getOrderDetail() {
    this.order.getOrderDetail(this.commonData.user_info_order.orderId).subscribe(data => {
      if (data.success) {
        this.orderDetail = data.result;
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    });
  }

  payTypeChange(_type) {
    this.payType = _type;
  }

  goPay() {
    let dealResult = data => {
      if (data.result == 3001) {
        this.common.showToast(data.msg);
      } else {
        this.common.goToPage(this.paySuccessPage);
      }
    };

    if (this.payType == 'money' || this.payType=='prepay') {
      if(this.commonModel.TAB_INIT_USERINFO&&this.commonModel.TAB_INIT_USERINFO.isPayPwd==1) {
        this.common.openChangeModal('GxkPayPasswordModalPage', true, {orderSn: this.orderDetail.orderSn}).subscribe(data => {
          if (data) {
            if (this.payType == 'prepay') {
              this.payApi.prepay(this.orderDetail.orderSn
                , data.payPassWord, 0).subscribe(data => {
                  if (data.success) {
                      this.common.goToPage(this.paySuccessPage);
                      this.common.tostMsg({msg: data.msg});
                  } else {
                    this.common.tostMsg({msg: data.msg});
                  }
                 })  
            } else { 
              this.payApi.balancePay(this.orderDetail.orderSn, 1, "{ parent: false }", data.payPassWord).subscribe(data => {
                if (data.success) {
                  if (data.result == 3001) {
                    this.common.tostMsg({msg: data.msg});
                  } else {
                    // this.common.popToPage('UserInfoOrderPage');
                    this.common.goToPage(this.paySuccessPage);
                    this.common.tostMsg({msg: data.msg});
                  }
                } else {
                  this.common.tostMsg({msg: data.msg});
                }
              });
            }
          }
        })
      }else{
        this.common.goToPage(this.userSetPasswordPayPage);
      }
    }  else if (this.payType == 'hd') {
      this.payApi.deliveryPay(this.orderDetail.orderSn, "{ parent: false}").subscribe(data => dealResult(data));
    } else if (this.payType == 'wx' || this.payType == 'alipay'&&this.httpConfig.platform=='android' || this.payType == 'upacp') {
        this.payApi.wxPay(this.orderDetail.orderSn,this.payType,false).subscribe(data => {
          if (data) {
            this.common.showToast('支付成功~');
            this.common.goToPage(this.paySuccessPage);
          }
        });
    }else if (this.payType == 'alipay'&&(this.httpConfig.platform=="wx"||this.httpConfig.platform=="web")) {//微信端--支付宝支付
        this.thirdPartProvider.pingppWebPay(this.orderDetail.orderSn,this.all,this.orderDetail.payAmount);

    }
    else {
      this.common.tostMsg({ msg: "暂时不支持该种支付" });
    }
  }



  /**视图离开 */
  ionViewWillLeave() {
  }


}
