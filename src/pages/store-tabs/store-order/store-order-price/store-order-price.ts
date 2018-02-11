import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,ToastController } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api";
/**
 * Generated class for the StoreOrderPricePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-order-price',
  templateUrl: 'store-order-price.html',
})
export class StoreOrderPricePage {
  data;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private api: Api,
    private toastCtrl:ToastController
  ) {
    console.log(this.navParams.data)
    this.queryOrderInfo();
  }

  queryOrderInfo() {
    let loading = this.loadingCtrl.create({
      showBackdrop: false, //是否显示遮罩层
      content: '加载中...'
    });
    loading.present();
    this.api.get(this.api.config.host.bl + 'admin/order/change/' + this.navParams.get('orderId')).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        data.result = data.result ? data.result : [];
        data.result.orderGoodsChangeVOS.forEach(item => {
          item.editPrice = this.toDecimal2(item.goodsPrice);
        });
        this.data = data.result;
        this.summaryList()
      }
    })
  }

  moneyChange(item) {
    if (item.editPrice == "") {
      item.editPrice = this.toDecimal2(item.originalPrice)
    }
    if (this.checkRate(item.editPrice)) {
      if (item.editPrice > item.originalPrice) {
        item.editPrice = this.toDecimal2(item.originalPrice)
      } else {
        if (item.editPrice <= 0) {
          item.editPrice = this.toDecimal2(item.originalPrice)
        } else { 
          item.editPrice = this.toDecimal2(item.editPrice)
        }
      }
    } else {
      item.editPrice = this.toDecimal2(item.originalPrice)
    }
    this.summaryList();
    return item.editPrice
  }


  keyup(event, goods) {
      if (event.keyCode == 13 || event.keyCode == 46) { 
        goods.editPrice=this.moneyChange(goods)
        event.target.value = this.toDecimal2(goods.editPrice)
      }
      if (event.keyCode < 48 || event.keyCode > 57) {
        event.target.value = this.toDecimal2(goods.originalPrice)
      } else { 
        goods.editPrice=this.moneyChange(goods)
        event.target.value = this.toDecimal2(goods.editPrice)
      }
    
   
  }

  checkRate(input) {
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ document.getElementById(input).va
    if (!re.test(input)) {
      return false;
    } else {
      return true;
    }
  }

  toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }

  summaryList() {
    var conunt = 0;//实付金额
    var goodsPrices = 0;//订单商品总价
    this.data.orderGoodsChangeVOS.forEach(item => {
      conunt = conunt + (item.editPrice * item.goodsNum);
      goodsPrices = goodsPrices + (item.goodsPrice* item.goodsNum);
    });
    this.data.goodsPrice = conunt-this.data.couponPrice+this.data.transportFee;
    this.data.disCount = goodsPrices - conunt;
  }

 

  submit() { 
    setTimeout(() => { 
      if (this.data.goodsPrice <= 0) {
        this.toastCtrl.create({
          message:'实付金额必须大于0',
          duration: 800,
          position: 'middle',
          showCloseButton: false
        }).present();
      } else { 
        let loading = this.loadingCtrl.create({
          showBackdrop:false, //是否显示遮罩层
          content: '加载中...'
        });
        loading.present();
        var changePriceVO = {
          orderId: this.data.orderId,//订单id
          transportFee: this.data.transportFee,//运费
          discountedPrice: this.data.disCount,//优惠金额
          updateTime:this.data.updateTime,//时间戳
          orderGoodsChangePriceVOList:[]
        };
        this.data.orderGoodsChangeVOS.forEach(item => {
          var orderGoods = {
            recId: item.recId,
            singlePrice:item.editPrice
          }
          changePriceVO.orderGoodsChangePriceVOList.push(orderGoods);
        });
        this.api.put(this.api.config.host.bl + 'admin/order/price', changePriceVO).subscribe(data => { 
          loading.dismiss();
          if (data.success) {
            this.toastCtrl.create({
              message: data.msg,
              duration: 800,
              position: 'middle',
              showCloseButton: false
            }).present().then(data => {
              this.navCtrl.pop();
            });
          } else { 
            this.toastCtrl.create({
              message: data.msg || '网络连接错误',
              duration: 800,
              position: 'middle',
              showCloseButton: false
            }).present();
          }
        })
      }
    }, 800)
  }


}
