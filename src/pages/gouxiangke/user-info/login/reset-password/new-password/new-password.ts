import { CommonData } from './../../../../providers/user/commonData.model';
import { FormBuilder } from '@angular/forms';
import { CommonProvider } from './../../../../providers/common/common';
import { Api } from './../../../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Validators } from '../../../../providers/api/Validators';

/**
 * Generated class for the NewPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-new-password',
  templateUrl: 'new-password.html',
})
export class NewPasswordPage {
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
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public api: Api, 
    public common: CommonProvider, 
    private formBuilder: FormBuilder, 
    public commonData: CommonData
  ) {
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
    this.api.post(this.api.config.host.org + 'v2/user/makenewPwd?mobile='+ this.mobile + '&code=' + this.code + '&password=' + this.modifyPassData.password ).subscribe(data=>{
      if(data.success){
        this.navCtrl.push('PublicLoginPage');
        this.common.tostMsg({msg:"请重新登录"});
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPasswordPage');
  }

}
