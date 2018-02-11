import { OtherGoodsListPage } from './other-goods-list/other-goods-list';
import { Api } from './../../gouxiangke/providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController,ModalController } from 'ionic-angular';
import { StoreGoodsListComponent } from './store-goods-list/store-goods-list';
import { StoreAddGoodsPage } from "./store-add-goods/store-add-goods";
import { CommonProvider } from "../../gouxiangke/providers/common/common";
import { CommonData } from '../../gouxiangke/providers/user/commonData.model';

/**
 * Generated class for the StoreGoodsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-goods',
  templateUrl: 'store-goods.html',
})
export class StoreGoodsPage {

  @ViewChild(StoreGoodsListComponent) storeGoodsList: StoreGoodsListComponent;
  otherGoodsListPage = OtherGoodsListPage
  storeAddGoodsPage = StoreAddGoodsPage;
  navIndex: any = 1;
  sortOn: Boolean = false;
  orderBy: string = 'sales_sum';//sales_sum,comment_rank,is_on_sale,store_count

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public common: CommonProvider,
    public commonData: CommonData,
    public viewCtrl:ViewController,
    private loadingCtrl: LoadingController,
    public api: Api,
    public modalCtrl:ModalController
  ) {
    
  }

  ionViewDidLoad() {
    console.log(this.orderBy);
    console.log('ionViewDidLoad StoreGoodsPage');
     /**
     * 点击排序给document 添加点击事件
    */
    let aa = document.getElementsByTagName('page-store-goods')[0];
    aa.addEventListener('click', ()=> { 
      this.sortOn = false;
    });
  }
  ionViewWillleave() {
    this.sortOn = false;
  }
  ionViewDidLeave() { 
    console.log('ionViewDidLeave');
    this.sortOn = false;
  }

  openSort() {
    this.sortOn = !this.sortOn;
  }

  clickSort(type) {
    this.sortOn = false;
    this.orderBy = type;
    this.storeGoodsList.refresh(type);
  }

  search(value) {
     this.storeGoodsList.search(value);
  }

  goToAddPage() {

  //会员不能添加商品
        /**
         * 用户在后台设置了售价模式，前台数据没有即使更新
         * 在点击添加商品的时候触发点击事件
         */
        this.api.post(this.api.config.host.org + 'v2/check/queryModuleInfo').subscribe(data => {
          if (data.success) {
            data.result = data.result ? data.result : {};
            if (data.result.sellingMode == 1) {
              this.common.goToPage(this.storeAddGoodsPage);
            } else {
              this.common.comSellingMode(`<div class="com-selling-mode">由于您的店铺采用会员分级售价模式，请在电脑上发布您的商品信息，网址：
              <br/>
              <span>http://ws.snsall.com</span></div>`).subscribe((data) => { });
            }
          } else {
            this.common.tostMsg({ msg: data.msg })
          }
        });
      

    /**
     * 自建商品
     * 代售商品
    */

    // let addStoreGoodsModal = this.modalCtrl.create(
    //   'AddStoreGoodsPage',
    //   {},
    //   { cssClass: 'add_store_goods'}
    // );
    // addStoreGoodsModal.onDidDismiss(data => {
    //   if (data == 2) {
    //     //会员不能添加商品
    //     /**
    //      * 用户在后台设置了售价模式，前台数据没有即使更新
    //      * 在点击添加商品的时候触发点击事件
    //      */
    //     this.api.post(this.api.config.host.org + 'v2/check/queryModuleInfo').subscribe(data => {
    //       if (data.success) {
    //         data.result = data.result ? data.result : {};
    //         if (data.result.sellingMode == 1) {
    //           this.common.goToPage(this.storeAddGoodsPage);
    //         } else {
    //           this.common.comSellingMode(`<div class="com-selling-mode">由于您的店铺采用会员分级售价模式，请在电脑上发布您的商品信息，网址：
    //           <br/>
    //           <span>http://ws.snsall.com</span></div>`).subscribe((data) => { });
    //         }
    //       } else {
    //         this.common.tostMsg({ msg: data.msg })
    //       }
    //     });
    //   } else if (data == 1) {
    //     this.common.goToPage(this.otherGoodsListPage);
    //   } 
    // });
    // addStoreGoodsModal.present();
   
  }

  //点击导航
  tabNav(n) { 
    this.navIndex = n;
    this.storeGoodsList.getNavIndex(this.navIndex);
  }
 
}
