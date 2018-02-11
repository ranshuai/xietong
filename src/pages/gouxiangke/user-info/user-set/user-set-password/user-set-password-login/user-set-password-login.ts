import { CommonModel } from './../../../../../../providers/CommonModel';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Api } from '../../../../providers/api/api';
import { Validators } from "../../../../providers/api/Validators";
import { CommonProvider } from "../../../../providers/common/common";
import { IntervaConfig } from '../../../../providers/user/intervaConfig';
import { CommonData} from "../../../../providers/user/commonData.model";
import { RequestOptions, Headers } from '@angular/http';
/**
 * Generated class for the UserSetPasswordLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-set-password-login',
  templateUrl: 'user-set-password-login.html',
})
export class UserSetPasswordLoginPage {
  //form表单名称

  setLoginPassForm: any;
  //修改密码输入框对象
  setPassWordData = {
    newPass: '',
    imgCode: '',
    phoneCode: ''
  };
  //表单验证信息
  verifyMessages = {
   
    'newPass': {
      'errorMsg': '',
      'required': '密码是必填的',
      'legallyNamed': '英文、数字、下划线',
      'maxlenght': '最多10位'
    },
    'imgCode': {
      'errorMsg': '',
      'required': '图形验证码是必填的',
    }
    ,
    'phoneCode': {
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



  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api, private formBuilder: FormBuilder,public interva:IntervaConfig,public common:CommonProvider,public commonData:CommonData,public commonModel:CommonModel) {
     this.setLoginPassForm = this.formBuilder.group({
      newPass: [this.setPassWordData.newPass, [Validators.required,Validators.legallyNamed]],
      imgCode: [this.setPassWordData.imgCode, [Validators.required]],
      phoneCode: [this.setPassWordData.phoneCode, [Validators.required,Validators.maxLength(4)]]
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
    if (this.setPassWordData.imgCode == '') {
      this.common.tostMsg({ msg: '图形验证码必填' })
    } else {
      //图片验证码是否正确
      if (!this.imgCodeFlag) { 
        if (!this.isend&&this.interva.modifyPassword==60) {
            this.isend = true;
            this.api.get(this.api.config.host.org + 'v2/user/getPhoneCode1', {
              imageCode:this.setPassWordData.imgCode,
              mobile:this.commonModel.TAB_INIT_USERINFO.mobile,
              uuid:this.api.UUID
            }).subscribe(data => {
              if (data.success) {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(() => {
                  if (this.interva.modifyPassword != 0) {
                    this.interva.modifyPassword--;
                  } else {
                    this.interva.modifyPassword = 60;
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
    if (this.setPassWordData.imgCode != this.imgCode.codeName) {
      this.imgCodeFlag =true;
      this.verifyMessages.imgCode.errorMsg = '验证码不正确';
    }else { 
      this.verifyMessages.imgCode.errorMsg = '';
      this.imgCodeFlag =false;
    }
  }






  //修改密码
  // this.api.config.host.org
  modifyUpdataPwd() {
      //  let options = new RequestOptions({ headers: new Headers() });
    this.api.post( this.api.config.host.org + 'v2/myinfo/updatePassword?pwdType=' + '1' + '&pwd=' + this.setPassWordData.newPass + '&msgCode=' + this.setPassWordData.phoneCode).subscribe(data=> {
      if (data.success) {
        this.common.tostMsg({ msg: data.msg });
        this.navCtrl.pop();
      } else {
         this.common.tostMsg({msg:data.msg})
      }
    })
  }

  
 
  ionViewDidEnter() {
    this.getImgCode();
  }
 
}
