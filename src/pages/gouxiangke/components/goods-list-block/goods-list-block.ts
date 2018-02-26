import { MainCtrl } from './../../../../providers/MainCtrl';
import { CommonModel } from './../../../../providers/CommonModel';
import { Config } from './../../providers/api/config.model';
import { CommonData } from './../../providers/user/commonData.model';
import { GoodsSpecsDetailPage } from './../../user-common/goods-detail/goods-specs-detail/goods-specs-detail';
import { GlobalDataProvider } from './../../providers/global-data/global-data.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Api } from '../../providers/api/api';
import { GoodsDetailGroupPage } from "../../user-common/goods-detail-group/goods-detail-group";
import { CommonProvider } from "../../providers/common/common";
import { ShoppingCart } from "../../providers/user/shopping-cart";
import { LoadingController,ModalController,NavController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { HttpConfig } from './../../../../providers/HttpConfig';
/**
 * Generated class for the GoodsListBlockComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-list-block',
  templateUrl: 'goods-list-block.html'
})
export class GoodsListBlockComponent {

  @Input() isGroup: any;
  @Input() data: any = [];
  @Input() colNum: Number = 2;
  @Input() imgSpace: any;

  //避免恶意加载更多
  lock: boolean = false;
  @Input() loadParams: {
    type: string, //请求方式
    url: string, //接口
    headers: any, 
    params: any,
    resultKey: string, // result ：【】 || result ：{}
    dataKey: string // 接收数据
  };
  @Input() noMore: Boolean; //不加载数据
  @Input() noMoreText: Boolean;
  @Input() hasMore: Boolean = true;
  @Output() complete = new EventEmitter();

  goodsDetailGroupPage = GoodsDetailGroupPage;
  goodsSpecsDetailPage = GoodsSpecsDetailPage;
  userSetMobilePage = 'UserSetMobilePage';
  page: number = 1;
  pageNo: number = 1
  rows: number = 10;
  // hasMore: Boolean = true;
  gxkNoMore: boolean = false;
  getTemplate;

  constructor(
    private api: Api,
    private common: CommonProvider,
    private loadingCtrl: LoadingController,
    private shoppingCart: ShoppingCart,
    public storage: Storage,
    public globalDataProvider: GlobalDataProvider,
    public modalController:ModalController,
    public commonData: CommonData,
    public config: Config,
    public commonModel:CommonModel,
    public httpConfig: HttpConfig,
    public mainCtrl: MainCtrl,
    private navController:NavController,
  ) { 
    this.getTemplate = window.localStorage.getItem('getTemplate');
    console.log(this.data);

    console.log(this.hasMore)
    
  }

  init(refresher?) {
    this.pageNo = 1;
    this.page = 1;
    this.loadMore(null, refresher);
  };

  loadMore(infiniteScroll, refresher) {

    if(this.httpConfig.clientType == '2'){
      if (this.noMore && (this.pageNo > 1 && this.page > 1)) { //不需要加载更多
        infiniteScroll && infiniteScroll.complete();
        refresher && refresher.complete();
        this.gxkNoMore = true;
        return;
      }
    }else{
      if (this.noMore && (this.pageNo >= 1 && this.page >= 1)) { //不需要加载更多
        this.gxkNoMore = true;
        infiniteScroll && infiniteScroll.complete();
        refresher && refresher.complete();
        return;
      }
    }

    this.gxkNoMore = false;
    
    let loadParams = this.loadParams;
    console.log(loadParams);
    let [options, params] = this.dealParams(loadParams);
    console.log([options, params] );
    this.launchApi(loadParams, params, options,infiniteScroll, refresher).subscribe(data => {
      this.lock = false; //解锁
      console.log(this.lock + '3');
      if (this.lock) { 
        infiniteScroll && infiniteScroll.complete();
        refresher && refresher.complete();
      }

      infiniteScroll && infiniteScroll.complete();
      refresher && refresher.complete();
      if (data.success) {
        console.log(data.result.length);
        if (data.result && data.result.length >= 0) {
          this.dealData(data.result, loadParams.resultKey, loadParams.dataKey);
        } else { 
          /**
           * 针对的是后台返回的是json对象{
           *  topic:'',
           * topicGoods:''
           * }
           */
          if (loadParams.resultKey) {
            data.result = data.result
          } else { 
            data.result = data.result.goods;
          }

          /**
           * dealData 方法处理数据
           */
          this.dealData(data.result, loadParams.resultKey, loadParams.dataKey);
        }
      }
    });
  }

  dealParams(loadParams) {
    let options = null;

    if (loadParams.headers) {
      let headers = Object.assign({
        pageNo: this.pageNo,
        page: this.page,
        rows: this.rows,
      }, loadParams.headers || {});

      options = new RequestOptions({
        headers: new Headers(headers)
      });
    }

    loadParams.params = loadParams.params || {};

    return [
      options,
      Object.assign({ pageNo: this.pageNo, page: this.page, rows: this.rows, }, loadParams.params)
    ];
  }

  launchApi(loadParams, params, options,infiniteScroll?, refresher?) {
    console.log(this.lock + '1');
    if (!this.lock) {
      this.lock = true; 
      console.log(this.lock + '2');
      if (loadParams.params && loadParams.params.catId) {
        return this.api.post(loadParams.url, params, options);
      } else if (loadParams.type == 'POST') {
        return this.api.post(loadParams.url, params, options);
      } else {
        return this.api.get(loadParams.url, params, options);
      }
    } else { 
      infiniteScroll && infiniteScroll.complete();
      refresher && refresher.complete();
      return
    }
  }

  dealData(data, resultKey, dataKey) {
    resultKey && (data = data[resultKey]);

    if (this.pageNo == 1 && this.page == 1 ) {
      this[dataKey] = data;
    } else {
      this[dataKey] = [...this[dataKey], ...data];
    }
    this.pageNo++;
    this.page++;

    if (data.length < this.rows) {
      this.hasMore = false;
    } else {
      this.hasMore = true;
    }

    //以下代码，兼容搜索页，需要自己展示内容为空的情况
    let isDataNull = true;
    if (data && data.length != 0 || (this.pageNo != 1 && this.page != 1)) {
      isDataNull = false;
    }
    window.localStorage.setItem('searchEnd','true')
    this.complete.emit(isDataNull);
  }

  goToGoodsDetail(item) {
    let goodsId = item.goods_id || item.goodsId ||item.id;
    if (this.isGroup) {
      this.globalDataProvider.isGroupBuy = true;
      this.globalDataProvider.isNowBuy = false;
      this.navController.push(this.goodsDetailGroupPage, { goods_id: goodsId });
    } else {
      this.globalDataProvider.isGroupBuy = false;
      this.globalDataProvider.isNowBuy = false;
      this.navController.push('GoodsDetailPage',{ goods_id: goodsId })
    }
    console.log(this.globalDataProvider.isGroupBuy);
  }

  //添加购物车
  addCart(event, item) {
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') {
      if(!this.commonModel.TAB_INIT_USERINFO.mobile){
        this.common.count = true;
        this.common.openMobileModal().subscribe(()=>{
          this.navController.push(this.userSetMobilePage,{type:1});
        })
        return 
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
      let goodsId = item.goods_id || item.goodsId ||item.id;
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
          specsModal.onDidDismiss((data) => { 
            console.log(data);
            if (data) { 
              this.navController.push(data.page);
            }
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

  filterKM(number) { 
    //后台返回的是数字。
    // 大于 1000米 显示 1KM
    // 小于1000米 显示 M
    if (number >= 1000) {
      return number / 1000 + 'KM';
    } else {
      return number+'M';
     }
  }
}
