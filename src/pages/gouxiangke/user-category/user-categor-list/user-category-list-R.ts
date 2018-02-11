import { GoodsSpecsDetailPage } from './../../user-common/goods-detail/goods-specs-detail/goods-specs-detail';
import { UserSetMobilePage } from './../../user-info/user-set/user-set-mobile/user-set-mobile';
import { CommonModel } from './../../../../providers/CommonModel';
import { GlobalDataProvider } from './../../providers/global-data/global-data.model';
import { GoodsDetailPage } from './../../user-common/goods-detail/goods-detail';
import { Component, Input,ViewChild } from '@angular/core';
import { LoadingController,Content,ModalController } from "ionic-angular";
import { CommonProvider } from "../../providers/common/common";
import { RequestOptions, Headers } from '@angular/http';
import { Api } from '../../providers/api/api';
import { ShoppingCart } from "../../providers/user/shopping-cart";
import { Config } from '../../providers/api/config.model'

/**
 * Generated class for the UserTopicListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'user-category-list-R',
  templateUrl: 'user-category-list-R.html',
})
export class UserCategoryListRComponent {
  @Input() public data: any;
  @Input() public catId: any;
  @Input() public loadEnd: any;
  config = {
    pageNo: 1,
    row: 10
  } 
  @ViewChild(Content) content: Content;
  userSetMobilePage = UserSetMobilePage;
  constructor(public common: CommonProvider, public api: Api, public loadingCtrl: LoadingController, private shoppingCart: ShoppingCart,public configProviders:Config,public globalDataProvider:GlobalDataProvider,public commonModel:CommonModel,public modalController:ModalController) { 
  }
  ngOnChanges() {
    this.config.pageNo = 1;
      if (this.content) { 
      this.content.scrollTo(0, 0,0);
        
      }
      if ((this.data && this.data.length) >= 10) {
      this.loadEnd = false;
    } else { 
      this.loadEnd = true;
    }
  }
  goodsDetailPage = GoodsDetailPage;
  goodsSpecsDetailPage = GoodsSpecsDetailPage
  getList(json, refresher?) { 
    this.api.post(this.api.config.host.bl + 'v2/goods/queryGoodsList', json).subscribe(data => {
      if (data.success) {
        if (data.result.length < 10) {
          this.loadEnd = true;
        } else { 
          this.loadEnd = false;
        }
        if (json.pageNo == 1) {
          this.data = data.result;
        } else { 
          this.data = this.data.concat(data.result)
        }
      }
      refresher && refresher.complete();
    })
  }

  goToGoodsListPage(id){
  	console.log(id);
    this.common.goToPage('GoodsListPage', { catId:id});
  }

  refresh(refresher) { 
    this.config.pageNo = 1;
    this.getList({ cateId: this.catId,pageNo:1,rows:10 },refresher);
  }
  //下拉加载
  doInfinite(InfiniteScroll) {
    this.config.pageNo ++;
    this.getList({ cateId: this.catId,pageNo:this.config.pageNo,rows:10 },InfiniteScroll);
  }

  goToGoodsDetailPage(item) {
    let goodsId = item.goods_id || item.goodsId;
    console.log(goodsId);
    this.common.goToPage(this.goodsDetailPage, { goods_id:goodsId });
  }

  //添加购物车
  addCart(event, item) {
    if (this.configProviders.PLATFORM == 'STOREAPPWX') {
      if(!this.commonModel.TAB_INIT_USERINFO.mobile){
        this.common.count = true;
        this.common.openMobileModal().subscribe(()=>{
          this.common.goToPage(this.userSetMobilePage,{type:1});
        })
        return 
      }
    }
    if (this.configProviders.PLATFORM == 'STOREAPP') {
      if (!this.commonModel.userId) {
        this.common.goToPage('PublicLoginPage');
      }
    }
      //需求变动
      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        showBackdrop:false, //是否显示遮罩层
        content: '加载中...'
      });
      loading.present();
      //获取商品详情
      let goodsId = item.goods_id || item.goodsId;
      this.api.get(this.api.config.host.bl + 'v2/goods/detail/' + goodsId).subscribe(data => {
        if (data.success) {
          loading.dismiss();
          let goodsInfo = data.result;
          //弹窗
          let specsModal = this.modalController.create(
            this.goodsSpecsDetailPage,
            { goods: goodsInfo, view: 'goodsDetail' },
            { cssClass: 'specs-modal' }
          );
          specsModal.present();
          specsModal.onDidDismiss(() => { 

          });

          //添加购物车
          // this.shoppingCart.add({
          //   goodsId: goodsInfo.goodsId,
          //   goodsSpec: goodsInfo.tpSpecGoodsPrices.key_,
          //   goodsNum: 1,
          // }).subscribe(_ => {
          //   loading.dismiss();
          // });
        } else {
          loading.dismiss();
          this.common.showToast(data.msg||'连接异常');
        }
      });
      event.stopPropagation();
  }
}
