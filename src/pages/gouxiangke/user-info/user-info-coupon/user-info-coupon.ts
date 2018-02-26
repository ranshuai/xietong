import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,Content,IonicPage } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';
import { CommonData } from '../../providers/user/commonData.model';

/**
 * Generated class for the UserInfoCouponPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-coupon',
  templateUrl: 'user-info-coupon.html',
})
export class UserInfoCouponPage {
  @ViewChild(Content) content: Content;
   //默认选中
  activeType = 'UNUSED';
  //是否启用上拉
  isSrooll = false;
  //订单列表
  pageDataList = {
    'UNUSED': {
      page: 1,
      rows: 6,
      loadEnd: false,
      scrollTop: 0
    },
    'USED': {
      page: 1,
      rows: 6,
      loadEnd: false,
      scrollTop: 0
    },
    'EXPIRED': {
      page: 1,
      rows: 6,
      loadEnd: false,
      scrollTop: 0
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,public api: Api, public common: CommonProvider, public commondata: CommonData) {
    this.getCouponQuery();
  }

   //优惠卷查询
  getCouponQuery(refresher?) {
    if (this.pageDataList[this.activeType].loadEnd) {
      refresher && refresher.complete();
      return false;
    }
    this.api.get( this.api.config.host.bl+'/v2/activity/my/coupon', {
      status:this.activeType=='UNUSED'?0:(this.activeType=='USED'?1:2),
      page: this.pageDataList[this.activeType].page,
      rows: this.pageDataList[this.activeType].rows,
    }).subscribe(data => {
      if (data.success) {
        // result
        if (this.pageDataList[this.activeType].page == 1) {
          this.pageDataList[this.activeType].clist = data.result;
        } else {
          this.pageDataList[this.activeType].clist = this.pageDataList[this.activeType].clist.concat(data.result);
        }

        if (data.result.length >= this.pageDataList[this.activeType].rows) {
          this.pageDataList[this.activeType].loadEnd = false;
        } else {
          this.pageDataList[this.activeType].loadEnd = true;
        }
        this.pageDataList[this.activeType].page++;
        refresher && refresher.complete();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }

   /**上拉加载 */
  doInfinite(InfiniteScroll) {
    this.getCouponQuery(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.pageDataList[this.activeType].page = 1;
    this.pageDataList[this.activeType].loadEnd = false;
    this.getCouponQuery(refresher);
  }

  //导航切换
  changeNav(_type) {
    //记录滚动距离
    (this.pageDataList[this.activeType] as any).scrollTop = this.content.getContentDimensions().scrollTop;
    console.log((this.pageDataList[this.activeType] as any).scrollTop)
    if (_type != this.activeType) {
      this.activeType = _type;
      if (!(this.pageDataList[_type] as any).clist) {
        this.scrollToTop(this.pageDataList[_type].scrollTop);
        this.getCouponQuery();
      } else {
        this.scrollToTop(this.pageDataList[_type].scrollTop);
      }
    }
  }
  //滚动到指定位置
  scrollToTop(_number) {
    this.isSrooll = true;
    this.content.scrollTo(0, _number, 0);
    setTimeout(data => {
      this.isSrooll = false;
    }, 50);
  }


  //跳转到优惠券商品列表
  goGoodsList(item) {
      this.common.goToPage('GoodsListPage', { activityId: item.activityId ,selfStoreId:item.storeId}, { activityId: item.activityId });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoCouponPage');
  }

}
