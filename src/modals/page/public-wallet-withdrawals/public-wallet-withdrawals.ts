import { NativeService } from './../../../providers/NativeService';
import { Validators } from './../../../providers/Validators';
import { FormBuilder } from '@angular/forms';
import { MainCtrl } from './../../../providers/MainCtrl';
import { HttpService } from './../../../providers/HttpService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PublicWalletWithdrawalsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-wallet-withdrawals',
  templateUrl: 'public-wallet-withdrawals.html',
})
export class PublicWalletWithdrawalsPage {
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private mainCtrl: MainCtrl,
    private formBuilder: FormBuilder,
    private nativeService: NativeService,
  ) {
    this.getImgCode();
    this.walletWithdrawalsForm = this.formBuilder.group({
      money: [this.walletWithdrawalsData.money, [Validators.required, Validators.money]],
      code: [this.walletWithdrawalsData.code, [Validators.required]],
      imgCode: [this.walletWithdrawalsData.imgCode, [Validators.required]],
      payPass: [this.walletWithdrawalsData.payPass, [Validators.required,Validators.legallyNamed]],
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
    this.httpService.get(this.httpService.config.host.org + 'v2/user/getImageCode', { uuid:this.mainCtrl.httpService.config.uuid }).subscribe(data => {
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
      this.nativeService.showToast( '图形验证码必填' )
    } else {
      //图片验证码是否正确
      if (!this.imgCodeFlag) { 
        if (!this.isend&&this.mainCtrl.commonModel.interva.walletWithdrawals==60) {
            this.isend = true;
            this.httpService.get(this.httpService.config.host.org + 'v2/user/getPhoneCode1', {
              imageCode: this.walletWithdrawalsData.imgCode,
              mobile:this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile,
              uuid:this.mainCtrl.httpService.config.uuid
            }).subscribe(data => {
              if (data.success) {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(() => {
                  if (this.mainCtrl.commonModel.interva.walletWithdrawals != 0) {
                    this.mainCtrl.commonModel.interva.walletWithdrawals--;
                  } else {
                    this.mainCtrl.commonModel.interva.walletWithdrawals = 60;
                    this.isend = false;
                    clearInterval(this.timeInterval);
                  }
                }, 1000); 
                this.nativeService.showToast(data.msg);
              } else {
                this.nativeService.showToast(data.msg || '网络连接异常');
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
      this.httpService.get(this.httpService.config.host.org + 'finance/decr/outsidemoneyfa', {
        money: this.walletWithdrawalsData.money,
        pwd: this.walletWithdrawalsData.payPass,       
        code: this.walletWithdrawalsData.code,        
      }).subscribe(data => {
        if (data.success) {
          if (data.result.status == 200) {
            this.mainCtrl.nativeService.showToast( data.msg );
          } else {
            this.mainCtrl.nativeService.showToast( data.msg );
          }
        } else {
          this.mainCtrl.nativeService.showToast( data.msg );
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicWalletWithdrawalsPage');
  }

}
