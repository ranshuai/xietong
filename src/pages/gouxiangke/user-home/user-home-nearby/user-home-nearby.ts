import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { GoodsListBlockComponent } from '../../components/goods-list-block/goods-list-block';
import { ThirdPartyApiProvider } from "../../providers/third-party-api/third-party-api";

/**
 * Generated class for the UserHomeNearbyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-user-home-nearby',
  templateUrl: 'user-home-nearby.html',
})
export class UserHomeNearbyPage {

  @ViewChild(GoodsListBlockComponent) goodsListBlockComponent: GoodsListBlockComponent;
  //轮播图是否显示 &latitit=39.90403&page=1&rows=100
  homeHomeDataAdvShow = false;

  homeNearbyData :any  = {};
  loadNearbyListParams = {
    url: this.api.config.host.bl + 'goods/list/nearbyPage',
    params: {
      longtit: 116.407526,
      latitit: 39.90403,
    },
    // resultKey: 'goods',
    dataKey: 'data'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    private thirdPartyApi: ThirdPartyApiProvider,
  ) {

  }

  getHomeNearbyData(refresher?) {
    this.api.get(this.api.config.host.bl + 'v2/homePage/homeAdLoad', {pid:3}).subscribe((data: any) => {
      if (data.success) {
        this.homeNearbyData.adv = data.result;
        this.homeNearbyData.adv.length > 0 ? this.homeHomeDataAdvShow = true : this.homeHomeDataAdvShow = false;
      }
    })
    
    //获取地理信息
    // this.goodsListBlockComponent.init(refresher); //测试坐标获取数据
    this.thirdPartyApi.getGeolocation().subscribe((data:any) => {
      console.log(data.lat)
      console.log(data.lon)
      //获取商品列表信息
      this.loadNearbyListParams.params.longtit = data.lon; //经度
      this.loadNearbyListParams.params.latitit = data.lat; //维度
      this.goodsListBlockComponent.init(refresher);
    });
  }

  init(refresher?) {
    console.log('进入附近好货');
    this.getHomeNearbyData(refresher);
  }

  ngAfterViewInit() {
    this.init();
  }

}
