import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { LoadMoreComponent } from '../../components/load-more/load-more'

/**
 * Generated class for the UserHomeHistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-user-home-history',
  templateUrl: 'user-home-history.html',
})
export class UserHomeHistoryPage {
  //需要用到，loadmore组件中的事件来初始化
  @ViewChild(LoadMoreComponent) loadMoreComponent: LoadMoreComponent;

  historyList: any = [];
  page: number = 1;
  rows: number = 10;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  loadMore(callback) {
    this.api.get(this.api.config.host.org + 'user/see/query/log', {
      page: this.page,
      rows: this.rows
    }).subscribe(data => {
      if (data.success == true) {
        callback(this, data.result, 'goods', 'historyList');
      }
    });
  }

  init(refresher?) {
    this.page = 1;
    this.loadMoreComponent.init(refresher);
  }

  ngAfterViewInit() {
    this.init();
  }

}
