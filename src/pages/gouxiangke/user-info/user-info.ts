import { MainCtrl } from './../../../providers/MainCtrl';
import { CommonModel } from './../../../providers/CommonModel';
import { GlobalDataProvider } from './../providers/global-data/global-data.model';
import { User } from './../providers/user/user';
import { Component, Input, forwardRef, Inject } from '@angular/core';
import { IonicPage, NavController, ViewController,LoadingController } from 'ionic-angular';
import { CommonProvider } from "../providers/common/common";
import { Config } from '../providers/api/config.model';
// import { UserInfoAddressPage } from './user-info-address/user-info-address';
import { Api } from '../providers/api/api';
import { ThirdPartyApiProvider } from "../providers/third-party-api/third-party-api";

import { Storage } from '@ionic/storage';

// import * as IosSelect from 'IosSelect';
/**
 * Generated class for the UserInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {
  userSetPage = 'UserSetPage'; //个人中心=》设置
  userInfoOrderPage = 'UserInfoOrderPage'; // 个人中心=》订单
  userInfoCollectionPage = 'UserInfoCollectionPage'; //个人中心=》我的收藏
  userInfoWalletPage = 'UserInfoWalletPage'; //我的钱包
  userInfoAddressPage = 'UserInfoAddressPage'; //地址
  userInfoOrderServicesPage = 'UserInfoOrderServicesPage';//
  userInfoCouponPage = 'UserInfoCouponPage';// 售后
  userInfo: any;
  userInfoEvaluatePage = 'UserInfoEvaluatePage';// 评价
  userInfoPrepayPage = 'UserInfoPrepayPage';// 预付款
  userSetMobilePage = 'UserSetMobilePage';// 绑定手机号
  constructor(
    public common: CommonProvider,
    public config: Config,
    public api: Api,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public thirdPartyApi: ThirdPartyApiProvider,
    private user: User,
    public storage: Storage,
    public globalDataProvider: GlobalDataProvider,
    public commonModel: CommonModel,
    public loadingCtrl: LoadingController,
    public mainCtrl: MainCtrl,
   
  ) {
  }

  getUserInfo() {
    this.api.get(this.api.config.host.org + 'user/userinfo').subscribe(data => {
      if (data.success) {
        data.result.headPic = data.result.headPic ? data.result.headPic : '../assets/img/deful_headerPic.jpg';
        this.commonModel.TAB_INIT_USERINFO = data.result;
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    });
  }

  goTouUserSet() {
    this.navCtrl.push(this.userSetPage)
  }

  goToPageUserInfoOrder(_type) {
    this.navCtrl.push(this.userInfoOrderPage, { type: _type });
  }
  goToPageUserInfoCollection() {
    this.navCtrl.push(this.userInfoCollectionPage, {})
  }

  goToPageUserInfoWalletPage() {
    this.navCtrl.push(this.userInfoWalletPage, {})
  }

  goToUserInfoAddressPage() {
    this.api.config.isEditor = false;
    this.navCtrl.push(this.userInfoAddressPage)
  }

  goToUserInfoOrderServicesPage() {
    this.navCtrl.push(this.userInfoOrderServicesPage)

  }

  goToUserInfoCouponPage() {
    this.navCtrl.push(this.userInfoCouponPage)
  }

  goToUserInfoEvaluatePage() {
    this.navCtrl.push(this.userInfoEvaluatePage)
  }
  goToUserInfoBankPage() {
    this.navCtrl.push('UserInfoBankPage')
  }
  goToUserInfoGroupPage() {
    this.navCtrl.push('UserInfoGroupPage');
  }
  goToUserInfoPrepayPage() { 
    this.navCtrl.push(this.userInfoPrepayPage)
  }


  //提交
  subUserInfo(_data) {
    this.api.post(this.api.config.host.org + '/user/updataUserInfo', {
      nickname: this.commonModel.TAB_INIT_USERINFO.nickname,
      sex: this.commonModel.TAB_INIT_USERINFO.sex,
      headPic: _data,
      birthday: this.commonModel.TAB_INIT_USERINFO.birthday
    }).subscribe(data => {
      if (data.success) {
        this.commonModel.TAB_INIT_USERINFO.headPic = _data;
        this.common.tostMsg({ msg: data.msg })
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }

  //uploadImg
  uploadImg() {
    document.getElementById("userInfoHeader").click();
  }

  fileChange(file) {
    this.thirdPartyApi.uploadImage(file.target.files[0], 'user').subscribe(data => {
      if (data) {
        this.subUserInfo(data);
      }
    })
  }

  ionViewDidEnter() {
    window.document.title = this.commonModel.APP_INIT['getWechatDomainName'] &&this.commonModel.APP_INIT['getWechatDomainName'].data;
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') {
      if (!this.commonModel.TAB_INIT_USERINFO.mobile) {
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.navCtrl.push(this.userSetMobilePage, { type: 1 });
        })
      } else {
        this.getUserInfo();
      }
      return 
     }
     if (this.config.PLATFORM == 'APP'|| this.config.PLATFORM == 'STOREAPP') {
      this.api.getUserId().subscribe(userId => {
        if (!userId) {
          //如果没有userID跳转登陆页面
          this.common.goToPage('PublicLoginPage', {'channelsType':'user'});
        } else {
          this.getUserInfo();
        }
      });
      return 
     }
  }

 //申请司机
 goToApplyDriver() { 
  let userInfoCard = [];
  if (this.config.PLATFORM == 'STOREAPP' || this.config.PLATFORM == 'STOREAPPWX') {
    let loading = this.loadingCtrl.create({
      content:'数据加载中。。。'
    })
    loading.present();
    //查看当前用户的状态
    this.api.get(this.api.config.host.org + 'user/real/query').subscribe((data) => { 
      loading.dismiss();
    //如果status = 10112 没有实名认证 
      if (data.result && data.result.status == 10112) {
        this.common.comConfirm('需要实名认证之后,才能变身配送员').subscribe(data => {
          setTimeout(() => { 
            this.navCtrl.push('UserRealQueryPage', { scene: 1 });
          },1000)
        })
        return
      } else { 
        window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity))
        //查看用户信息的状态
        this.api.get(this.api.config.host.org + 'v2/user/queryUserLevelCardList').subscribe((data) => { 
          userInfoCard = data.result || [];
          let selfJson = {
            0: "店主不能申请成为司机！",
            3: '员工不能申请成为司机！',
            4: '客服不能申请成为司机！'
          };
          //判断是否有注册过物流人
          let cardB = false;
          let cardInfo: any;
          let storeB = false;
          let cannotApply: any;
          for (var i = 0; i < userInfoCard.length; i++) {
            if (userInfoCard[i].roleid == 0) {
              storeB = true;
              cannotApply = userInfoCard[i];
              break;
            }
            if (userInfoCard[i].roleid == 2) {
              cardB = true;
              cardInfo = userInfoCard[i];
              break;
            }
            if (userInfoCard[i].roleid == 3) {
              storeB = true;
              cannotApply = userInfoCard[i];
              break;
            }
            if (userInfoCard[i].roleid == 4) {
              storeB = true;
              cannotApply = userInfoCard[i];
              break;
            }
          }
          if (storeB) {
            this.common.tostMsg({msg:selfJson[cannotApply.roleid]})
            return 
          }
         
          if (cardB) {
            if (cardInfo.sourceType == 1) {
              //进入卡片
              this.common.tostMsg({msg:'已经是司机，请勿重复申请！'})
              // this.navCtrl.push('LogisticsPage');
            } else if (cardInfo.sourceType == 0) {
              //资料审核中
              setTimeout(() => { 
                this.navCtrl.push('ApplyLogisticsSuccessPage');
              },300)
            } else if (cardInfo.sourceType == -1) {
              setTimeout(() => { 
              this.navCtrl.push('ApplyLogisticsFailPage');
              },300)
              //黑名单/拉黑/解聘=-1
            } else if (cardInfo.sourceType == 2) {
              setTimeout(() => { 
                this.navCtrl.push('ApplyLogisticsFailPage');
              },300)
              //离职
            } else {
              //驳回中 cardInfo.sourceType == 3
              setTimeout(() => { 
                this.navCtrl.push('ApplyLogisticsFailPage');
              },300)
            }
          } else {
            console.log(window.localStorage.getItem('storeId'))
            //没有companyId 去申请店铺页面
            /**
             * 通过storeId获取 _belonCompanyid 
             * 
             */
            this.api.get(this.api.config.host.org + '/v2/user/queryBelongCompanyIdByStoreId').subscribe(data => { 
              if (data.success) {
                data.result = data.result ? data.result : '';
                setTimeout(() => { 
                  this.navCtrl.push('ApplyLogisticsRolePage', {_belonCompanyid: data.result});
                },500)
              } else { 
                this.common.tostMsg({msg:data.msg})
              }
            })
          }
        })
      }
    })
   }
}  

}
