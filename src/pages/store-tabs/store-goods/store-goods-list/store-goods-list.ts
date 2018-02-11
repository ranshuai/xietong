import { GlobalDataProvider } from './../../../gouxiangke/providers/global-data/global-data.model';
import { Component, Input, ViewChild } from '@angular/core';
import { Content, LoadingController,Events} from "ionic-angular";
import { Api } from "../../../gouxiangke/providers/api/api";
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { CommonProvider } from "../../../gouxiangke/providers/common/common";
import { StoreGoodsDetailPage } from "../store-goods-detail/store-goods-detail";
/**
 * Generated class for the StoreGoodsListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-goods-list',
  templateUrl: 'store-goods-list.html'
})
export class StoreGoodsListComponent {

  @ViewChild(Content) content: Content;
  @Input() orderBy;
  @Input() other;
  @Input() otherGoodsList;
  @Input() otherGoodsListParams;


  storeGoodsDetailPage = StoreGoodsDetailPage;

  page: number = 1;
  pageNo: number = 1;

  rows: number = 10;
  hasMore: Boolean = true;
  searchValue: string;
  navIndex: any = 1;
  data: any;

  isLock:boolean=false;//防止键盘快速搜索查询
  constructor(
    private common: CommonProvider,
    private api: Api,
    private loadingCtrl: LoadingController,
    public globalData: GlobalDataProvider,
    public events:Events
  ) {
    this.globalData.storeGoodsNavIndex = this.navIndex;

    //订阅取消代售事件
    this.events.subscribe('refresh:storeGoodsList', (data) => { 
      this.refresh();
    })
  }
  ngOnChanges() { 
    console.log(this.otherGoodsListParams);
    this.page = this.pageNo = (this.otherGoodsListParams && this.otherGoodsListParams.params.pageNo) || 1;
    this.getData().subscribe();
  }



  getData() {
    return new Observable((observer: Subscriber<any>) => {
   if(!this.isLock){
    this.isLock=true;
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
     loading.present();
    
     if (this.other) {
       Object.assign(this.otherGoodsListParams.params, {pageNo:this.pageNo,rows:this.rows})
        this.api.post(this.api.config.host.bl + this.otherGoodsListParams.url, this.otherGoodsListParams.params).subscribe(data => { 
          if (data.success) {
            data = data.result;
            if (data.length < this.rows) {
              this.hasMore = false;
            } else {
              this.hasMore = true;
            }
            if (this.page == 1 || this.pageNo == 1) {
              this.data = data;
            } else {
              this.data = this.data.concat(data);
            }
            this.page++;
            this.pageNo++;
            observer.next(true);
          } else {
            this.common.showToast(data.msg || '网络错误，请稍后再试~');
            observer.next(false);
          }
        })
        loading.dismiss();
        this.isLock=false;
        return; 
      }
      this.api.post(this.api.config.host.bl + 'v2/goodsList/queryStoreGoodsList', {
        name: this.searchValue, //搜索词
        descORasc: 'desc', ///desc=降序asc=升序
        orderBy: this.orderBy, //排序
        rows: this.rows,
        pageNo: this.page,
        type: this.navIndex,//1=出售2=已售罄3=下架
      }).subscribe(data => {
        if (data.success) {
          data = data.result;
          if (data.length < this.rows) {
            this.hasMore = false;
          } else {
            this.hasMore = true;
          }
          if (this.page == 1) {
            this.data = data;
          } else {
            this.data = this.data.concat(data);
          }
          this.page++;
          observer.next(true);
          loading.dismiss();
        } else {
          this.common.showToast(data.msg || '网络错误，请稍后再试~');
          observer.next(false);
        }
        this.isLock=false;
      });
   }else{
    observer.next(false);
   }
  });
  }

  search(value) {
    this.searchValue = value;
    if (!this.other) { 
      this.refresh();
    }
  }

  getNavIndex(n) {
    this.navIndex = n;
    this.globalData.storeGoodsNavIndex = this.navIndex;
    this.refresh();
  }

   refresh(type?,refresher?) {
    console.log(refresher);
    if (!type) {

    } else { 
      this.orderBy = type;
    }

     this.page = 1;
     this.pageNo = 1; 
    this.getData().subscribe(_ => {
      refresher && refresher.complete();
      this.content.scrollToTop();
    });
  }

  loadMore(infiniteScroll) {
    this.getData().subscribe(_ => {
      infiniteScroll.complete();
    });
  }

  sort(type) {
    this.orderBy = type;
    this.page = 1;
    this.getData().subscribe();
  }

 
  ngAfterViewInit() {

  }

  openDetaiPage(goodsId, other) {
    console.log(other)
    this.common.goToPage(this.storeGoodsDetailPage, { goods_id: goodsId, other:other });
  }

}
