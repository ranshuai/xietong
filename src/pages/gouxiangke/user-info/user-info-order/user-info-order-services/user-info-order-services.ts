import { MainCtrl } from './../../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';

import { CommonProvider } from '../../../providers/common/common';
import { CommonData } from '../../../providers/user/commonData.model';
import { OrderAlertModalPage } from './../user-info-order-modal/order-alert-modal/order-alert-modal';
import { OrderWholesalePage } from './../order-wholesale/order-wholesale';
/**
 * Generated class for the UserInfoOrderServicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-order-services',
  templateUrl: 'user-info-order-services.html',
})
export class UserInfoOrderServicesPage {
  PageData = {
    page: 1,
    rows: 10,
    loadEnd: false
  }
  orderAlertModalPage = OrderAlertModalPage;
  orderLogisticsInfoPage = 'OrderLogisticsInfoPage'; //物流订单
  userInfoOrderSharePage = 'UserInfoOrderSharePage'; //圈子
    userInfoOrderDetailPage = 'UserInfoOrderDetailPage'; //详情
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public common: CommonProvider, public commondata: CommonData,public mainCtrl:MainCtrl) {
    this.queryOorderAftersale();
  }

  //查询售后列表
  queryOorderAftersale(refresher?) {
    if (this.PageData.loadEnd) {
      refresher && refresher.complete();
      return false;
    }
    this.api.get(this.api.config.host.bl + 'v2/order/query', {
      type:'aftersale',
      page: this.PageData.page,
      rows: this.PageData.rows,
    }).subscribe(data => {
      if (data.success) {
        // result
        if (this.PageData.page == 1) {
          (this.PageData as any).clist = data.result;
        } else {
          (this.PageData as any).clist = (this.PageData as any).clist.concat(data.result);
        }
        if (data.result.length >= this.PageData.rows) {
          this.PageData.loadEnd = false;
        } else {
          this.PageData.loadEnd = true;
        }
        this.PageData.page++;
        refresher && refresher.complete();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }

  /**上拉加载 */
  doInfinite(InfiniteScroll) {
    this.queryOorderAftersale(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.PageData.page = 1;
    this.PageData.loadEnd = false;
    this.queryOorderAftersale(refresher);
  }

  //确认收货
  confirm_receiptPopup(_item) {
    this.commondata.user_info_order = _item;
    this.common.openChangeModal(this.orderAlertModalPage, false, { state: 4 }).subscribe(data => {
      if (data) {
        if ((data as any).success) {
          this.common.tostMsg({ msg: (data as any).msg })
          this.refresh();
        } else {
          this.common.tostMsg({ msg: (data as any).msg })
        }
      }
    });
  }

  //查看物流
  openChangeModal(item) {
    this.common.openChangeModal(this.orderLogisticsInfoPage, false, { orderId: item.orderId }).subscribe();
  }

  goToPage(_url, _item) {
    this.commondata.user_info_order = _item;
    let url;
    if (_url == '分享圈子') {
      url = this.userInfoOrderSharePage;
    }else if (_url == '详情') {
      url = this.userInfoOrderDetailPage;
    } 
    this.navCtrl.push(url)
  }

  //删除订单
  deleteOrderPop(_item) {
  this.common.openChangeModal(this.orderAlertModalPage, false, { state: 5 }).subscribe(data => { 
         if (data) {
          if ((data as any).success) {
           this.common.tostMsg({ msg: (data as any).msg })
          this.refresh();
          } else {
            this.common.tostMsg({ msg: (data as any).msg })
          }
        }
    });    
  }

  //售后详情
  goToCustomerServeDetail(orderInfo?) { 

    this.navCtrl.push('CustomerServeDetailPage', {orderInfo:orderInfo});
    

  }


}
