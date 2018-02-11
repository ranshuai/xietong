import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { Api } from "../../../providers/api/api";
import { CommonProvider } from "../../../providers/common/common";
import { Config } from "../../../providers/api/config.model";
import { User } from '../../../providers/user/user';
import { Device } from '@ionic-native/device';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'register'
})
@Component({
  selector: 'register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  //密码显示隐藏字段
  showPassword = "password";

  isend: boolean = false;

  imgCodeFlag: boolean = false;
  //图片验证码信息
  imgCode = {
    'img': undefined,
    'error': false,
    'codeName':undefined
  };
  //表单对象
  pageData = {
    imageCode: "",
    mobile: "",
    msgCode: "",
    password: "",
    isAgree: "true",
    uuid: this.api.UUID,
  }
  //获取验证码定时器
  timeInterval;
  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public api: Api, public config: Config, public commonProvider: CommonProvider, public user: User, public device: Device) {
    this.getImgCode();
    console.log(navCtrl);
  }

  //显示密码
  showPassWord() {
    this.showPassword = this.showPassword == 'password' ? 'text' : 'password';
  }

  /**获取图形验证码 */
  getImgCode() {
    this.imgCode.error = false;
    this.api.get(this.api.config.host.org + '/v2/user/getImageCode', { uuid: this.api.UUID }).subscribe(data => {
      if (data.success) {
        this.imgCode.img = data.result.img;
        this.imgCode.codeName = data.result.codeName;
        this.checkImgCode();
        console.log(this.imgCode)
      } else {
        this.imgCode.img = undefined;
        this.imgCode.error = true;
      }
    });
  }

  checkImgCode(){
    if(this.pageData.imageCode != this.imgCode.codeName){
       this.imgCodeFlag = true;      
    }else{
      this.imgCodeFlag = false;
    }
  }

  /**获取手机验证码 */
  getPhoneCode() {
    if (this.pageData.imageCode == '' || this.pageData.mobile == '') {
      this.tostMsg({ msg: '图形验证码和手机号必填' })
    } else {
      if(this.imgCodeFlag == true){
        this.commonProvider.tostMsg({msg:"图形验证码错误"});
      }else{
        if(!this.isend&&this.config.interva.register == 60){ 
          this.isend = true;
        this.api.get(this.api.config.host.org + 'v2/user/getPhoneCode1', {
          imageCode: this.pageData.imageCode,
          mobile: this.pageData.mobile,
          uuid: this.api.UUID
          }).subscribe(data => {
            if (data.success) {
              clearInterval(this.timeInterval);
              this.timeInterval = setInterval(() => {
                if (this.config.interva.register != 0) {
                  this.config.interva.register--;
                } else {
                  this.config.interva.register = 60;
                  this.isend = false;
                  clearInterval(this.timeInterval);
                }
              }, 1000);
              this.commonProvider.tostMsg({msg: data.msg});
            } else {
              this.commonProvider.tostMsg({ msg: data.msg || '网络连接异常' });
              this.isend = false;
              this.getImgCode();
            }
          });
        }
      }
  }
}



  /**信息提醒 */
  tostMsg(_data) {
    let toast = this.toastCtrl.create({
      message: _data.msg,
      duration: _data.time == undefined ? 1500 : _data.time,
      position: _data.position == undefined ? 'middle' : _data.position,
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }

  register() {
    this.api.post(this.api.config.host.org + 'v2/user/register1', this.pageData).subscribe(data => {
      if (data.success) {
        //填写你登录成功后的页面
        this.user.loggedIn(data.result);
        this.commonProvider.goToPage('UserPage', { index: 4 });
        // this.commonProvider.popToPage();      
      } else {
        this.tostMsg({ msg: data.msg })
      }
    })
  }


}
