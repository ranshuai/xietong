import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../providers/api/api';


/**
 * Generated class for the UserTopicPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'user_topic'
})
@Component({
  selector: 'page-user-topic',
  templateUrl: 'user-topic.html',
})
export class UserTopicPage {
  page: number = 1;
  row: number = 10;
  loadEnd: boolean = false;
  topicData = undefined;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, ) {

  }


  ionViewDidEnter() {
    if (this.topicData) {
      console.log('数据已经加载不需要调用');
    } else {
      this.getList();
      console.log('数据为空需要加载');
    }
  }
  ionViewWillLeave() {
    console.log("ionViewWillLeave 当将要从页面离开时触发");
  }

  /**获取专题列表 */
  getList(refresher?) {
    if (this.loadEnd) {
      refresher && refresher.complete();
      return false;
    } //this.api.config.host.bl
    this.api.get( this.api.config.host.bl+ 'topic/query/topic', {
      page: this.page,
      rows: this.row,
      isHot:1
    }).subscribe(data => {
      if (data.success == true) {
        //如果是第一页就赋值  是其他就合并
        if (this.page == 1) {
          // this.topicData = data.result.topicss;
          this.topicData = data.result;
        } else {
          this.topicData = this.topicData.concat(data.result.topicss)
        }
        //if (data.result.topicss.length >= this.row) { //接口优化之后
        if (data.result.length >= this.row) {
          this.loadEnd = false;
        } else {
          this.loadEnd = true;
        }
        this.page++;
      }
      refresher && refresher.complete();
    });
  }
  /**上拉加载 */
  doInfinite(InfiniteScroll) {

    this.getList(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.page = 1;
    this.loadEnd = false;
    this.getList(refresher);
  }



}
