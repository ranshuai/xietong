import { CommonModel } from './../../../../../providers/CommonModel';
import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { CommonProvider } from '../../../providers/common/common';
import { CommonData } from '../../../providers/user/commonData.model';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import { IntervaConfig } from '../../../providers/user/intervaConfig';

/**
 * Generated class for the UserInfoWalletWithdrawalsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-wallet-withdrawals',
  templateUrl: 'user-info-wallet-withdrawals.html',
})
export class UserInfoWalletWithdrawalsPage {
  userInfoWalletPage = 'UserInfoWalletPage';
  //默认提现金额
  defaultMoney;
  //模拟线程锁
  isend: boolean = false;
  //图片验证码是否正确
  imgCodeFlag: boolean = false;
  //图片验证码信息
  imgCode = {
    'img': undefined,
    'error': false,
    'codeName':undefined
  };
  //手机验证码信息
  timeInterval;
  //表单对象
  walletWithdrawalsForm: any;
  //表单输入对象
  walletWithdrawalsData = {
    money: '',
    code: '',
    imgCode: '',
    payPass: '',
    // aliAccount: '',
    // confirmAccount: '',
  };
  //表单验证错误信息
  walletWithdrawalsMessages = {
    'money': {
      'errorMsg': '',
      'required': '金额必填',
      'money': '请输入正确金额数字'
    },
    'code': {
      'errorMsg': '',
      'required': '短信验证码必填',
    },
    'imgCode': {
      'errorMsg': '',
      'required': '图形验证码必填',
    },
    'payPass': {
      'errorMsg': '',
      'required': '密码必填',
    },
    // 'aliAccount': {
    //   'errorMsg': '',
    //   'required': '支付宝账户必填',
    // },
    // 'confirmAccount': {
    //   'errorMsg': '',
    //   'required': '支付宝账户必填',
    // }
  };

  formFlag: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public common: CommonProvider, private formBuilder: FormBuilder, public interva: IntervaConfig, public commonData: CommonData, public commonModel: CommonModel) {
    this.defaultMoney = '提现金额最低'+this.commonModel.APP_INIT['getAppconfig'].data.min_withdraw+'元' ;
    this.walletWithdrawalsForm = this.formBuilder.group({
      money: [this.walletWithdrawalsData.money, [Validators.required, Validators.money]],
      code: [this.walletWithdrawalsData.code, [Validators.required]],
      imgCode: [this.walletWithdrawalsData.imgCode, [Validators.required]],
      payPass: [this.walletWithdrawalsData.payPass, [Validators.required,Validators.legallyNamed]],
      // aliAccount: [this.walletWithdrawalsData.aliAccount, [Validators.required]],
      // confirmAccount: [this.walletWithdrawalsData.confirmAccount, [Validators.required]],
    });
    this.walletWithdrawalsForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.walletWithdrawalsMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.walletWithdrawalsForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        this.formFlag = this.walletWithdrawalsForm.valid;
        Object.assign(this.walletWithdrawalsData, this.walletWithdrawalsForm.value);
      });
  }


  /**获取图形验证码 */
  getImgCode() {
    this.imgCode.error = false;
    this.api.get(this.api.config.host.org + 'v2/user/getImageCode', { uuid:this.api.UUID }).subscribe(data => {
      if (data.success) {
        this.imgCode.img = data.result.img;
        this.imgCode.codeName = data.result.codeName;
        this.checkImgCode();
      } else {
        this.imgCode.error = true;
      }
    });
  }

   /**验证**/
   checkImgCode() { 
    if (this.walletWithdrawalsData.imgCode != this.imgCode.codeName) {
      this.imgCodeFlag =true;
      this.walletWithdrawalsMessages.imgCode.errorMsg = '验证码不正确';
    }else { 
      this.walletWithdrawalsMessages.imgCode.errorMsg = '';
      this.imgCodeFlag =false;
    }
  }


  /**获取手机验证码 */
  getPhoneCode() {
    if (this.walletWithdrawalsData.imgCode == '' ) {
      this.common.tostMsg({ msg: '图形验证码必填' })
    } else {
      //图片验证码是否正确
      if (!this.imgCodeFlag) { 
        if (!this.isend&&this.interva.walletWithdrawals==60) {
            this.isend = true;
            this.api.get(this.api.config.host.org + 'v2/user/getPhoneCode1', {
              imageCode: this.walletWithdrawalsData.imgCode,
              mobile:this.commonModel.TAB_INIT_USERINFO.mobile,
              uuid:this.api.UUID
            }).subscribe(data => {
              if (data.success) {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(() => {
                  if (this.interva.walletWithdrawals != 0) {
                    this.interva.walletWithdrawals--;
                  } else {
                    this.interva.walletWithdrawals = 60;
                    this.isend = false;
                    clearInterval(this.timeInterval);
                  }
                }, 1000); 
                this.common.tostMsg({msg: data.msg});
              } else {
                this.common.tostMsg({ msg: data.msg || '网络连接异常' })
                this.isend = false;
                this.getImgCode();
              }
            });
        }
      }
    }  
  }

  /**用户提现 */
  Withdrawal() {
    if (this.walletWithdrawalsData.money > this.commonData.user_info_wallet.money) { 
      this.common.tostMsg({ msg: '提现金额不能大于当前余额' });
      return false;
    }
    if (this.walletWithdrawalsData.money< (10+'')) { 
      this.common.tostMsg({ msg: '提现金额不能小于10元' });
      return false;
    }






    // if (this.walletWithdrawalsData.aliAccount == this.walletWithdrawalsData.confirmAccount) {
      this.api.get(this.api.config.host.org + 'finance/decr/outsidemoneyfa', {
        money: this.walletWithdrawalsData.money,
        pwd: this.walletWithdrawalsData.payPass,       
        code: this.walletWithdrawalsData.code,        
        // aliAddr1: this.walletWithdrawalsData.aliAccount,
        // aliAddr2: this.walletWithdrawalsData.confirmAccount
      }).subscribe(data => {
        if (data.success) {
          if (data.result.status == 200) {
            this.common.tostMsg({ msg: data.msg });
            this.navCtrl.push(this.userInfoWalletPage, {});
          } else {
            this.common.tostMsg({ msg: data.msg });
          }
        } else {
          this.common.tostMsg({ msg: data.msg });
        }
      });
    // } else {
    //   this.common.tostMsg({ msg: '两次输入的收款账号不一致' });
    // }

  }
  ionViewDidLoad() {
    this.getImgCode();
    console.log(this.commonData.user_info_wallet.money);
  }

    ionViewWillLeave() {
  }
}

