import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api/api";
import { GoodsListBlockComponent } from '../../components/goods-list-block/goods-list-block';

/**
 * Generated class for the GoodsListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage({
   segment: 'goods_list'
 })
 @Component({
   selector: 'page-goods-list',
   templateUrl: 'goods-list.html',
 })
 export class GoodsListPage {
   @ViewChild(GoodsListBlockComponent) goodsListBlockComponent: GoodsListBlockComponent;
   loadGoodsListParams:any;

   constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
     let type = navParams.get('type');
     let catId = navParams.get('catId');
     let activityId = navParams.get('activityId');
     let selfStoreId = navParams.get('selfStoreId');

     if (catId) {
       this.loadGoodsListParams = {
        type: 'POST',
         url: this.api.config.host.bl + '/v2/goods/queryGoodsList',
         params: { cateId: catId },
         headers:true,
         dataKey: 'data'
       };
     }else if (activityId) {
      this.loadGoodsListParams = {
        type: 'POST',
        url: this.api.config.host.bl + 'v2/coupon/goods/font?activityId=' + activityId,
        dataKey: 'data',
        headers: {
          storeId:selfStoreId
        }
      };
    } 
     else {
       if (type == 'is_recommend') {
         this.loadGoodsListParams = {
           type: 'POST',
           url: this.api.config.host.bl + '/v2/goods/queryGoodsList',
           headers: true,
           dataKey: 'data'
         };
       } else { 
        this.loadGoodsListParams = {
          url: this.api.config.host.bl + 'goods/recommendlist',
          params: { type: 'is_hot' },
          dataKey: 'data'
        };
        if (type) {
          this.loadGoodsListParams.params.type = type;
        }
       }
       
     }
   }

   init(refresher?) {
     this.goodsListBlockComponent.init(refresher);
   }

   ionViewDidLoad() {
     this.init();
   }

 }
