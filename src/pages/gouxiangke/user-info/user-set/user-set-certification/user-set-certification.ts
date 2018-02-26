import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,IonicPage } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Config } from '../../../providers/api/config.model';
import { Api } from '../../../providers/api/api';
import { Validators } from "../../../providers/api/Validators";
import { CommonProvider } from "../../../providers/common/common";
import {CommonData } from "../../../providers/user/commonData.model";

/**
 * Generated class for the UserSetCertificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-set-certification',
  templateUrl: 'user-set-certification.html',
})
export class UserSetCertificationPage {
  userInfo: any;
  userForm: any;
  verifyMessages = {
    'idCardName': {
      'errorMsg': '',
      'required': '用户名为必填项',
      'minlength': '姓名最少2个字符',
      'chinese': '姓名必须是中文'
    },
    'idCard': {
      'errorMsg': '',
      'required': '手机号码为必填项',
      'idCard': '请输入正确的手机号码'
    },
    'bankCard': {
      'errorMsg': '',
      'required': '银行卡号为必填',
      'bankCard': '请输入银行卡号为必填'
    }
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public config: Config, private formBuilder: FormBuilder,
    private viewCtrl: ViewController, public commonProvider: CommonProvider,public commonData:CommonData) {

    this.userInfo = this.commonData.user_info_certification;
    if (!this.commonData.user_info_certification_real) {
      this.userInfo = {
        'idCardName': "",
        'idCard': "",
        'bankCard': ""
      }
    }
    this.formDadaInit();
  }
  
  formDadaInit() { 
       this.userForm = this.formBuilder.group({
      idCardName: [this.userInfo.idCardName, [Validators.required, Validators.minLength(2), Validators.chinese]],
      idCard: [this.userInfo.idCard, [Validators.required]],
      bankCard: [this.userInfo.bankCard, [Validators.required]]
    });
    this.userForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.verifyMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.userForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
      });
  }

  submit() {
     Object.assign(this.userInfo, this.userForm.value);
    this.api.post(this.api.config.host.org + 'user/real/sub', this.userInfo).subscribe(data => {
      if (data) {
        if (data.result.status == 10113) {
          this.commonProvider.tostMsg({ msg: '实名认证成功' });
          this.commonData.user_info_certification = this.userInfo;
          this.commonData.user_info_certification_real = true;
          this.navCtrl.pop();
        } else if (data.status == 203) {
          this.commonProvider.tostMsg({ msg: '银行卡号不正确' });
        } else if (data.status == 206) {
          this.commonProvider.tostMsg({ msg: '身份证号不正确' });
        } else {
          this.commonProvider.tostMsg({ msg: '实名认证失败，请检查提交信息' });
        }
      }
    });
  }
 //延迟测试
    timeSet(){
      setTimeout(data => { 
        return true
      }, 3000)
    }



}
