import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Api } from '../../../providers/api/api';
import { Validators } from "../../../providers/api/Validators";
import { CommonProvider } from "../../../providers/common/common";
import { IntervaConfig } from '../../../providers/user/intervaConfig';
import { UserSetPasswordPage } from './../user-set-password/user-set-password';

/**
 * Generated class for the UserSetVerificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-set-verification',
  templateUrl: 'user-set-verification.html',
})
export class UserSetVerificationPage {
  //form表单名称
  setLoginPassForm: any;
  //修改密码输入框对象
  setPassWordData = {
    mobile: '',
    imageCode: '',
    msgCode: '',
    uuid:this.api.UUID
  };
  //表单验证信息
  verifyMessages = {
    'mobile': {
      'errorMsg': '',
      'required': '密码是必填的',
      'legallyNamed': '英文、数字、下划线',
      'maxlenght': '最多10位'
    },
    'imageCode': {
      'errorMsg': '',
      'required': '图形验证码是必填的',
    }
    ,
    'msgCode': {
      'errorMsg': '',
      'required': '短信验证码是必填的',
    }
  };
  //图片验证码信息
  imgCode = {
    'img':undefined,
    'error': false,
    'codeName':undefined
  };
  //手机验证码信息
  timeInterval;
  //模拟线程锁
  isend: boolean = false;
  //图片验证码是否正确
  imgCodeFlag: boolean = false;
  userSetPasswordPage = UserSetPasswordPage;
  mobile;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    private formBuilder: FormBuilder,
    public interva: IntervaConfig,
    public common: CommonProvider
  ) {
    this.setLoginPassForm = this.formBuilder.group({
      mobile: [this.setPassWordData.mobile, [Validators.required,Validators.legallyNamed]],
      imageCode: [this.setPassWordData.imageCode, [Validators.required]],
      msgCode: [this.setPassWordData.msgCode, [Validators.required,Validators.maxLength(4)]]
    });
    this.setLoginPassForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.verifyMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.setLoginPassForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
         Object.assign(this.setPassWordData, this.setLoginPassForm.value);
      });
    this.getImgCode();
    this.getUserInfo();
  }
  /**获取图形验证码 */
  getImgCode() { 
    this.imgCode.error = false;
    this.api.get(this.api.config.host.org + 'v2/user/getImageCode',{uuid:this.api.UUID}).subscribe(data => {
                if (data.success) {
                  this.imgCode.img = data.result.img;
                  this.imgCode.codeName = data.result.codeName;
                  this.checkImgCode();
                } else {
                  this.imgCode.error = true;
                }
    });
  }

  /**获取手机验证码 */
  getPhoneCode() {
    if (this.setPassWordData.imageCode == '') {
      this.common.tostMsg({ msg: '图形验证码必填' })
    } else {
      //图片验证码是否正确
      if (!this.imgCodeFlag) { 
        if (!this.isend&&this.interva.modifyMobile==60) {
            this.isend = true;
            this.api.get(this.api.config.host.org + 'v2/user/getPhoneCode1', {
              imageCode:this.setPassWordData.imageCode,
              mobile:this.setPassWordData.mobile,
              uuid:this.api.UUID
            }).subscribe(data => {
              if (data.success) {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(() => {
                  if (this.interva.modifyMobile != 0) {
                    this.interva.modifyMobile--;
                  } else {
                    this.interva.modifyMobile = 60;
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




  /**验证**/
  checkImgCode() { 
    if (this.setPassWordData.imageCode != this.imgCode.codeName) {
      this.imgCodeFlag =true;
      this.verifyMessages.imageCode.errorMsg = '验证码不正确';
    }else { 
      this.verifyMessages.imageCode.errorMsg = '';
      this.imgCodeFlag =false;
    }
  }

  modifyUpdataPwd() {
    let url = this.api.config.host.org+'v2/user/login';
    this.api.post(url, this.setPassWordData).subscribe(data => {
      if (data.success) {
        this.navCtrl.push(this.userSetPasswordPage);
      } else {
        this.common.tostMsg({ msg: data.msg });
      }
    })
  }  

  getUserInfo() {
    this.api.get(this.api.config.host.org + 'user/userinfo').subscribe(data => {
      if (data.success) {
        this.mobile = data.result.mobile;
      }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSetVerificationPage');
  }

}
