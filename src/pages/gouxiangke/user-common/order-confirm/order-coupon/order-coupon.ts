import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from "../../../providers/common/common";
import { Api } from "../../../providers/api/api";
import { OrderCouponProvider } from "../../../providers/user/order-coupon";

/**
 * Generated class for the OrderCouponPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-coupon',
  templateUrl: 'order-coupon.html',
})
export class OrderCouponPage {

  // coupons: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private common: CommonProvider,
    private api: Api,
    private orderCoupon: OrderCouponProvider,
  ) {
    let couponIds = navParams.get('couponIds');
    if (couponIds && this.orderCoupon.isUpdate(couponIds)) {
      this.orderCoupon.couponIds = couponIds;
      this.getCoupons(couponIds);
    }
  }

  closeModal() {
    this.common.closeModal(null, false);
  }

  getCoupons(couponIds) {
    this.api.get(this.api.config.host.bl + '/v2/activity/coupon', {
      couponIds: couponIds.join(',')
    }).subscribe(data => {
      this.orderCoupon.coupons = data.result;
    });
  }

  useNow(item,i) {
    this.orderCoupon.selectItem(item,i);
    this.closeModal();
  }

}
