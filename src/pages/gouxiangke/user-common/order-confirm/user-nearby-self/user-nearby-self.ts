import { CommonProvider } from './../../../providers/common/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

/**
 * Generated class for the UserNearbySelfPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-nearby-self',
  templateUrl: 'user-nearby-self.html',
})
export class UserNearbySelfPage {
  dataList: any;
  dataListLength: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,public events:Events,public commonProvider:CommonProvider ) {
    //接受传递的参数
    this.dataList = navParams.get('dataList');
    this.dataListLength = this.dataList.length;
    console.log(this.dataList);

    //默认选中的状态
    for (var i = 0; i < this.dataListLength; i++) {
      this.dataList[i].default = false;
    }
    this.dataList[0].default = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserNearbySelfPage');
  }

  //选择自提点
  selectNearby(item?) { 
    console.log(item)
    //订阅事件
    this.events.publish('nearbySelf', item);
    let index: number;

    for (var i = 0; i < this.dataListLength; i++) {
      if (this.dataList[i].id == item.id) {
        index = i;
       }
      this.dataList[i].default = false;
    } 
    this.dataList[index].default = true;

    this.navCtrl.pop()
  }
}
