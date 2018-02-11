import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Tabs} from 'ionic-angular';

/**
 * Generated class for the SnsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sns',
  templateUrl: 'sns.html',
})
export class SnsPage {
    @ViewChild('snsTabs') tabRef: Tabs;
    recentMessagePage="RecentMessagePage"//最近消息
    friendListPage="FriendListPage"//通讯录
    contactsPage="ContactsPage"
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
      // this.tabRef.select(0);
    console.log('ionViewDidLoad SnsPage');
  }

}
