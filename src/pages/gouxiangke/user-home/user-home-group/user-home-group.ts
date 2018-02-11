import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { GoodsListBlockComponent } from '../../components/goods-list-block/goods-list-block';

/**
 * Generated class for the UserHomeGroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-user-home-group',
  templateUrl: 'user-home-group.html',
})
export class UserHomeGroupPage {

  @ViewChild(GoodsListBlockComponent) goodsListBlockComponent: GoodsListBlockComponent;
  //轮播图是否显示
  homeHomeDataAdvShow = false;
  homeGroupData :any  = {};
  loadGroupListParams = {
    url: this.api.config.host.bl + 'goods/list/groupsBuyPage',
    // resultKey: 'goods',
    dataKey: 'data'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api
  ) {
  }

  getHomeGroupData(refresher?) {
    this.api.get(this.api.config.host.bl + 'v2/homePage/homeAdLoad',{pid:2}).subscribe((data: any) => { 
      if (data.success) { 
        this.homeGroupData.adv = data.result;
        this.homeGroupData.adv.length > 0 ? this.homeHomeDataAdvShow = true : this.homeHomeDataAdvShow = false;
        this.goodsListBlockComponent.init(refresher); // 
      }
    })
  }

  

  init(refresher?) {
    this.getHomeGroupData(refresher); //轮播图数据
  }

  ngAfterViewInit() {
    this.init();
  }

}
