import { MainCtrl } from './../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, App } from 'ionic-angular';

/**
 * Generated class for the ChangeroleTabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changerole-tabs',
  templateUrl: 'changerole-tabs.html',
})
export class ChangeroleTabsPage {
  json: any = {};
  userInfoCard: any = [];
  identity;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public mainCtrl: MainCtrl,
  ) {
    // this.mainCtrl.commonModel.userId = '75918';
    // this.mainCtrl.httpService.config.platform = 'android';
    // this.mainCtrl.httpService.config.space = 'DF4D69929FD7F405';
    //保存用户的卡片信息
    // 1 = 招商合伙人 2= 众包快递员; 3 = 员工; 5 = 专家;
    // 待审核=0   在职/工作中=1 黑名单/拉黑/解聘=-1 离职=2   驳回中=3
    this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'v2/user/queryUserLevelCardList').subscribe((data) => {
      this.userInfoCard = data.result || [];

    })

  }

  //关闭遮罩层
  dismiss() {
    this.viewCtrl.dismiss(null, null, { animate: false });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeroleTabsPage');
  }

  //变身店铺
  goToChangeStorePage(event) {
    // this.mainCtrl.httpService.config.platform = 'android'; 
    if (this.mainCtrl.httpService.config.platform == 'wx') {
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {
        loading.dismiss();
        this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false).subscribe(data => {
          this.viewCtrl.dismiss({ page: 'PublicUserSetMobilePage', data: { type: 1 } });
        })
      } else {
        //如果有userId 授权成功
        if (this.mainCtrl.commonModel.userId) {
          loading.dismiss();
          //如果有userId 授权成功
          let callbackFn = (getUserRealQueryData) => {
            let _json = {
              0: '待审核',
              2: '驳回中',
              '-1': '自我关闭',
              '-2': '黑名单'
            }

            if (this.userInfoCard.length == 0) {
              this.viewCtrl.dismiss({ page: 'ApplyRolePage' });
              return;
            }

            for (var i = 0; i < this.userInfoCard.length; i++) {
              //判断用户是否有店铺或者站点
              if (this.userInfoCard[i].roleid == 0) {
                this.userInfoCard[i].moduleList = this.userInfoCard[i].moduleList ? this.userInfoCard[i].moduleList : [];
                //循环 moduleList 
                for (var j = 0; j < this.userInfoCard[i].moduleList.length; j++) {
                  if (this.userInfoCard[i].moduleList[j].companyModuleId == 5) {
                    if (this.userInfoCard[i].moduleList[j].state == 1) {
                      let _companyId = this.userInfoCard[i].moduleList[j].companyInfoId;
                      window.localStorage.setItem('storeId', _companyId);
                      this.viewCtrl.dismiss();//关闭卡牌遮罩层
                      this.mainCtrl.setRootPage('StorePage');
                    } else if (this.userInfoCard[i].moduleList[j].state != 1) {
                      if (this.userInfoCard[i].moduleList[j].state == 2) {
                        this.viewCtrl.dismiss({ page: 'ApplyRolePage', data: { type: 2 } });
                        this.mainCtrl.nativeService.showToast("店铺被驳回，请重新提交申请");
                      } else {
                        this.mainCtrl.nativeService.showToast('店铺' + _json[this.userInfoCard[i].sourceType]);
                      }
                      break;
                    }
                    break;
                  }
                }
                break;
              }
              if (this.userInfoCard.length - 1 == i) {
                this.viewCtrl.dismiss({ page: 'ApplyRolePage' });
              }
            }
          }
          this.getUserRealQuery({ callback: callbackFn, title: "需要实名认证之后,才能变身店铺", scene: 4 });
        }
      }

    }
    if (this.mainCtrl.httpService.config.platform == 'android') {
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();

      if (!this.mainCtrl.commonModel.userId) {
        loading.dismiss();
        this.viewCtrl.dismiss({ page: 'PublicLoginPage' });
      } else {
        loading.dismiss();

        //查看当前用户的状态
        this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe((data) => {
          //如果status = 10112 没有实名认证
          if (data.result && data.result.status == 10112) {
            this.mainCtrl.utils.comConfirm('需要实名认证之后,才能变身店铺', 2, false, 'popupAlert').subscribe(data => {
              this.viewCtrl.dismiss({ page: 'UserRealQueryPage', data: { scene: 4 } });
            })
            return;
          } else {
            window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity));

            let json = {
              0: '待审核',
              2: '驳回中',
              '-1': '自我关闭',
              '-2': '黑名单'
            }
            if (this.userInfoCard.length == 0) {
              this.viewCtrl.dismiss({ page: 'ApplyRolePage' });
              return;
            }
            //
            for (var i = 0; i < this.userInfoCard.length; i++) {
              //判断用户是否有店铺或者站点
              if (this.userInfoCard[i].roleid == 0) {
                this.userInfoCard[i].moduleList = this.userInfoCard[i].moduleList ? this.userInfoCard[i].moduleList : [];
                //循环 moduleList 
                for (var j = 0; j < this.userInfoCard[i].moduleList.length; j++) {
                  if (this.userInfoCard[i].moduleList[j].companyModuleId == 5) {
                    if (this.userInfoCard[i].moduleList[j].state == 1) {
                      let _companyId = this.userInfoCard[i].moduleList[j].companyInfoId;
                      window.localStorage.setItem('storeId', _companyId);
                      this.viewCtrl.dismiss();//关闭卡牌遮罩层
                      this.mainCtrl.setRootPage('StorePage');
                    } else if (this.userInfoCard[i].moduleList[j].state != 1) {
                      if (this.userInfoCard[i].moduleList[j].state == 2) {
                        this.viewCtrl.dismiss({ page: 'ApplyRolePage', data: { type: 2 } });
                        this.mainCtrl.nativeService.showToast("店铺被驳回，请重新提交申请");
                      } else {
                        this.mainCtrl.nativeService.showToast('店铺' + json[this.userInfoCard[i].sourceType]);
                      }
                      break;
                    }
                    break;
                  }
                }
                break;
              }
              if (this.userInfoCard.length - 1 == i) {
                this.viewCtrl.dismiss({ page: 'ApplyRolePage' });
              }
            }
            // 
          }
        })
      }
    }
  }

  //变身物流人
  goToChangeLogisticsPage() {
    if (this.mainCtrl.httpService.config.platform == 'android') {
      window.localStorage.setItem('userInfoCard', JSON.stringify(this.json));
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      if (!this.mainCtrl.commonModel.userId) {
        loading.dismiss();
        //没有userId去登录页面
        this.viewCtrl.dismiss({ page: 'PublicLoginPage' });
      } else {
        loading.dismiss();
        //查看当前用户的状态
        this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe((data) => {
          //如果status = 10112 没有实名认证
          if (data.result && data.result.status == 10112) {
            this.mainCtrl.utils.comConfirm('需要实名认证之后,才能变身配送员', 2, false, 'popupAlert').subscribe(data => {
              this.viewCtrl.dismiss({ page: 'UserRealQueryPage', data: { scene: 1 } });
            })
            return
          } else {
            window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity))
            //判断是否有注册过员工
            let cardB = false;
            let cardInfo: any;
            for (var i = 0; i < this.userInfoCard.length; i++) {
              if (this.userInfoCard[i].roleid == 2) {
                cardB = true;
                cardInfo = this.userInfoCard[i];
                break;
              }
            }

            if (cardB) {
              if (cardInfo.sourceType == 1) {
                //进入卡片
                this.viewCtrl.dismiss();//关闭卡牌遮罩层
                this.mainCtrl.setRootPage('logistics-tabs');
              } else if (cardInfo.sourceType == 0) {
                //资料审核中
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsSuccessPage' });
              } else if (cardInfo.sourceType == -1) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //黑名单/拉黑/解聘=-1
              } else if (cardInfo.sourceType == 2) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //离职
              } else {
                //驳回中 cardInfo.sourceType == 3
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
              }
            } else {
              //没有companyId 去变身配送员页面
              this.viewCtrl.dismiss({ page: 'ApplyLogisticsRolePage' });
              // this.navCtrl.push('ApplyLogisticsRolePage');
            }
          }
        })
      }
    }

    if (this.mainCtrl.httpService.config.platform == 'wx') {
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {
        loading.dismiss();
        this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false, 'popupAlert').subscribe(() => {
          this.viewCtrl.dismiss({ page: 'PublicUserSetMobilePage', data: { type: 1 } });
        })
      } else {
        //如果有userId 授权成功
        if (this.mainCtrl.commonModel.userId) {
          loading.dismiss();
          let callbackFn = (getUserRealQueryData) => {
            //判断是否有注册过物流人
            let cardB = false;
            let cardInfo: any;
            for (var i = 0; i < this.userInfoCard.length; i++) {
              if (this.userInfoCard[i].roleid == 2) {
                cardB = true;
                cardInfo = this.userInfoCard[i];
                break;
              }
            }
            if (cardB) {
              if (cardInfo.sourceType == 1) {
                //进入卡片
                this.viewCtrl.dismiss();//关闭卡牌遮罩层
                this.mainCtrl.setRootPage('logistics-tabs');
              } else if (cardInfo.sourceType == 0) {
                //资料审核中
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsSuccessPage' });
              } else if (cardInfo.sourceType == -1) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //黑名单/拉黑/解聘=-1
              } else if (cardInfo.sourceType == 2) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //离职
              } else {
                //驳回中 cardInfo.sourceType == 3
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
              }
            } else {
              //没有companyId 去变身配送员页面
              this.viewCtrl.dismiss({ page: 'ApplyLogisticsRolePage' });
            }

          }
          this.getUserRealQuery({ callback: callbackFn, title: "需要实名认证之后,才能变身配送员", scene: 1 });
        }
      }
    }
  }

  //变身招商人
  goToChangeBusinessPage() {
    if (this.mainCtrl.httpService.config.platform == 'wx') {
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {
        loading.dismiss();
        this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false, 'popupAlert').subscribe(() => {
          this.viewCtrl.dismiss({ page: 'PublicUserSetMobilePage', data: { type: 1 } });
        })
      } else {
        if (this.mainCtrl.commonModel.userId) {
          loading.dismiss();
          let callbackFn = (getUserRealQueryData) => {
            window.localStorage.setItem('userIdentity', JSON.stringify(getUserRealQueryData.result.identity))
            //判断是否有注册过员工
            let cardB = false;
            let cardInfo: any;
            for (var i = 0; i < this.userInfoCard.length; i++) {
              if (this.userInfoCard[i].roleid == 1) {
                cardB = true;
                cardInfo = this.userInfoCard[i];
                break;
              }
            }

            //判断是否有注册过招商人
            if (cardB) {
              if (cardInfo.sourceType == 1) {
                //进入卡片
                this.viewCtrl.dismiss();//关闭卡牌遮罩层
                this.mainCtrl.setRootPage('InvestpersonTabsPage');
              } else if (cardInfo.sourceType == 0) {
                //资料审核中
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsSuccessPage' });
              } else if (cardInfo.sourceType == -1) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //黑名单/拉黑/解聘=-1
              } else if (cardInfo.sourceType == 2) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //离职
              } else {
                //驳回中 cardInfo.sourceType == 3
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage', data: { cardType: 1 } });
              }
            } else {
              this.viewCtrl.dismiss({ page: 'ApplyLogisticsRolePage', data: { cardType: 1 } });
            }
          }
          this.getUserRealQuery({ callback: callbackFn, title: "需要实名认证之后,才能变身招商人", scene: 3 });
        }
      }
    }
    if (this.mainCtrl.httpService.config.platform == 'android') {
      window.localStorage.setItem('userInfoCard', JSON.stringify(this.json));
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      setTimeout(() => {
        // this.mainCtrl.nativeService.showToast('变身招商人功能还未开通，敬请期待~');
        if (!this.mainCtrl.commonModel.userId) {
          loading.dismiss();
          //没有userId去登录页面
          this.viewCtrl.dismiss({ page: 'PublicLoginPage' });
        } else {
          loading.dismiss();
          //查看当前用户的状态
          this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe((data) => {
            //如果status = 10112 没有实名认证
            if (data.result && data.result.status == 10112) {
              this.mainCtrl.utils.comConfirm('需要实名认证之后,才能变身招商人', 2, false, 'popupAlert').subscribe(data => {
                this.viewCtrl.dismiss({ page: 'UserRealQueryPage', data: { scene: 3 } });
              })
              return
            } else {
              window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity))
              //判断是否有注册过员工
              let cardB = false;
              let cardInfo: any;
              for (var i = 0; i < this.userInfoCard.length; i++) {
                if (this.userInfoCard[i].roleid == 1) {
                  cardB = true;
                  cardInfo = this.userInfoCard[i];
                  break;
                }
              }
              //判断是否有注册过招商人
              if (cardB) {
                if (cardInfo.sourceType == 1) {
                  //进入卡片
                  this.viewCtrl.dismiss();//关闭卡牌遮罩层

                  this.mainCtrl.setRootPage('InvestpersonTabsPage');
                } else if (cardInfo.sourceType == 0) {
                  //资料审核中
                  this.viewCtrl.dismiss({ page: 'ApplyLogisticsSuccessPage' });
                } else if (cardInfo.sourceType == -1) {
                  this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                  //黑名单/拉黑/解聘=-1
                } else if (cardInfo.sourceType == 2) {
                  this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                  //离职
                } else {
                  //驳回中 cardInfo.sourceType == 3
                  this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage', data: { cardType: 1 } });
                }
              } else {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsRolePage', data: { cardType: 1 } });
              }
            }
          })
        }
      }, 2000)
    }
  }

  //变身公司
  goToChangeCompanyPage() {
    //  this.mainCtrl.setRootPage('CompanyTabsPage');
    this.viewCtrl.dismiss();//关闭卡牌遮罩层

    this.mainCtrl.setRootPage('UnitTabsPage');


    // if (this.mainCtrl.httpService.config.platform == 'wx') {
    //   if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {

    //     this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false,'popupAlert').subscribe(() => {
    //       setTimeout(() => {
    //         this.viewCtrl.dismiss({ page: 'PublicUserSetMobilePage', data: { type: 1 } });
    //       }, 500);
    //     })
    //   } else {
    //     event.stopPropagation();
    //     let loading = this.loadingCtrl.create({
    //       content: '数据加载中。。。'
    //     })
    //     loading.present();
    //     if (this.mainCtrl.commonModel.userId) {
    //       loading.dismiss();
    //       let callbackFn = (getUserRealQueryData) => {
    //         let cardB = false;
    //         for (var i = 0; i < this.userInfoCard.length; i++) {
    //           if (this.userInfoCard[i].roleid == 11111) {
    //             cardB = true;
    //           }
    //         }
    //         //判断是否有注册过公司
    //         if (cardB) {
    //           //
    //           this.navCtrl.push('CompanyHomepagePage');
    //         } else {
    //           //没有companyId 去申请公司页面
    //           this.navCtrl.push('ApplyCompanyPage');
    //         }
    //       }
    //       this.getUserRealQuery({ callback: callbackFn, title: '需要实名认证之后,才能变身公司', scene: 6 });
    //     }

    //   }
    //   // this.mainCtrl.nativeService.showToast('变身员工功能还未开通，敬请期待~');
    // }
    // if (this.mainCtrl.httpService.config.platform == 'android') {
    //   event.stopPropagation();
    //   let loading = this.loadingCtrl.create({
    //     content: '数据加载中。。。'
    //   })
    //   loading.present();
    //   // this.mainCtrl.nativeService.showToast('变身员工功能还未开通，敬请期待~');
    //   if (!this.mainCtrl.commonModel.userId) {
    //     loading.dismiss()
    //     //没有userId去登录页面
    //     this.viewCtrl.dismiss({ page: 'PublicLoginPage'});
    //   } else {
    //     loading.dismiss()
    //     //查看当前用户的状态
    //     this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe((data) => {
    //       //如果status = 10112 没有实名认证
    //       if (data.result && data.result.status == 10112) {
    //         this.mainCtrl.utils.comConfirm('需要实名认证之后,才能变身公司', 2, false,'popupAlert').subscribe(data => {
    //           this.viewCtrl.dismiss({ page: 'UserRealQueryPage', data: { scene: 6} });
    //         })
    //         return
    //       } else {
    //         window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity))
    //         let cardB = false;
    //         for (var i = 0; i < this.userInfoCard.length; i++) {
    //           if (this.userInfoCard[i].roleid == 11111) {
    //             cardB = true;
    //           }
    //         }
    //         //判断是否有注册过公司
    //         if (cardB) {
    //           //
    //           this.navCtrl.push('CompanyHomepagePage');
    //         } else {
    //           //没有companyId 去申请公司页面
    //           this.navCtrl.push('ApplyCompanyPage');
    //         }
    //       }
    //     })
    //   }

    // }
  }

  //变身员工
  goToChangeStaffPage() {
    if (this.mainCtrl.httpService.config.platform == 'wx') {
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {
        loading.dismiss();
        this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false, 'popupAlert').subscribe(() => {
          this.viewCtrl.dismiss({ page: 'PublicUserSetMobilePage', data: { type: 1 } });
        })
      } else {
        //this.mainCtrl.nativeService.showToast('变身员工功能还未开通，敬请期待~');
        //如果有userId 授权成功
        if (this.mainCtrl.commonModel.userId) {
          loading.dismiss();
          let callbackFn = (getUserRealQueryData) => {
            let cardB = false;
            let cardInfo: any;
            for (var i = 0; i < this.userInfoCard.length; i++) {
              if (this.userInfoCard[i].roleid == 3) {
                cardB = true;
                cardInfo = this.userInfoCard[i];
                break;
              }
            }
            if (cardB) {
              if (cardInfo.sourceType == 1) {
                if (cardInfo.moduleList[0].state != 1) {
                  //不为1说明是当前用户加入的组织为非正常运营状态
                  this.mainCtrl.nativeService.showToast('您加入的组织为非正常运营状态~');
                } else {
                  //存储店铺id和模块id
                  this.mainCtrl.commonModel.userInfo.belongCompanyid = cardInfo.belongCompanyid;
                  this.mainCtrl.commonModel.userInfo.companyModuleId = cardInfo.moduleList[0].companyModuleId;
                  this.viewCtrl.dismiss();//关闭卡牌遮罩层
                  //进入卡片
                  this.mainCtrl.setRootPage('StaffTabsPage');
                }

              } else if (cardInfo.sourceType == 0) {
                //资料审核中
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsSuccessPage', data: { cardType: 3 } });
              } else if (cardInfo.sourceType == -1) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //黑名单/拉黑/解聘=-1
              } else if (cardInfo.sourceType == 2) {
                //在PC后台被解聘后，直接重新搜索加入
                this.viewCtrl.dismiss({ page: 'SelectCompanyPage' });
                //离职
              } else {
                //驳回中 cardInfo.sourceType == 3
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage', data: { cardType: 3 } });
              }
            } else {
              //没有companyId 去搜索单位页面
              this.viewCtrl.dismiss({ page: 'SelectCompanyPage' });
            }

          }
          this.getUserRealQuery({ callback: callbackFn, title: '需要实名认证之后,才能变身员工', scene: 2 });
        }

      }
    }

    if (this.mainCtrl.httpService.config.platform == 'android') {
      window.localStorage.setItem('userInfoCard', JSON.stringify(this.json));
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      // this.mainCtrl.nativeService.showToast('变身员工功能还未开通，敬请期待~');
      if (!this.mainCtrl.commonModel.userId) {
        loading.dismiss()
        //没有userId去登录页面
        this.viewCtrl.dismiss({ page: 'PublicLoginPage' });
      } else {
        loading.dismiss()
        //查看当前用户的状态
        this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe((data) => {
          //如果status = 10112 没有实名认证
          if (data.result && data.result.status == 10112) {
            this.mainCtrl.utils.comConfirm('需要实名认证之后,才能申请员工', 2, false, 'popupAlert').subscribe(data => {
              this.viewCtrl.dismiss({ page: 'UserRealQueryPage', data: { scene: 2 } });
            })
            return
          } else {
            window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity))
            //判断是否有注册过员工
            let cardB = false;
            let cardInfo: any;
            for (var i = 0; i < this.userInfoCard.length; i++) {
              if (this.userInfoCard[i].roleid == 3) {
                cardB = true;
                cardInfo = this.userInfoCard[i];
              }
            }
            if (cardB) {
              if (cardInfo.sourceType == 1) {
                if (cardInfo.moduleList[0].state != 1) {
                  //不为1说明是当前用户加入的组织为非正常运营状态
                  this.mainCtrl.nativeService.showToast('您加入的组织为非正常运营状态~');
                } else {
                  //存储店铺id和模块id
                  this.mainCtrl.commonModel.userInfo.belongCompanyid = cardInfo.belongCompanyid;
                  this.mainCtrl.commonModel.userInfo.companyModuleId = cardInfo.moduleList[0].companyModuleId;
                  //进入卡片
                  this.viewCtrl.dismiss();//关闭卡牌遮罩层
                  this.mainCtrl.setRootPage('StaffTabsPage');
                }

              } else if (cardInfo.sourceType == 0) {
                //资料审核中
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsSuccessPage', data: { cardType: 3 } });
              } else if (cardInfo.sourceType == -1) {
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage' });
                //黑名单/拉黑/解聘=-1
              } else if (cardInfo.sourceType == 2) {
                //在PC后台被解聘后，直接重新搜索加入
                this.viewCtrl.dismiss({ page: 'SelectCompanyPage' });
                //离职
              } else {
                //驳回中 cardInfo.sourceType == 3
                this.viewCtrl.dismiss({ page: 'ApplyLogisticsFailPage', data: { cardType: 3 } });
              }
            } else {
              //没有companyId 去搜索单位页面
              this.viewCtrl.dismiss({ page: 'SelectCompanyPage' });
            }
          }
        })
      }

    }
  }

  //变身专家
  goToChangeExpertPage(event) {
    if (this.mainCtrl.httpService.config.platform == 'android') {
      event.stopPropagation();
      this.viewCtrl.dismiss(null, null, { animate: false }).then(() => {
        this.mainCtrl.setRootPage('BrainpowerTabsPage')
      })
    }
  }
  //变身营销人
  goToChangeMarketerPage() {
    if (this.mainCtrl.httpService.config.platform == 'wx') {
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {
        loading.dismiss()
        this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false, 'popupAlert').subscribe(() => {
          this.viewCtrl.dismiss({ page: 'PublicUserSetMobilePage', data: { type: 1 } });
        })
      } else {
        setTimeout(() => {
          loading.dismiss()
          this.viewCtrl.dismiss({ page: 'SalesmanPage' });
        }, 2000)
      }
    }

    if (this.mainCtrl.httpService.config.platform == 'android') {
      event.stopPropagation();
      let loading = this.loadingCtrl.create({
        content: '数据加载中。。。'
      })
      loading.present();
      setTimeout(() => {
        if (!this.mainCtrl.commonModel.userId) {
          //没有userId去登录页面
          loading.dismiss();
          this.viewCtrl.dismiss({ page: 'PublicLoginPage' });
        } else {
          loading.dismiss();
          this.viewCtrl.dismiss({ page: 'SalesmanPage' });
        }
      }, 1000)
    }
  }


  getUserRealQuery(json): void {
    this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe(data => {
      //如果status = 10112 没有实名认证 
      data.result = data.result ? data.result : {};
      if (data.result && data.result.status == 10112) {
        this.mainCtrl.utils.comConfirm(json.title, 2, false, 'popupAlert').subscribe(data => {
          this.viewCtrl.dismiss({ page: 'UserRealQueryPage', data: { scene: json.scene } });
        })
        return
      } else {
        //保存用户的真实信息
        window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity))
        json.callback && json.callback(data);
      }
    })
  }

}
