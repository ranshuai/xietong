import { NativeService } from './../../../../providers/NativeService';
import { MainCtrl } from './../../../../providers/MainCtrl';
import { HttpService } from './../../../../providers/HttpService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PublicRegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-register',
  templateUrl: 'public-register.html',
})
export class PublicRegisterPage {
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
    uuid: this.httpService.config.uuid,
  }
  //获取验证码定时器
  timeInterval;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private mainCtrl: MainCtrl,
    private nativeService: NativeService
  ) {
    this.getImgCode();
  }


  //查看协议
  viewProtocol(cardType: any) {
    //58注册用户
    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.bl + 'platformset/selectProtocolInfo', {
      catId: cardType
    }, { userId: 1}).subscribe(data => {
      if (data.success) {
        this.navCtrl.push('AllProtocolPage', { data: data.result.content, cardType: cardType });
      } else {
        this.mainCtrl.nativeService.showToast(data.msg);
      }
    })
  }

  //显示密码
  showPassWord() {
    this.showPassword = this.showPassword == 'password' ? 'text' : 'password';
  }

  /**获取图形验证码 */
  getImgCode() {
    this.imgCode.error = false;
    this.httpService.get(this.httpService.config.host.org + '/v2/user/getImageCode', { uuid: this.httpService.config.uuid }).subscribe(data => {
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
      this.mainCtrl.nativeService.showToast( '图形验证码和手机号必填' )
    } else if(this.pageData.mobile.match(/^[0-9]+$/) == null || this.pageData.mobile.length < 11){
        this.mainCtrl.nativeService.showToast("请输入手机号正确格式");
      } else {
        if(this.imgCodeFlag == true){
          this.nativeService.showToast("图形验证码错误");
        }else{
          if(!this.isend&&this.mainCtrl.commonModel.interva.register == 60){ 
            this.isend = true;
          this.httpService.get(this.httpService.config.host.org + 'v2/user/getPhoneCode1', {
            imageCode: this.pageData.imageCode,
            mobile: this.pageData.mobile,
            uuid: this.httpService.config.uuid
            }).subscribe(data => {
              if (data.success) {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(() => {
                  if (this.mainCtrl.commonModel.interva.register != 0) {
                    this.mainCtrl.commonModel.interva.register--;
                  } else {
                    this.mainCtrl.commonModel.interva.register = 60;
                    this.isend = false;
                    clearInterval(this.timeInterval);
                  }
                }, 1000);
                this.mainCtrl.nativeService.showToast( data.msg );
              } else {
                this.mainCtrl.nativeService.showToast( data.msg ||'网络连接异常' );
                this.isend = false;
                this.getImgCode();
              }
            });
          }
        }
      }
    }
  

  register() {
    this.httpService.post(this.httpService.config.host.org + 'v2/user/register1', this.pageData).subscribe(data => {
      if (data.success) {
        //填写你登录成功后的页面
        this.mainCtrl.nativeService.showToast(data.msg)
        this.navCtrl.pop();      
      } else {
        this.mainCtrl.nativeService.showToast( data.msg );
        this.navCtrl.pop();
      }
    })
  }

}
