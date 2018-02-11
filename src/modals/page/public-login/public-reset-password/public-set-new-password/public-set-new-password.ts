import { MainCtrl } from './../../../../../providers/MainCtrl';
import { HttpService } from './../../../../../providers/HttpService';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators } from '../../../../../providers/Validators';

/**
 * Generated class for the PublicSetNewPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-set-new-password',
  templateUrl: 'public-set-new-password.html',
})
export class PublicSetNewPasswordPage {
  code:any;
  mobile:any;
  modifyPassForm: any;
  //设置密码输入框对象
  modifyPassData = {
    password: '',
  };

  modifyPassMessages = {
    'password': {
      'errorMsg': '',
      'minlength': '密码最少6位',
      'required': '密码是必填的',
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder:FormBuilder,private httpService:HttpService, private mainCtrl: MainCtrl) {
    this.code = this.navParams.get('code');
    this.mobile = this.navParams.get('mobile');
    console.log(this.code + this.mobile);
    this.modifyPassForm = this.formBuilder.group({
      password: [this.modifyPassData.password, [Validators.required, Validators.minLength(6)]],
    });
    this.modifyPassForm.valueChanges.subscribe(data => {
        const verifyMessages = this.modifyPassMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.modifyPassForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        Object.assign(this.modifyPassData, this.modifyPassForm.value);
      });
  }

  goToLogin(){    
    this.httpService.post(this.httpService.config.host.org + 'v2/user/makenewPwd?mobile='+ this.mobile + '&code=' + this.code + '&password=' + this.modifyPassData.password ).subscribe(data=>{
      if(data.success){
        this.navCtrl.push('PublicLoginPage');
        this.mainCtrl.nativeService.showToast('请重新登录');
      }
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicSetNewPasswordPage');
  }

}
