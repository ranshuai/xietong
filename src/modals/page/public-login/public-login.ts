import { NativeService } from './../../../providers/NativeService';
import { HttpService } from './../../../providers/HttpService';
import { MainCtrl } from './../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { CommonModel } from "../../../providers/CommonModel";
import { HttpConfig } from "../../../providers/HttpConfig";
import { RequestOptions, Headers } from '@angular/http';
declare var RongIMLib: any;
declare var RongIMClient: any;
/**
 * Generated class for the PublicLoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-login',
  templateUrl: 'public-login.html',
})
export class PublicLoginPage {
  //默认登录方式
  loginType = "phone";
  isend: boolean = false;
  //密码显示隐藏字段
  showPassword = "password";
  Platform = 'android';

  imgCodeFlag: boolean = false;
  //图片验证码信息
  imgCode = {
    'img': undefined,
    'error': false,
    'codeName': undefined
  };
  //表单对象
  pageData = {
    imageCode: "",
    mobile: "",
    msgCode: "",
    password: "",
    uuid: this.mainCtrl.httpService.config.uuid,
  }
  //获取验证码定时器
  timeInterval;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mainCtrl: MainCtrl,
    private httpService: HttpService,
    private nativeService: NativeService,
    public commonModel: CommonModel,
    public events: Events,
    private appCtrl: App,
    private httpConfig: HttpConfig,
    private loadingCtrl: LoadingController,
  ) {
    this.getImgCode();
    this.Platform = this.httpConfig.platform;
    console.log(this.httpConfig.clientType);
    console.log(this.Platform);
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
      uuid: this.mainCtrl.httpService.config.uuid
    }
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
        this.imgCode.error = true;
      }
    });
  }

  checkImgCode() {
    if (this.pageData.imageCode != this.imgCode.codeName) {
      this.imgCodeFlag = true;
    } else {
      this.imgCodeFlag = false;
    }
  }

  /**获取手机验证码 */
  getPhoneCode() {
    if (this.pageData.imageCode == '' || this.pageData.mobile == '') {
      this.mainCtrl.nativeService.showToast('图形验证码和手机号必填')
    } else {
      if (this.pageData.mobile.match(/^[0-9]+$/) == null || this.pageData.mobile.length < 11) {
        this.nativeService.showToast("请输入手机号正确格式")
      } else {
        if (this.imgCodeFlag == true) {
          this.nativeService.showToast("图形验证码错误")
        } else {
          if (!this.isend && this.mainCtrl.commonModel.interva.login == 60) {
            this.isend = true;
            this.httpService.get(this.httpService.config.host.org + 'v2/user/getPhoneCode1', {
              imageCode: this.pageData.imageCode,
              mobile: this.pageData.mobile,
              uuid: this.httpService.config.uuid
            }).subscribe(data => {
              if (data.success) {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(() => {
                  if (this.mainCtrl.commonModel.interva.login != 0) {
                    this.mainCtrl.commonModel.interva.login--;
                  } else {
                    this.mainCtrl.commonModel.interva.login = 60;
                    this.isend = false;
                    clearInterval(this.timeInterval);
                  }
                }, 1000);
                this.nativeService.showToast(data.msg);
              } else {
                this.nativeService.showToast(data.msg || "网络连接异常")
                this.isend = false;
                this.getImgCode();
              }
            });
          }
        }
      }
    }
  }

  login() {
    let url = this.loginType == "phone" ? this.httpService.config.host.org + 'v2/user/login' : this.httpService.config.host.org + 'v2/user/loginpwd';
    this.httpService.post(url, this.pageData).subscribe(data => {
        if (data.success) {
            this.commonModel.userId = data.result.userId;
            this.loginCallback();

            this.mainCtrl.getUserInfo().subscribe(data => {
                if (data.success) {
                    //只有域商城才登录融云
                    if (this.httpConfig.clientType == '1' && !((<any>window).IMUserId)&&this.httpConfig.isMsgShow) {
                        //融云登录
                        this.getRongIMToken(data);
                    }

                } else {
                    this.nativeService.showToast(data.msg);
                }
            })
      } else {
        this.nativeService.showToast(data.msg);
      }

    });
  }


  /**
   * 获取融云token
   */
  getRongIMToken(userInfo){
    this.httpService.get(this.httpService.config.host.bl + "rong/cloud/token").subscribe(res => {
      console.log("获取融云token：", JSON.stringify(res));
      if (res.success) {
        if (res.result) {
          let token = res.result.token;
          let name = res.result.name;
          let picurl = res.result.picurl;
          let obj = '{"token":"' + token + '","name":"' + name + '","picurl": "' + picurl + '"}';
          this.commonModel.rongIMInfo = JSON.parse(obj);
          //获取融云token
          window.localStorage.setItem("_TAB_INIT_USERINFO", JSON.stringify(userInfo.result));
          //    登录融云
          this.events.publish("RongIMLogin", JSON.stringify({ "token": token }));
          // this.connectRongIM(token);
        }
      }
    });

  }

  /**
   * 登录融云
   * @param token
   */
  connectRongIM(token) {
    RongIMClient.connect(token, {
      onSuccess: function (userId) {
        console.log("用户" + userId + "连接融云成功！");
        //  发送消息
        // self.sendMessage();
      },
      onTokenIncorrect: function () {
        console.log('token无效');
      },
      onError: function (errorCode) {
        var info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误';
            break;
          case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
            info = '不可接受的协议版本';
            break;
          case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
            info = 'appkey不正确';
            break;
          case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
            info = '服务器不可用';
            break;
        }
        console.log(errorCode);
      }
    });
  }

    loginCallback() {
        this.mainCtrl.getUserInfo().subscribe(data => {
            if (data.success) {
                // if (this.httpConfig.clientType == '1' && !((<any>window).IMUserId)) {
                //   //融云登录
                //   this.getRongIMToken(data);
                // }

                if (this.httpService.config.clientType == '2') {
                    this.httpService.get(this.httpService.config.host.org + 'v2/user/queryUserLevelCardList').subscribe(data => {
                        data.result ? data.result : data.result = [{}];
                        //物流人Id = 2
                        let logisticsJson = {};
                        //店铺 ID = 0；
                        let storeJson = {};
                        data.result.forEach((v, i) => {
                            if (v.roleid == 2) {
                                logisticsJson = v;
                            }
                            if (v.roleid == 0) {
                                storeJson = v;
                            }
                        });
                        let json = {
                            0: 'StorePage',
                            1: '招商合伙人',
                            2: 'LogisticsPage'
                        }
                        if ((logisticsJson as any).roleid == 2 && (logisticsJson as any).sourceType == 1) {
                            this.mainCtrl.setRootPage('logistics-tabs');
                        } else if ((storeJson as any).roleid == 0 && (storeJson as any).sourceType == 1) {
                            // window.localStorage.setItem('storeJson', JSON.stringify(storeJson))
                            // this.common.goToPage('StorePage');
                            this.mainCtrl.setRootPage('StorePage');
                        } else {
                            //登陆成功
                            this.navCtrl.popToRoot();
                        }
                    })
                } else {
                    this.navCtrl.popToRoot();
                }
            } else {
                this.commonModel.userId = "";
                this.mainCtrl.nativeService.showToast('获取用户信息失败，请重新登录')
            }
        });
    }

  /**
   * 
   * @param type 登录类型
   */
  thirdPartyLogin(type) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop: false, //是否显示遮罩层
      content: '加载中...'
    });
    loading.present();

    if (this.mainCtrl.nativeService.isMobile()) {
      this.mainCtrl.thirdPartyApi.thirdPartyLogin(type).subscribe(data => {
        loading.dismiss();
        console.log(data);
        // alert(this.httpService.config.thirdPartyAuthorization.uid);
        //登录成功
        if (data) {
          this.commonModel.userInfo.thirdOpenid = this.httpService.config.thirdPartyAuthorization.uid;
          this.commonModel.userInfo.thirdName = this.httpService.config.thirdPartyAuthorization.name;
          this.commonModel.userInfo.thirdIconurl = this.httpService.config.thirdPartyAuthorization.iconurl;
          this.mainCtrl.httpService.get(this.httpService.config.host.org + '/v2/userlogin/queryOpenId', { openId: this.commonModel.userInfo.thirdOpenid }, { source: type }).subscribe(data => {
            if (data.result == -1) {
              //去完善信息
              this.navCtrl.push('PublicThirdBindPage', { source: type });
            } else {
              //赋值userid
              this.commonModel.userId = data.result;
              //登录回调
              this.loginCallback();
            }
          })
        } else {
          loading.dismiss();
          this.mainCtrl.nativeService.showToast('授权失败')
        }
      })
    } else {
      //h5第三方登录
      switch (type) {
        case 'wechat':
          this.mainCtrl.getWechatImpower().subscribe(data => {
            loading.dismiss();
            if (data.success) {
            } else {
              this.mainCtrl.nativeService.showToast(data.msg || '网络链接异常')
            }
          })
          break;
      }
    }
  }
  getUserInfo() {
    this.httpService.get(this.httpService.config.host.org + 'user/userinfo').subscribe(data => {
      if (data.success) {
        window.localStorage.setItem('userId', data.result.userId);
        data.result.headPic = data.result.headPic ? data.result.headPic : '../assets/img/deful_headerPic.jpg';
        this.mainCtrl.commonModel.TAB_INIT_USERINFO = data.result;

        this.navCtrl.popToRoot();
      } else {
        this.mainCtrl.nativeService.showToast(data.msg)
      }
    });
  }


}
