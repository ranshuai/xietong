import { Component, Input } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { MainCtrl } from '../../providers/MainCtrl';

/**
 * Generated class for the ChangeRoleBtnPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'change-role-btn',
  templateUrl: 'change-role-btn.html',
})
export class ChangeRoleBtnShared {
  @Input() noSelectCard;
  @Input() type;
  @Input() frompage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private mainCtrl: MainCtrl,
    private events: Events) {
  }

  json = {
    1: '确定返回商城首页吗？',
    2: '确定退出物流人吗？',
    3: '确定返回商城首页吗？',
    4: '确定返回商城首页吗？',
    5: '确定返回商城首页吗？',
    6: '确定返回商城首页吗？'
  }

  openChangeModal() {
    console.log(this.noSelectCard);
    if (this.noSelectCard) {
      this.mainCtrl.utils.comConfirm(this.json[this.type], 1, false).subscribe(data => {
        if (data) {
          this.mainCtrl.setRootPage('TabMenuPage');
        }
      })
      return;
    } else {
      this.mainCtrl.utils.openModal('ChangeroleTabsPage', {}, {}, false).subscribe(
        data => {
          if (data) {
            this.navCtrl.push(data.page, data.data);
          }
        }
      );
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeRoleBtnPage');
  }

}
