import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the OrderCouponProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OrderCouponProvider {

  public coupons: Array<any> = []; //从接口获取的优惠券列表详情
  public couponIds: Array<number>; //从接口获取的优惠券id列表

  constructor() { }

  isUpdate(couponIds) {
    //是否需要更新couponIds
    return !this.couponIds || couponIds.sort().toString() != this.couponIds.sort().toString();
  }

  getSelectedCoupon() {
    for (var i = 0; i < this.coupons.length; i++) {
      if (this.coupons[i].selected) {
        return this.coupons[i];
      }
    }
    return null;
  }

  selectItem(item, index) {
    if (item.selected) {
      item.selected = false;
    } else { 
      for (var i = 0; i < this.coupons.length; i++){
        this.coupons[i].selected = false;
      }
      this.coupons[index].selected = true;
      let selectedItem = this.coupons.find(item => item.selected);
    }
    
    
  }

}
