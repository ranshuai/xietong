import { HttpService } from './../../../../providers/HttpService';
import { FormBuilder } from '@angular/forms';
import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators } from '../../../../providers/Validators';

/**
 * Generated class for the PublicResetPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-reset-password',
  templateUrl: 'public-reset-password.html',
})
export class PublicResetPasswordPage {
  onlyCode:any;
  type: any;
  //模拟线程锁
  isend: boolean = false;
  //图片验证码是否正确
  imgCodeFlag: boolean = false;
  //图片验证码信息
  imgCode = {
    'img': undefined,
    'error': false,
    'codeName': undefined
  };
  //手机验证码信息
  timeInterval;
  modifyPasswordForm: any;
  //设置密码输入框对象
  modifyPasswordData = {
    phone: '',
    code: '',
    imgCode: ''
  };

  modifyPasswordMessages = {
    'phone': {
      'errorMsg': '',
      'required': '手机号是必填的',
    },
    'code': {
      'errorMsg': '',
      'required': '短信验证码必填',
    },
    'imgCode': {
      'errorMsg': '',
      'required': '图形验证码必填',
    },
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, private mainCtrl: MainCtrl, private formBuilder: FormBuilder, private httpService: HttpService) {
    this.getImgCode();
    this.modifyPasswordForm = this.formBuilder.group(
      {
        phone: [this.modifyPasswordData.phone, [Validators.required, Validators.maxLength(11)]],
        code: [this.modifyPasswordData.code, [Validators.required, Validators.maxLength(4)]],
        imgCode: [this.modifyPasswordData.imgCode, [Validators.required, Validators.maxLength(4)]]
      }
    );
    this.modifyPasswordForm.valueChanges.subscribe(data => {
      const verifyMessages = this.modifyPasswordMessages;
      for (const field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        const control = this.modifyPasswordForm.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = verifyMessages[field];
          for (const key in control.errors) {
            messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
          }
        }
      }
      Object.assign(this.modifyPasswordData, this.modifyPasswordForm.value);
    });
    
  }

  onBlur(){
    this.httpService.post(this.httpService.config.host.org + 'v2/user/isExitByMobile?mobile='+this.modifyPasswordData.phone).subscribe(data=>{
      if(!data.success){
        this.modifyPasswordMessages.phone.errorMsg =  data.msg;
      }
    })
  }
 /**获取图形验证码 */
  getImgCode() {
    this.imgCode.error = false;
    this.httpService.get(this.httpService.config.host.org + 'v2/user/getImageCode', { uuid: this.httpService.config.uuid }).subscribe(data => {
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
  if (this.modifyPasswordData.imgCode != this.imgCode.codeName) {
    this.imgCodeFlag = true;
  } else {
    this.modifyPasswordMessages.imgCode.errorMsg = '';
    this.imgCodeFlag = false;
  }
}

/**获取手机验证码 */
getPhoneCode() {
  if (this.modifyPasswordData.imgCode == '' || this.modifyPasswordData.phone == '') {
    this.mainCtrl.nativeService.showToast( '图形验证码和手机号必填' )
  } else {
    //图片验证码是否正确
    if (this.imgCodeFlag) {
      this.modifyPasswordMessages.imgCode.errorMsg = '验证码不正确';
    }else{
      if (!this.isend && this.mainCtrl.commonModel.interva.walletWithdrawals == 60) {
        this.isend = true;
        this.httpService.get(this.httpService.config.host.org + 'v2/user/getPhoneCode1', {
          imageCode: this.modifyPasswordData.imgCode,
          mobile: this.modifyPasswordData.phone,
          uuid: this.httpService.config.uuid
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
            this.mainCtrl.nativeService.showToast( data.msg );
          } else {
            this.mainCtrl.nativeService.showToast( data.msg||'网络连接异常' );
            this.isend = false;
            this.getImgCode();
          }
        });
      }
    }
  }
}
gotoNewPassword(){
  this.httpService.post(this.httpService.config.host.org + 'v2/user/makeRandomCode?mobile=' + this.modifyPasswordData.phone + '&msgCode=' + this.modifyPasswordData.code).subscribe(data=>{
    if(data.success){
      this.onlyCode = data.result.code;
      this.pushPage();
    }else{
      this.mainCtrl.nativeService.showToast( data.msg );
    }
  })
}

pushPage(){
  this.navCtrl.push('PublicSetNewPasswordPage',{
    code:this.onlyCode,
    mobile:this.modifyPasswordData.phone
  })
}  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicResetPasswordPage');
  }

}
