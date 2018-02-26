import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

/**
 * Generated class for the UserInfoBankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-info-bank',
  templateUrl: 'user-info-bank.html',
})
export class UserInfoBankPage {
  bankList;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public common: CommonProvider,
    public api: Api,
  ) {
  }

  getBankDetailed() {
    this.api.get(this.api.config.host.org + 'v2/userAccount/queryUserBankInfo').subscribe(data => {
      if (data.success) {
        this.bankList = data.result;
        this.bankList.forEach((val, idx, array) => {
          // console.log(val)
          // console.log(idx)
          // console.log(this.bankList[idx].account)
          this.bankList[idx].account = this.bankList[idx].account.substr(0, 3) + '****' + this.bankList[idx].account.substr(14);
      });
        
      } else {
        this.common.tostMsg({ msg: data.msg });
      }
    })
  }

  userInfoAddBank() {
    this.navCtrl.push('UserInfoBankNewPage')
  }
  goToBankDetail(_item) {
    this.navCtrl.push('UserInfoBankDetailPage',{accountId:_item.accountId})
  }

  ionViewDidEnter(){
    this.getBankDetailed()
  }

}
