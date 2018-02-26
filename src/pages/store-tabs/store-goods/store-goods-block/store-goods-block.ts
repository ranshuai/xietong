import { CommonModel } from './../../../../providers/CommonModel';
import { StoreCacheInfoProvider } from './../../providers/store-cache-info/store-cache-info';
import { LoadingController,Events } from 'ionic-angular';
import { Api } from './../../../gouxiangke/providers/api/api';
import { CommonProvider } from './../../../gouxiangke/providers/common/common';
import { ThirdPartyApiProvider } from './../../../gouxiangke/providers/third-party-api/third-party-api';
import { Config } from './../../../gouxiangke/providers/api/config.model';
import { GlobalDataProvider } from './../../../gouxiangke/providers/global-data/global-data.model';
import { Component, Input, EventEmitter, Output } from '@angular/core';

/**
 * Generated class for the StoreGoodsBlockComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-goods-block',
  templateUrl: 'store-goods-block.html'
})
export class StoreGoodsBlockComponent {
  navIndex;
  @Input() data;
  @Input() other;  //代售商品
  @Input() readyOtherEdit;// 代售商品添加和代售
  @Output() private saleStatus = new EventEmitter<any>();
  @Output() updateStoreCacheInfoEvent = new EventEmitter();
  constructor(public globalData:GlobalDataProvider,public config:Config,public thirdPartyApiProvider:ThirdPartyApiProvider,public commonProvider:CommonProvider,public api:Api,public loadingCtrl:LoadingController,public storeCacheInfoProvider:StoreCacheInfoProvider,public events:Events,public commonModel:CommonModel) { 
    this.navIndex = this.globalData && this.globalData.storeGoodsNavIndex;
  }
  ionViewDidEnter() {
   
  }
  ngOnChanges() { 

    console.log(this.data);
  }
  //上架
  upSale() { 
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content:'上架中，请稍后...'
    });
    loading.present();
    let url = 'v2/goods/v2editGoodsSort?goodsId=' + this.data.goodsId + '&isonSale=true&sort=1';
    this.api.post(this.api.config.host.bl + url).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        this.commonProvider.tostMsg({ msg: '上架成功' })
        this.saleStatus.emit();
      }
    });
  }
  //下架
  downSale() {
 let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content:'下架中，请稍后...'
    });
    loading.present();
    let url = 'v2/goods/v2editGoodsSort?goodsId=' + this.data.goodsId + '&isonSale=false&sort=1';
    this.api.post(this.api.config.host.bl + url).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        this.commonProvider.tostMsg({ msg: '下架成功' })
        this.saleStatus.emit();
      }
    });
  }
   //推广
  clickSpread(json?) { 

    if (this.config.PLATFORM == 'APP'|| this.config.PLATFORM == 'STOREAPP') {
      let _json =
        {
          content
            :
            "分享内容",
          iconurl
            : json.originalImg,
          title
            :
            json.goodsName,
          url
            :
            json.shareUrl+"/?shareId="+window.localStorage.getItem('userId')+"#/goods_detail/"+json.goodsId
        }
      this.thirdPartyApiProvider.share(_json).subscribe((data) => {
        if (data.code != -1) {
          this.commonProvider.showToast('分享成功~');
        }
      })
    }

    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') {
      let link ='http://' + window.localStorage.host+'/?shareId='+this.commonModel.userId+'#/goods_detail/'+json.goodsId;

      this.thirdPartyApiProvider.shareWx({ title: json.goodsName, link: link, imgUrl: json.originalImg, desc: json.goodsRemark })
      this.commonProvider.openChangeModal('InvestPersonTipPage', false).subscribe(data => {
        //微信分享
      });
    }
  }
  //添加代售商品 在前端操作把添加的商品缓存到变量中
  addOther(item) { 

    let goodsIds = [];
    goodsIds.push(item.goodsId);
    this.api.post(this.api.config.host.bl + 'v2/goodsList/addAgentGoods',goodsIds).subscribe(data => { 
      if (data.success) {
        this.commonProvider.showToast('添加代售成功', 1500);
        this.events.publish('otherGoodsList:refresh');
      }
    })
  }
  //更新checkbox的状态 把事件传递给父级
  updateStoreCacheInfo(data) { 
    console.log(data)
    this.storeCacheInfoProvider.updateCacheOtherGoodsList(data);
  }

    //取消代售
  cancelOther(data) {
      this.commonProvider.comConfirm('取消代售').subscribe(() => { 
        console.log('取消代售');
        let goodsIds = [];
        goodsIds.push(data.goodsId)
        this.api.post(this.api.config.host.bl + 'v2/goodsList/deleteAgentGoods',goodsIds).subscribe(data => { 
          if (data.success) {
            this.commonProvider.showToast(data.msg, 500);
            this.events.publish('refresh:storeGoodsList');
            
          } else { 
            this.commonProvider.showToast(data.msg, 500)
          }
        });
      }) 
  }
}
