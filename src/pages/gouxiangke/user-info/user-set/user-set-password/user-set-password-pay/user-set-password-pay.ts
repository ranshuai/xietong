import { CommonModel } from './../../../../../../providers/CommonModel';
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Api} from '../../../../providers/api/api';
import {CommonProvider} from '../../../../providers/common/common';
import {FormBuilder} from '@angular/forms';
import {Validators} from "../../../../providers/api/Validators";
import { CommonData } from "../../../../providers/user/commonData.model";

/**
 * Generated class for the UserSetPasswordPayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-set-password-pay',
  templateUrl: 'user-set-password-pay.html',
})
export class UserSetPasswordPayPage {
  userPaymentPwd;
  //数据是否加载完毕
  loading: boolean = false;

  modifyPayPassForm: any;
  //设置密码输入框对象
  modifyPayPassData = {
    password: '',
  };

  modifyPayPassMessages = {
    'password': {
      'errorMsg': '',
      'minlength': '密码最少6位',
      'required': '密码是必填的',
      'money': '密码必须是数字',
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public common: CommonProvider, private formBuilder: FormBuilder, public commonData: CommonData,public commonModel:CommonModel) {
    this.modifyPayPassForm = this.formBuilder.group({
      password: [this.modifyPayPassData.password, [Validators.required, Validators.minLength(6), Validators.money]],
    });
    this.modifyPayPassForm.valueChanges
      .subscribe(data => {
        console.log('表单数据改变了');
        const verifyMessages = this.modifyPayPassMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.modifyPayPassForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        Object.assign(this.modifyPayPassData, this.modifyPayPassForm.value);
      });

  }

  //检测用户是否设置过支付密码
  checkPayPass() {
    this.api.post(this.api.config.host.org + 'user/paypwd/check', {}).subscribe(data => {
      if (data.success) {
        this.userPaymentPwd = data.result;
        this.loading = true;
        // this.userPaymentPwd = true;
      } else {
        this.loading = false;
        this.common.tostMsg({msg: data.msg})
      }
    })
  }

  //设置支付密码
  paymentPwd(_num) {
    if (this.modifyPayPassData.password.match(/^[0-9]+$/) == null) {
      this.common.tostMsg({ msg: "请输入数字密码" });
    } else {
      let url;
      if (_num == 1) {
        url = 'user/paypwd/set?optType=' + _num + '&payPassword=' + this.modifyPayPassData.password
      } else {
        url = 'v2/myinfo/updatePassword?pwdType=' + _num + '&pwd=' + this.modifyPayPassData.password
      }
  
      this.api.post(this.api.config.host.org + url, {}).subscribe(data => {
        if (data.success) {
          this.common.tostMsg({msg: data.msg});
          this.commonModel.TAB_INIT_USERINFO.isPayPwd=1;
          // $location.path('/user_set');
          this.navCtrl.pop();
        } else {
          this.common.tostMsg({msg: data.msg})
        }
      })
    }
  }

  ionViewDidEnter() {
    this.checkPayPass();
    console.log('页面加载了重新调取验证码')
  }

  ionViewWillLeave() {
  }
}

