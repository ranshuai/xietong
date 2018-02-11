import { GoodsDetailPage } from './../../user-common/goods-detail/goods-detail';
import { CommonProvider } from './../../providers/common/common';
import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { SearchPageModule } from '../../user-common/search/search.module';
import { Api } from '../../providers/api/api';
import { GoodsListBlockComponent } from '../../components/goods-list-block/goods-list-block';
/**
 * Generated class for the UserTopicDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'user-topic-details',
  templateUrl: 'user-topic-details.html',
})
export class UserTopicDetailsPage {
  @ViewChild(GoodsListBlockComponent) goodsListBlockComponent: GoodsListBlockComponent;
  goodsDetailPage = GoodsDetailPage;
  page: number = 1;
  row: number = 10;
  loadEnd: boolean = false;
  topicDetail = undefined;
  loadRecomendListParams: any;
  version;
  storeVOList;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public commonProvider: CommonProvider) {
    this.version = navParams.get('version');
    if (this.version == 2) {
      this.loadRecomendListParams = {
        url: this.api.config.host.bl + 'v2/Topic/queryDomainTopicById',
        params: { topicId: this.navParams.get('id') },
      };
    } else { 
      this.loadRecomendListParams = {
        url: this.api.config.host.bl+ 'topic/query/topic/info',
        params: { topicId: this.navParams.get('id')},
        resultKey: 'topicGoods',
        dataKey:'data',
       };
    }
  }

  ionViewDidEnter() {
    this.getTopicDetail();
  }
  ionViewWillLeave() {
    console.log("ionViewWillLeave 当将要从页面离开时触发");
  }
  
  getTopicDetail(refresher?) {  //this.api.config.host.bl 
    if (this.version == 2) {
      this.api.get(this.api.config.host.bl + 'v2/Topic/queryDomainTopicById', {
        topicId: this.navParams.get('id')
      }).subscribe(data => {
        if (data.success) {
          this.topicDetail = data.result;
          // this.goodsListBlockComponent.init()
        } else {
          this.commonProvider.tostMsg({ msg: data.msg })
        }
      });

    } else { 
      this.api.get(this.api.config.host.bl+ 'topic/query/topic/info', {
        page: this.page,
        rows: this.row,
        topicId:this.navParams.get('id')
       }).subscribe(data => {
         if (data.success) {
           this.topicDetail = data.result;
           this.goodsListBlockComponent.init()
         } else { 
           this.commonProvider.tostMsg({msg:data.msg})
         }
      });
    }
    
    
  }

  goToStore(item) { 
    this.commonProvider.goToPage('StoreDetailPage', { store_id: item.storeId });
  }

  goToDetail(item) {
    this.commonProvider.goToPage(this.goodsDetailPage, { goods_id: item.goodsId});
  }
}
