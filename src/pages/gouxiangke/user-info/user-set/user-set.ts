import { MainCtrl } from './../../../../providers/MainCtrl';
import { CommonModel } from './../../../../providers/CommonModel';
import { Component, Input, forwardRef, Inject } from '@angular/core';
import {
    IonicPage, NavController, NavParams, ToastController, ModalController, LoadingController,
    Events
} from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Config } from '../../providers/api/config.model';
import { Api } from '../../providers/api/api';
import { CommonData } from '../../providers/user/commonData.model';
import { User } from "../../providers/user/user";
import { NativeService } from "../../../../providers/NativeService";
import {HttpConfig} from "../../../../providers/HttpConfig";
/**
 * Generated class for the UserSetPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-set',
  templateUrl: 'user-set.html',

})
//  UserSetPage  用户   页面跳转字符串
export class UserSetPage {

  userSetInfoPage = 'UserSetInfoPage'; //信息
  userSetCertificationPage = 'UserSetCertificationPage'; //实名认证
  userSetMobilePage = 'UserSetMobilePage'; // 手机号
  versionCode;
  mobile;
  constructor(public navCtrl: NavController, public navParams: NavParams, public commonProvider: CommonProvider, public config: Config, public api: Api,
    public commonData: CommonData, public user: User,
    private nativeService: NativeService,
    private loadingCtrl: LoadingController,public httpConfig:HttpConfig,
    private modalCtrl: ModalController,private events:Events,
    private toastCtrl: ToastController, public commonModel: CommonModel,public mainCtrl:MainCtrl) {
    this.commonData.TAB_INIT_USERINFO = Object.assign(this.commonData.TAB_INIT_USERINFO, this.commonModel.TAB_INIT_USERINFO)
    
    this.commonData.user_info_certification_real=false;
    this.checkUserReal();
    this.nativeService.getVersionNumber().subscribe(res => {
      this.versionCode = res;
    })
  }



  /**检测用户是否实名认证 */
  checkUserReal() {
    this.api.get(this.api.config.host.org + 'user/real/query').subscribe(data => {
      if (data) {
        if (data.result.status == 10112) {
          this.commonData.user_info_certification_real = true;
          this.commonData.user_info_certification = data.result.identity;
        } else if (data.result.status == 10113) {
          this.commonData.user_info_certification_real = false;
          this.commonData.user_info_certification = undefined;
        }
      }
    });

  }

  goToUserSetInfo(_url) {
    //获取当前页面root 跳转到2级页面
    this.navCtrl.push(this.userSetInfoPage);
  }

  goToPageUserSetCeal() {
    this.navCtrl.push(this.userSetCertificationPage);
  }

  goToPageUserSetPassWord() {
    this.navCtrl.push('UserSetVerificationPage');
  }

  goToPageuSetMobilePage() {
    this.navCtrl.push(this.userSetMobilePage);
  }

    /**
    * 版本升级
    */
    checkVersion() {
      this.nativeService.getVersionNumber().subscribe(res => {
          this.versionCode = res;
          var version = {
              type: 1,
              // uuid: this.nativeService.getUUId(),
              version: res
          }
          if (this.nativeService.isAndroid()) {
              version.type = 1;
          } else if (this.nativeService.isIos()) {
              version.type = 2;
          }
          let loading = this.loadingCtrl.create({
              showBackdrop: true, //是否显示遮罩层
              content: '请稍后'
          });
          loading.present();
          this.api.post(this.api.config.host.bl +'app/queryIsUpdate',version
        ).subscribe(data => {
          loading.dismiss();
          if (data.success) {
            if (data.result) {
             let modal = this.modalCtrl.create('PublicUpdateVersionPage',{
              versionInfo:data.result
            });
              modal.present({ animate: false });
              modal.onDidDismiss(ok => {
                if (ok) {
                  // this.nativeService.downloadApp(version.type, data.result.isForce, data.result.fileName, data.result.filePath);
                }
              });
            }else {
              setTimeout(() => {
                let toast = this.toastCtrl.create({
                  message: '已经是最新版本',
                  duration: 1500,
                  position: 'middle'
                });
                toast.present();
            }, 800)
          } 
          }else {
            setTimeout(() => {
              let toast = this.toastCtrl.create({
                message:data.msg || '连接异常,请重试',
                duration: 1500,
                position: 'middle'
              });
              toast.present();
            }, 800)
        }
          })
      })
  }


  clearLogin() { 
    this.commonProvider.storeConfirm('确认退出吗').subscribe(data => { 

      //用户退出清空购物车
      this.commonModel.shopCarNum = '';
      window.localStorage.removeItem('storeId')
      window.localStorage.removeItem('_TAB_INIT_USERINFO')
      this.commonModel.TAB_INIT_USERINFO = null;
      this.commonModel.userId = null;
      this.user = null;
      this.api.userId = 0;
 
      if(this.httpConfig.clientType=='1'&&this.httpConfig.isMsgShow){
          this.events.publish("RongIMLogout");
      }

 
      this.mainCtrl.clearUserInfo();
      this.mainCtrl.setRootPage('TabMenuPage');
      // this.mainCtrl.popRoot();
    });
  }
  ionViewDidEnter(){
    this.mobile = this.commonModel.TAB_INIT_USERINFO.mobile.substr(0,3)+'****'+this.commonModel.TAB_INIT_USERINFO.mobile.substr(7);
  }
}
