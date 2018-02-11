import { Config } from './../../../providers/api/config.model';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { CommonProvider } from '../../../providers/common/common';
import { CommonData } from '../../../providers/user/commonData.model';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import { IntervaConfig } from '../../../providers/user/intervaConfig';
import { ThirdPartyApiProvider } from "../../../providers/third-party-api/third-party-api";
import { PayProvider } from "../../../providers/pay/pay";
import { RequestOptions, Headers } from '@angular/http';

/**
 * Generated class for the UserInfoWalletRechargePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-info-wallet-recharge',
  templateUrl: 'user-info-wallet-recharge.html',
})
export class UserInfoWalletRechargePage {

  //表单对象
  walletRechargeForm: any;
  //表单输入对象
  walletRechargeData = {
    money: '',
  };
  //表单验证错误信息
  walletRechargeMessages = {
    'money': {
      'errorMsg': '',
      'required': '金额必填',
      'moneyTrue': '请输入正确金额数字'
    }
 
  };
  payType = 'wx';
  formFlag: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public common: CommonProvider, private formBuilder: FormBuilder, public interva: IntervaConfig, public commonData: CommonData,public thirdPartyApiProvider:ThirdPartyApiProvider,public config:Config) {
      this.walletRechargeForm = this.formBuilder.group({
      money: [this.walletRechargeData.money, [Validators.required,Validators.moneyTrue]],
    });
    this.walletRechargeForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.walletRechargeMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.walletRechargeForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        this.formFlag = this.walletRechargeForm.valid;
        Object.assign(this.walletRechargeData, this.walletRechargeForm.value);
      });
  }


  //充值金额
  moneyChange(number) { 
    switch (number) {
      case 1:
        this.walletRechargeData.money = '100';
        break;
      case 2:
      this.walletRechargeData.money = '200';
      break;  
      case 3:
      this.walletRechargeData.money = '500';
      break;  
      case 4:
        this.walletRechargeData.money = '1000';
        break;    
    }
    this.walletRecharge();
  }

 
  //修改用户支付类型
  changePayType(_type) { 
    this.payType = _type;
  }

  /**用户充值 */
  walletRecharge() {
    if (this.config.PLATFORM == 'APP' || this.config.PLATFORM == 'STOREAPP') {
      if (this.payType == 'wx') {
        let json = {
          channel: this.payType,
          description: '{parent:true}',
          clientIp: '127.0.0.1',
          all:true,
          money:this.walletRechargeData.money
        }
        //用户 充值this.api.config.host.org
        this.api.get(this.api.config.host.org+'finance/charge/'+this.payType+'/get?', json).subscribe((data) => { 
          console.log(data);
          if (data.success) {
            let change = data.result;
            change = JSON.stringify(change);
            this.thirdPartyApiProvider.wxPay(change).subscribe(data => {
              if (data) {
                this.common.showToast('充值成功')
              }
            });
          } else { 
            this.common.showToast(data.msg)
          }
        })
      } else { 
        this.common.tostMsg({msg:'暂不支持此方式'})
      }
      return 
     }
    
    if (this.config.PLATFORM == "WX") {
      if (this.payType == 'wx') {
        let options:any;
        let headers ={
          amount: this.walletRechargeData.money,
          openId:window.localStorage.openId
        };
        options = new RequestOptions({
            headers: new Headers(headers)
        });
        this.api.get(this.api.config.host.org+'v2/weixinPay/wxRechargeUnifiedorder','', options).subscribe((data) => { 
          if (data) {
            let charge = data.result.weiXinPayVo;
              this.thirdPartyApiProvider.wxPay(charge).subscribe(data => {
                if (data) {
                  //充值成功的回调
                  this.common.showToast('充值成功~');
                }
              });
          }
        })
      } else { 
        this.common.tostMsg({msg:'暂不支持此方式'})
      }
     }

  }

}
