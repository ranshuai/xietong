import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { CommonProvider } from '../../../providers/common/common';
import { SexModalPage } from './sex-modal/sex-modal';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import { ThirdPartyApiProvider } from "../../../providers/third-party-api/third-party-api";
import { MainCtrl } from './../../../../../providers/MainCtrl';

/**
 * Generated class for the UserSetInfoSubPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'user-set-info-sub',
  templateUrl: 'user-set-info-sub.html',
})
export class UserSetInfoSubPage {
  pageData;
  birthday;
  sexModalPage = SexModalPage;
  userInfoSubForm: any;
  //设置密码输入框对象
  userInfoSubData = {
    nickname: '',
  };
  userInfoSubMessages = {
    'nickname': {
      'errorMsg': '',
      'required': '用户名为必填项',
      'minlength': '昵称最少2个字符',
      'blend':'可输入中文、英文、数字、下划线',
    }
  }
  userInfoSubFormIsDisabled = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api,
    public common: CommonProvider, private formBuilder: FormBuilder,public thirdPartyApi:ThirdPartyApiProvider,public mainCtrl:MainCtrl) {
    this.pageData = this.navParams.get('user');
    //小于10补0
    let year = new Date(this.pageData.birthday * 1000).getFullYear();
    let month = to0(new Date(this.pageData.birthday * 1000).getMonth()+1);
    let date = to0(new Date(this.pageData.birthday * 1000).getDate());

    function to0(str) {
      let to0Str;
      if (Number(str) < 10) {
        to0Str = '0' + str
      } else { 
        to0Str = str;
      }
      return to0Str
     }

    this.birthday = {
      time: {
        year: new Date(this.pageData.birthday * 1000).getFullYear(),
        month: new Date(this.pageData.birthday * 1000).getMonth() + 1,
        day: new Date(this.pageData.birthday * 1000).getDate()
      },
      value: year + '-' + month + '-' + date
    }
    this.userInfoSubData.nickname = this.pageData.nickname;
    this.initFormData()
  }

  initFormData() {
    this.userInfoSubForm = this.formBuilder.group({
      nickname: [this.userInfoSubData.nickname, [Validators.required, Validators.minLength(2),Validators.blend]],
    });
    this.userInfoSubForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.userInfoSubMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.userInfoSubForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        Object.assign(this.userInfoSubData, this.userInfoSubForm.value);
        this.userInfoSubFormIsDisabled = this.userInfoSubForm.valid
      });
  }



  seletSexModal() {
    this.common.openChangeModal(this.sexModalPage, false, { state: this.pageData.sex }).subscribe(
      data => {
        if (data) { 
        this.pageData.sex = (data as any).sex;
        }
      }
    );
  }

  select() {
    function to0(str) {
      let to0Str;
      if (Number(str) < 10) {
        to0Str = '0' + str
      } else { 
        to0Str = str;
      }
      return to0Str
     }
    this.common.selectDate(this.birthday.time).subscribe(data => {
      this.birthday = {
        time: {
          year: (data as any).one.id,
          month: (data as any).two.id,
          day: (data as any).three.id
        },

        value: (data as any).one.id + '-' + to0((data as any).two.id) + '-' + to0((data as any).three.id)
      }

      this.pageData.birthday = this.birthday.value;
    })
  }

 //提交
  subUserInfo() {
    if (this.userInfoSubFormIsDisabled) { 
      this.api.post(this.api.config.host.org + '/user/updataUserInfo', {
        nickname: this.userInfoSubData.nickname,
        sex: this.pageData.sex,
        headPic: this.pageData.headPic,
        birthday: new Date(this.birthday.value).getTime() / 1000
      }).subscribe(data => {
        if (data.success) {
          this.mainCtrl.getUserInfo().subscribe();
          this.navCtrl.pop();
          this.common.tostMsg({ msg: data.msg })
        } else {
          this.common.tostMsg({ msg: data.msg })
        }
      })
    }
  }
  //uploadImg
  uploadImg() {
    document.getElementById("userHeader").click();
  }

  fileChange(file) { 
    this.thirdPartyApi.uploadImage(file.target.files[0], 'user').subscribe(data => { 
      if (data) { 
      this.pageData.headPic = data;
      }
    })
  }
}
