import { CommonModel } from './../../../../providers/CommonModel';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides,IonicPage } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';
import { CommonData } from '../../providers/user/commonData.model';
import { User } from '../../providers/user/user';

/**
 * Generated class for the UserInfoWalletPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-wallet',
  templateUrl: 'user-info-wallet.html',
})
export class UserInfoWalletPage {
  userInfoWalletRechargePage = 'UserInfoWalletRechargePage'; //充值
  userInfoWalletWithdrawalsPage = 'UserInfoWalletWithdrawalsPage';//提现
  userSetPasswordPayPage = 'UserSetPasswordPayPage'; //设置密码|修改密码
  userSetMobilePage = 'UserSetMobilePage';
  nav = {
    activeIndex: 0,
    page: 1,
    rows: 10,
    loadEnd: false,
    list: undefined,
    money: 0,
    userId: this.commonModel.userId
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public common: CommonProvider, public commonData: CommonData, public user: User,public commonModel:CommonModel) {
  
  }


  //获取用户余额
  getMoneyInit() {
    this.api.get(this.api.config.host.org + 'finance/query/money').subscribe(data => {
      if (data.success) {
        this.nav = data.result;
        this.nav.page = 1;
        this.nav.rows = 10;
        this.nav.activeIndex = 0;
        this.nav.loadEnd = false;
        this.getQueryWallet();
        this.commonData.user_info_wallet = data.result;
      } else {
        this.common.tostMsg({ msg: data.msg });
      }
    })
  }

  getQueryWallet(refresher?) {
    let type = this.nav.activeIndex == 0 ? 1 : 0;
    if (this.nav.loadEnd) {
      refresher && refresher.complete();
      return false;
    }
    this.api.get(this.api.config.host.org + 'finance/query/moneyLog', {
      type: type,
      page: this.nav.page,
      rows: this.nav.rows
    }).subscribe(data => {
      if (data.success) {
        if (this.nav.page == 1) {
          this.nav.list = type == 0 ? data.result.outsides : data.result.insides;
        } else {
          this.nav.list = this.nav.list.concat(type == 0 ? data.result.outsides : data.result.insides)
        }
        let row = type == 0 ? data.result.outsides.length : data.result.insides.length; this.nav.loadEnd = row >= this.nav.rows ? false : true;
        this.nav.page++;
        refresher && refresher.complete();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }
  /**上拉加载 */
  doInfinite(InfiniteScroll) {
    this.getQueryWallet(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.nav.page = 1;
    this.nav.loadEnd = false;
    this.getQueryWallet(refresher);
  }
  // 查询类型改变
  changeActive(_index) {
    if (this.nav.activeIndex != _index) {
      this.nav.activeIndex = _index;
      this.nav.page = 1;
      this.nav.loadEnd = false;
      this.nav.list = undefined;
      this.getQueryWallet();
    }
  }


  ionViewDidEnter() {
    if (this.nav.userId) {
      this.getMoneyInit();
    }
  }
  //页面跳转
  goToPageWallet(_type) {
    if (!this.nav.userId) {
      this.common.tostMsg({ mag: '请登录您的账号' })
    } else {
      if (!this.commonModel.TAB_INIT_USERINFO.mobile) {
        this.common.openMobileModal().subscribe(() => {
          this.navCtrl.push(this.userSetMobilePage)
           })
          } else {
            let url = _type == 0 ? this.userInfoWalletRechargePage : this.userInfoWalletWithdrawalsPage;
            if (_type == 1) {
              this.api.post(this.api.config.host.org + 'user/paypwd/check', {}).subscribe(data => {
                if (data.success) {
                  if (!data.result) {
                    this.common.tostMsg({ msg: '请设置支付密码' });
                    this.navCtrl.push(this.userSetPasswordPayPage, {});
                    return
                  } else {
                    this.navCtrl.push(url, {});
                  }
                }
              })
            } else {
              this.navCtrl.push(url, {});
            }
          }
    }
  }

     ionViewWillLeave() {
  }

}
