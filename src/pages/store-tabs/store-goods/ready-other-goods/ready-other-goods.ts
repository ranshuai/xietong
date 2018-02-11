import { CommonProvider } from './../../../gouxiangke/providers/common/common';
import { StoreCacheInfoProvider } from './../../providers/store-cache-info/store-cache-info';
import { Api } from './../../../gouxiangke/providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

/**
 * Generated class for the ReadyOtherGoodsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-ready-other-goods',
  templateUrl: 'ready-other-goods.html',
})
export class ReadyOtherGoodsPage {
  //代售商品数据
  data: any;
  //点击编辑 配置信息
  editConfig: any;
  checkBoxAll: boolean; // 全选
  //
  myAgentGoodsList;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api,public storeCacheInfoProvider:StoreCacheInfoProvider,public events:Events,public commonProvider:CommonProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReadyOtherGoodsPage');
    this.editConfigInit();
    this.readyOtherGoodsPage();
  }
  //准备代售的商品
  readyOtherGoodsPage() { 
    this.data = this.storeCacheInfoProvider.getCacheOtherGoodsList();
  }

  //点击编辑导航
  changeView(b) { 
    console.log(b);
    if (!b) {
      this.editConfigInit({ footerType: b});
    } else { 
      this.editConfigInit({ footerType: b,txt:'完成',txtClass:'ac',footerTxt:'删除'});
    }
  }
  //初始化编辑状态；
  editConfigInit(json?) {
    json || (json = {});
    
    this.editConfig = {
      txt: json.txt|| '编辑',
      txtClass:json.txtClass,
      footerType: json.footerType || 0,
      footerTxt: json.footerTxt || '确认代售',
      event:json.event
    }
  }

  save() { 
    let goodsIds = [];
    let goodsIds1 = [];
    for (var i = 0; i < this.storeCacheInfoProvider.cacheOtherGoodsList.length; i++) {
      if (this.storeCacheInfoProvider.cacheOtherGoodsList[i].ac == true) { 
        goodsIds.push(this.storeCacheInfoProvider.cacheOtherGoodsList[i].goodsId)
      }
    }
    this.api.post(this.api.config.host.bl + 'v2/goodsList/addAgentGoods', goodsIds).subscribe(data => {
      if (data.success) {
        this.events.publish('otherGoodsList:refresh')
      }
      this.commonProvider.tostMsg({ msg: data.msg });
    });
    //删除添加成功的商品
    this.storeCacheInfoProvider.removeCacheOtherGoodsList();
    
  }

  delete() {
    this.storeCacheInfoProvider.removeCacheOtherGoodsList();
  }

  //全选
  updataCheckBoxAll() {
    this.storeCacheInfoProvider.updateCacheOtherGoodsList(this.storeCacheInfoProvider.checkBoxAll);
  }

}
