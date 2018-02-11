import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';

/**
 * Generated class for the ApplyLogisticsSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-apply-logistics-success',
  templateUrl: 'apply-logistics-success.html',
})
export class ApplyLogisticsSuccessPage {
  Staff: boolean = false;//是否是员工
  cardType;

  constructor(public navCtrl: NavController, public navParams: NavParams, private mainCtrl: MainCtrl) {
    this.cardType = navParams.get('cardType');
    //如果为3,说明是从员工页面跳转过来的，页面中需要显示撤销申请按钮
    if (this.cardType == 3) {
      this.Staff = true;
    }
  }

  go() {
      this.mainCtrl.setRootPage('TabMenuPage');
  }

  //员工撤销申请
  undo() {
    this.mainCtrl.utils.comConfirm('确认要撤销申请吗？', 1, false).subscribe(data => {
      this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'v2/user/cancelOrAgainApplyStaff', {
        optType: 1,
        roleid: 3
      }).subscribe((data) => {
        if (data.success && data.result) {
          this.mainCtrl.nativeService.showToast('撤销申请成功~');
          setTimeout(() => {
            this.mainCtrl.setRootPage('TabMenuPage');
          }, 1000)
        } else {
          this.mainCtrl.nativeService.showToast(data.msg);
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyLogisticsSuccessPage');
  }

}
