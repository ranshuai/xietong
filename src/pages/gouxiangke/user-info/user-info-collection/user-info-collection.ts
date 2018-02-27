import { HttpConfig } from './../../../../providers/HttpConfig';
import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,Content,IonicPage } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';

/**
 *
 * Generated class for the UserInfoCollectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-collection',
  templateUrl: 'user-info-collection.html',
})
  
export class UserInfoCollectionPage {
  //user/collect/goods/query?page=1&rows=10 获取用户收藏列表
  //user/collect/company/query?page=1&rows=10 获取用户收藏店铺列表
  // @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;


  //默认选中
  activeType = 'goods';
  //是否启用上拉
  isSrooll = false;
  //收藏列表
 orderList = {
  'goods': {
    page: 1,
    rows: 10,
    loadEnd: false,
    clist: undefined,
    scrollTop: 0
  },
  'shop': {
    page: 1,
    rows: 10,
    loadEnd: false,
    scrollTop: 0
  }
 };
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public common: CommonProvider,public httpConfig:HttpConfig) {
    
  }

    //获取收藏列表
    getCollection(refresher?) {
      let type = this.activeType;
     if (this.orderList[type].loadEnd) {
       refresher && refresher.complete();
       return false;
     }
     let url;
     if (type == 'goods') {
       url = 'user/collect/goods/query'
     } else if (type == 'shop') {
       url = 'user/collect/company/query'
     }
  
     this.api.get(this.api.config.host.org + url, {
       page: this.orderList[type].page,
       rows: this.orderList[type].rows,
     }).subscribe(data => {
       if (data.success) {
        var result;
        if (type == 'goods') {
         result = data.result.goods;
       } else if (type == 'shop') {
         result = data.result.tpCompanyVos;
       }
         if (result.length >= this.orderList[type].rows) {
           this.orderList[type].loadEnd = false;
         } else {
           this.orderList[type].loadEnd = true;
         }
         if (this.orderList[type].page == 1) {
           this.orderList[type].clist = undefined;
           this.orderList[type].clist =result;
         } else {
           this.orderList[type].clist = this.orderList[type].clist.concat(result);
         }
         this.orderList[type].page++;
         refresher && refresher.complete();
       } else {
         this.common.tostMsg({ msg: data.msg })
       }
     })
   }
 

   /**上拉加载 */
   doInfinite(InfiniteScroll) {
    this.getCollection(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.orderList[this.activeType].page = 1;
    this.orderList[this.activeType].loadEnd = false;
    this.getCollection(refresher);
  }


  changeNav(_type) {
    //记录滚动距离 
    (this.orderList[this.activeType] as any).scrollTop = this.content.getContentDimensions().scrollTop;
    if (_type != this.activeType) {
      this.activeType = _type;
      if (!(this.orderList[_type] as any).clist) {
        setTimeout(() => { 
          this.scrollToTop(this.orderList[_type].scrollTop);
          this.getCollection();
        }, 50);
      } else {
        this.scrollToTop(this.orderList[_type].scrollTop);
      }
    }
  }
  //滚动到指定位置
  scrollToTop(_number) {
    this.isSrooll = true;
    setTimeout(data => {
    this.content.scrollTo(0, _number,0);
    this.isSrooll = false;
    }, 50);
  }

    //当前页面数据重新初始化
    initAlertData() {
      let type = this.activeType;
      this.orderList[type].page = 1;
      this.orderList[type].loadEnd = false;
      this.orderList[type].isSrooll = 0;
      this.scrollToTop(this.orderList[type].isSrooll);
      this.getCollection();
    }
  //跳转商品详情
  goToGoodsDetail(item) {
    let goodsId = item.goods_id || item.goodsId;
    this.navCtrl.push('GoodsDetailPage', { goods_id: goodsId });
  }

     //页面初始化
     ionViewDidEnter() {
        this.initAlertData()
      }




}
