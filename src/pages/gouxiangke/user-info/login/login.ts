import { Storage } from '@ionic/storage';
import { GlobalDataProvider } from './../../providers/global-data/global-data.model';
import { Subscriber } from 'rxjs/Subscriber';
import { ThirdPartyApiProvider } from './../../providers/third-party-api/third-party-api';
import { Component } from '@angular/core';
import { User } from './../../providers/user/user';
import { App, NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { Api } from "../../providers/api/api";
import { Config } from "../../providers/api/config.model";
import { CommonProvider } from "../../providers/common/common";
import { Device } from '@ionic-native/device';
import { RequestOptions, Headers } from '@angular/http';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'login',
  defaultHistory:["UserPage"]
})
@Component({
  selector: 'login',
  templateUrl: 'login.html',
})
export class LoginPage {
  //默认登录方式
  loginType = "phone";
  isend: boolean = false;
  //密码显示隐藏字段
  showPassword = "password";

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
    uuid:this.api.UUID
  }
  //获取验证码定时器
  timeInterval;
  constructor(
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public config: Config,
    public api: Api,
    public common: CommonProvider,
    private user: User,
    private device: Device,
    public app: App,
    public thirdPartyApiProvider: ThirdPartyApiProvider,
    public globalDataProvider: GlobalDataProvider,
    public storage:Storage
  ) {
    this.getImgCode();
  }

  ionViewDidLoad(){
  }
  /**
   * 切换登录方式
   */
  changeLogin(_type) {
    this.loginType = _type;
    let mobile = this.pageData.mobile;
    this.pageData = {
      imageCode: "",
      mobile: mobile,
      msgCode: "",
      password: "",
      uuid:this.api.UUID
    }
  }
  //显示密码
  showPassWord() {
    this.showPassword = this.showPassword == 'password' ? 'text' : 'password';
  }

  /**获取图形验证码 */
  getImgCode() {
    this.imgCode.error = false;
    this.api.get(this.api.config.host.org+'/v2/user/getImageCode', { uuid: this.api.UUID }).subscribe(data => {
      if (data.success) {
        this.imgCode.img = data.result.img;
        this.imgCode.codeName = data.result.codeName;
        this.checkImgCode();
        console.log(this.imgCode)
      } else {
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
      if(this.pageData.mobile.match(/^[0-9]+$/) == null || this.pageData.mobile.length < 11){
        this.common.tostMsg({msg: "请输入手机号正确格式"});
      }else{
        if(this.imgCodeFlag == true){
          this.common.tostMsg({ msg: '图形验证码错误' });
        }else{
          if(!this.isend&&this.config.interva.login==60){
            this.isend = true;
            this.api.get(this.api.config.host.org+'v2/user/getPhoneCode1', {
              imageCode: this.pageData.imageCode,
              mobile: this.pageData.mobile,
              uuid: this.api.UUID
            }).subscribe(data => {
              if (data.success) {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(() => {
                  if ( this.config.interva.login != 0) {
                    this.config.interva.login--;
                  } else {
                    this.config.interva.login = 60;
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
  }

  goTo(){
    this.common.goToPage('ResetPasswordPage');
  }

  login() {
    let url = this.loginType == "phone" ? this.api.config.host.org+'v2/user/login' : this.api.config.host.org+'v2/user/loginpwd';
    this.api.post(url, this.pageData).subscribe(data => {
      if (data.success) {
        this.user.loggedIn(data.result);
        //登陆成功
        this.common.goToPage('UserPage', {index:4});
      } else {
        this.tostMsg({ msg: data.msg })
      }
    })
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
  thirdPartyLogin(str?) {
    this.thirdPartyApiProvider.thirdPartyLogin(str).subscribe(data => {
      alert(this.globalDataProvider.thirdPartyAuthorization.uid);
      //登录成功
      if (data) {
        let options = new RequestOptions({
          headers: new Headers({
            source: str,
            openId: this.globalDataProvider.thirdPartyAuthorization.uid
          })
        });
        this.api.get(this.config.host.org + 'user/third/openId/query', '', options).subscribe(data => {
          if (data.result == -1) {
            //去完善信息
            this.common.goToPage('RegisterPage', { type: 'perfect' })
          } else {
            this.storage.set('userId', data.result);
            //个人中心
            this.common.goToPage('UserPage', { index: 3 });
          }
        })
      } else {
        this.common.showToast('授权失败')
      }
    })

  }

}
