import { CommonModel } from './../../../../../providers/CommonModel';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { CommonProvider } from '../../../providers/common/common';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import { IntervaConfig } from '../../../providers/user/intervaConfig';
import { CommonData } from "../../../providers/user/commonData.model";
/**
 * Generated class for the UserSetMobilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-set-mobile',
  templateUrl: 'user-set-mobile.html',
})
export class UserSetMobilePage {
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
  modifyMobileForm: any;
  //设置密码输入框对象
  modifyMobileData = {
    password: '',
    phone: '',
    code: '',
    imgCode: ''
  };

  modifyMobileMessages = {
    'password': {
      'errorMsg': '',
      'minlength': '密码最少6位',
      'maxlength': '密码最多10位',
      'required': '密码是必填的',
    }, 'phone': {
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public common: CommonProvider,
    private formBuilder: FormBuilder,
    public interva: IntervaConfig,
    public commonData: CommonData,
    public storage: Storage,
    public commonModel:CommonModel
  ) {
    // 如果type等于1，绑定手机
    this.type = this.navParams.get("type");
    console.log(this.type)
    this.modifyMobileForm = this.formBuilder.group(
      {
        password: [this.modifyMobileData.password, [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        phone: [this.modifyMobileData.phone, [Validators.required, Validators.maxLength(11)]],
        code: [this.modifyMobileData.code, [Validators.required, Validators.maxLength(4)]],
        imgCode: [this.modifyMobileData.imgCode, [Validators.required, Validators.maxLength(4)]]
      }
    );
    this.modifyMobileForm.valueChanges.subscribe(data => {
      const verifyMessages = this.modifyMobileMessages;
      for (const field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        const control = this.modifyMobileForm.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = verifyMessages[field];
          for (const key in control.errors) {
            messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
          }
        }
      }
      Object.assign(this.modifyMobileData, this.modifyMobileForm.value);
    });
  }

  /**获取图形验证码 */
  getImgCode() {
    this.imgCode.error = false;
    this.api.get(this.api.config.host.org + 'v2/user/getImageCode', { uuid: this.api.UUID }).subscribe(data => {
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
    if (this.modifyMobileData.imgCode != this.imgCode.codeName) {
      this.imgCodeFlag = true;
      this.modifyMobileMessages.imgCode.errorMsg = '验证码不正确';
    } else {
      this.modifyMobileMessages.imgCode.errorMsg = '';
      this.imgCodeFlag = false;
    }
  }

  /**获取手机验证码 */
  getPhoneCode() {
    if (this.modifyMobileData.imgCode == '' || this.modifyMobileData.phone == '') {
      this.common.tostMsg({ msg: '图形验证码和手机号必填' })
    } else {
      //图片验证码是否正确
      if (!this.imgCodeFlag) {
        if (!this.isend && this.interva.modifyMobile == 60) {
          this.isend = true;
          this.api.get(this.api.config.host.org + 'v2/user/getPhoneCode1', {
            imageCode: this.modifyMobileData.imgCode,
            mobile: this.modifyMobileData.phone,
            uuid: this.api.UUID
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
              this.common.tostMsg({ msg: data.msg });
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
  // user/mobile/exchange?mobile=
  modifyMobule() {
    let url;
    if (this.type == 1) {
      url = 'v2/myinfo/mobile/exchange?mobile=' + this.modifyMobileData.phone + '&passWord=' + this.modifyMobileData.password + '&smCode=' + this.modifyMobileData.code + '&type=1';
    } else {
      url = 'v2/myinfo/mobile/exchange?mobile=' + this.modifyMobileData.phone + '&passWord=' + this.modifyMobileData.password + '&smCode=' + this.modifyMobileData.code + '&type=2';
    }
    this.api.post(this.api.config.host.org + url).subscribe(data => {
      if (data.success) {
          this.commonModel.TAB_INIT_USERINFO.mobile =this.modifyMobileData.phone; 
          this.common.tostMsg({ msg: data.msg });
          setTimeout(() => {
            this.navCtrl.pop();
          }, 500);
      } else {
        this.common.tostMsg({ msg: data.msg||'连接失败' })
      }
    })
  }


  ionViewDidEnter() {
    this.api.get(this.api.config.host.org + 'user/userinfo').subscribe(data => {
      if (data.success) {
        this.commonModel.TAB_INIT_USERINFO = data.result;
        this.getImgCode();
      }
    });

  }

}
