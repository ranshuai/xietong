import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpConfig} from "../../../providers/HttpConfig";

/**
 * Generated class for the AddFriendPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpConfig:HttpConfig) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFriendPage');
  }

    /**
     * 不同途径添加好友
     * @param type
     */
    addFriend(channel){
    console.log("从什么途径添加好友:",channel);
    // this.navCtrl.push("SearchFriendPage",{channel:channel})
        if(channel=="search"){
    this.navCtrl.push("SearchFriendPage");

        }else{
            this.navCtrl.push("ContactsPage");
        }
    }
}
