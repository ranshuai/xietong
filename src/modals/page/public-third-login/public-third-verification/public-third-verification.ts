import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HttpService } from '../../../../providers/HttpService';
import { MainCtrl } from '../../../../providers/MainCtrl';
import { CommonModel } from '../../../../providers/CommonModel';

/**
 * Generated class for the PublicThirdVerificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-third-verification',
  templateUrl: 'public-third-verification.html',
})
export class PublicThirdVerificationPage {
  mobile;
  password;
  source;//第三方平台
  type; //操作类型；1 = 已有手机号用户，2 = 新用户绑定
  isend: boolean = false;
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
    msgCode: "",
    uuid: this.mainCtrl.httpService.config.uuid,
  }
  //获取验证码定时器
  timeInterval;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private mainCtrl: MainCtrl,
    public events: Events,
    private ref: ChangeDetectorRef,
    public commonModel: CommonModel,

  ) {
    this.getImgCode();
    this.mobile = this.navParams.get('mobile');
    this.password = this.navParams.get('password');
    this.source = this.navParams.get('source');
    this.type = this.navParams.get('type');
    console.log(this.mobile)
    console.log(this.password)
    console.log(this.source)
    console.log(this.type)
  }
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
    if (this.pageData.imageCode == '') {
      this.mainCtrl.nativeService.showToast('图形验证码必填')
    } else {
      if (this.imgCodeFlag == true) {
        this.mainCtrl.nativeService.showToast("图形验证码错误")
      } else {
        if (!this.isend && this.mainCtrl.commonModel.interva.thirdlogin == 60) {
          this.isend = true;
          this.httpService.get(this.httpService.config.host.org + 'v2/user/getPhoneCode1', {
            imageCode: this.pageData.imageCode,
            mobile: this.mobile,
            uuid: this.httpService.config.uuid
          }).subscribe(data => {
            if (data.success) {
              clearInterval(this.timeInterval);
              this.timeInterval = setInterval(() => {
                if (this.mainCtrl.commonModel.interva.thirdlogin != 0) {
                  this.mainCtrl.commonModel.interva.thirdlogin--;
                } else {
                  this.mainCtrl.commonModel.interva.thirdlogin = 60;
                  this.isend = false;
                  clearInterval(this.timeInterval);
                }
                this.ref.detectChanges();
              }, 1000);
              this.mainCtrl.nativeService.showToast(data.msg);
            } else {
              this.mainCtrl.nativeService.showToast(data.msg || "网络连接异常")
              this.isend = false;
              this.getImgCode();
            }
          });
        }
      }
    }
  }

  confirm() {
    this.httpService.post(this.httpService.config.host.org + '/v2/userlogin/addUserThird',
      { thirdOpenid: this.commonModel.userInfo.thirdOpenid, 
        source: this.source, 
        headImg: this.commonModel.userInfo.thirdIconurl, 
        nickName: this.commonModel.userInfo.thirdName
      },
      {
        mobile: this.mobile,
        pwd: this.password,
        msgCode: this.pageData.msgCode,
        optType: this.type
      }).subscribe(data => {
        if (data.success) {
          this.commonModel.userId = data.result;
          this.mainCtrl.getUserInfo().subscribe(data => {
            if (data.success) {
              if (this.mainCtrl.httpService.config.clientType == '1' && !((<any>window).IMUserId)) {
                //融云登录
                this.getRongIMToken(data);
              }

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
        } else {
          this.mainCtrl.nativeService.showToast(data.msg || "网络连接异常");
        }
      });
  }

  /**
  * 获取融云token
  */
  getRongIMToken(userInfo) {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicThirdVerificationPage');
  }

}
