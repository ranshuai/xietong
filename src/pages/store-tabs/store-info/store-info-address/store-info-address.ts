import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api";
import { DataFilterService } from "../../providers/data-filter/data-filter.servce";
declare var AMap;

/**
 * Generated class for the StoreInfoAddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-info-address',
  templateUrl: 'store-info-address.html',
})
export class StoreInfoAddressPage {

  storeInfoAddressData: any = {};
  companyId: any;
  constructor(
    public api: Api,
    public dataFilterService: DataFilterService,
    public navParams:NavParams
  ) {
    this.companyId = navParams.get('companyId')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreInfoAddressPage');
    this.init();
  }

  init() {
    this.getStoreInfoAddress()
   }

  getStoreInfoAddress() {
    let url = "v2/check/queryStorePhoto";
    let params = {
      companyId:this.companyId 
    };
    this.api.get(this.api.config.host.org + url, params).subscribe(data => { 
      if (data.success) {
        this.dataFilterService.filter('storeInfoAddress', data).subscribe(data => { 
          this.storeInfoAddressData = data;
          
          //init初始化地图

          var map = new AMap.Map('container', {
            resizeEnable: true,
            zoom: 18,
            center: [data.map.longtit, data.map.latitit]
          });
  
          var marker = new AMap.Marker({
            position: map.getCenter(),
            //draggable: true,
            cursor: 'move'
          });
  
          marker.setMap(map);
          // 设置点标记的动画效果，此处为弹跳效果
          marker.setAnimation('AMAP_ANIMATION_DROP');
        })
       }
    })
  }
}
