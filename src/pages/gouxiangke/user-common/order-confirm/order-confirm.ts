import { CommonModel } from './../../../../providers/CommonModel';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { ShoppingCart } from "../../providers/user/shopping-cart";
import { OrderCouponPage } from "./order-coupon/order-coupon";
import { GlobalDataProvider } from "../../providers/global-data/global-data.model";
import { OrderNowBuyProvider } from "../../providers/user/order-now-buy";
import { OrderGroupBuyProvider } from "../../providers/user/order-group-buy";
import { Api } from "../../providers/api/api";
import { CommonProvider } from "../../providers/common/common";
import { OrderCouponProvider } from "../../providers/user/order-coupon";
import { SelectAddressBarComponent } from "./select-address-bar/select-address-bar";
import { OrderAddressProvider } from "../../providers/user/order-address";
/**
 * Generated class for the OrderConfirmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-order-confirm',
  templateUrl: 'order-confirm.html',
})
export class OrderConfirmPage {

  @ViewChild(SelectAddressBarComponent) selectAddressBar: SelectAddressBarComponent;

  orderPayPage = 'OrderPayOldPage';
  orderCouponPage = OrderCouponPage;
  stores: any; //店铺包含有商品的列表
  total: any; //总价格
  goodsActivityVOS; //获取买赠的对象的查询条件
  saleInfo: string = '无可用'; // 优惠券描述文字
  initSaleInfo: string;
  acitivityType: any;
  couponIds: Array<number>; //在此页面重新进入的时候，需要重置orderCouopn的couponIds，所以此处需要存一下couponIds
  selectedCoupon: any = null;

  //店铺的长度
  dataLength;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private shoppingCart: ShoppingCart,
    private globalData: GlobalDataProvider,
    private orderNowBuy: OrderNowBuyProvider,
    private orderGroupBuy: OrderGroupBuyProvider,
    private api: Api,
    private common: CommonProvider,
    private orderCoupon: OrderCouponProvider,
    private orderAddress: OrderAddressProvider,
    public commonModel: CommonModel,
    public events:Events
  ) {
    this.commonModel.freightOrderGoods = 0; // 进入订单确认页面把运费设置为 0；
    console.log('进入订单确认页面');
    if (globalData.isNowBuy) { //立即购买，从参数获取订单
      this.stores = orderNowBuy.getData();
      let goods = this.stores[0].goods[0];
      this.total = goods.goodsNum * goods.goodsPrice;
    } else if (globalData.isGroupBuy) {//是否是拼团商品
      debugger;
      this.stores = orderGroupBuy.getData();
      let goods = this.stores[0].goods[0];
      this.total = Number(goods.goodsPrice)
    } else { //购物车下单，从参数获取
      let data = this.navParams.get('data');
      if (data) {
        this.stores = data.stores;
        this.total = Number(data.total);
      }
    }
    globalData.lockOrderBtn = false; //重置下单按钮的锁定
     //订阅事件
     this.events.subscribe('defaultSelectTxt:OrderGoodsListComponent', (json) => { 
      (this.stores[this.commonModel.pageOrderConfirm.selfIndex] as any).defaultSelectTxt = json.txt;
      if (globalData.isNowBuy) { //立即购买
        if (json.defaultNearbySelf && json.defaultNearbySelf.id) {
          this.commonModel.pageOrderConfirmSelfInfo = json;
        } else { 
          this.commonModel.pageOrderConfirmSelfInfo = {};
        }
      } else {  //购物车
        if (json.defaultNearbySelf && json.defaultNearbySelf.id) {
          (this.commonModel.pageOrderConfirmpick as any)[this.commonModel.pageOrderConfirm.selfkey + ''] = json.defaultNearbySelf;
        } else { 
          (this.commonModel.pageOrderConfirmpick as any)[this.commonModel.pageOrderConfirm.selfkey + ''] = {};
        }
      }
    })
  }

  getTotal() {
    if (this.globalData.isNowBuy) { //立即购买，
      let goods = this.stores[0].goods[0];
      return goods.goodsNum * goods.goodsPrice;
    } else { //购物车下单,从参数获取订单
      return this.navParams.get('data').total;
    }
  }

  ionViewDidLoad() {
    if (this.stores) {
      this.init();
    }
  }

  ionViewDidEnter() {
    this.selectAddressBar.getAddress();
    
    //判断如果是从地址选择页面过来的，就从缓存获取地址数据
    // if (this.common.lastPageIs('UserInfoAddressPage')) {
    //   this.selectAddressBar.addressInfo = this.orderAddress.data;
    // } else {
    //   this.selectAddressBar.getAddress();
    // }
    //<!-- 运费模版 没有发布隐藏 -->
    
    // this.test();
  }

  //订单确认初始化信息
  init() {
    this.orderCoupon.couponIds = null;
    this.goodsActivityVOS = []; //查询条件
    this.stores.forEach(store => {
      let hasBuy = false;
      let price = 0;
      store.goods.forEach(goods => {
        if (goods.selected) {
          hasBuy = true;
          let goodsPrice = goods.goodsPrice * goods.goodsNum;
          price += goodsPrice;
          this.goodsActivityVOS.push({
            goodsId: goods.goodsId,
            goodsNum: goods.goodsNum,
            goodsPrice: goodsPrice,
            giftVOS: null,
            giftActivityId: null,
            specKey:goods.specKey||goods.goodsSpecKey,
          });
        }
      });
      store.hasBuy = hasBuy;
      store.price = price;
    });
    //如果是拼团商品不显示优惠券和促销活动
    if (!this.globalData.isGroupBuy){ 
      this.getSaleInfo(this.goodsActivityVOS);
    }
  }

  createGoodsActivityVOS() {
    let list = [];
    let stores = JSON.parse(JSON.stringify(this.stores));
      stores.forEach(store => {
      store.goods.forEach(good => {
        let item = {
          goodsId: good.goodsId,
          goodsNum: good.goodsNum,
          goodsPrice: good.goodsPrice*good.goodsNum,
          specKey: good.goodsSpecKey||good.specKey,
          giftActivityId: '',
          giftVOS: []
        };
        if(good.gifts){
          good.gifts.forEach(gift => {
            if (gift.selected) {
              item.giftActivityId = gift.giftActivityId;
              item.giftVOS = gift.giftVOS;
            }
          });
          list.push(item);
        }
      });
    });
    return list;
  }

  //下单
  order() {
    let addressId;
    if (this.selectAddressBar.addressInfo) {
      addressId = this.selectAddressBar.addressInfo.addressId;
    }
    if (!addressId) {
      this.common.showToast('地址未选择');
      return;
    }
    if (this.globalData.isNowBuy) { //立即购买，下单
      let goods = this.stores[0].goods[0];
      let data: any = {
        goodsId: goods.goodsId,
        goodsSpecKey: goods.goodsSpecKey,
        goodsNum: goods.goodsNum,
        addressId: addressId,
        leaveMessage: {},
      };
      if (this.acitivityType == 2) { //有买赠
        data.goodsActivityVOS = this.createGoodsActivityVOS();
        data.acitivityType = 2;
      } else if (this.selectedCoupon) {
        let couponId = this.selectedCoupon.couponId;
        let worth = this.selectedCoupon.worth;
        data.couponId = couponId;
        data.worth = worth;
        data.acitivityType = 1;
      }
      data.leaveMessage[this.stores[0].storeId] = this.stores[0].leaveMessage;
      this.shoppingCart.nowBuy(data).subscribe(data => {
        // setTimeout(() => {
        //   console.log(data)
        //   this.navCtrl.push(this.orderPayPage, { order: data });
        // }, 1000)
        //storeIds 为了调用 支付方式查询 接口 需要的字段
        this.navCtrl.push(this.orderPayPage, { order: data,storeIds:this.stores[0].storeId });
      });
    } else if (this.globalData.isGroupBuy) {
      //拼团购买
      let goods = this.stores[0].goods[0];
      let data = {
        goodsId: goods.goodsId,
        goodsSpecKey: goods.goodsSpecKey,
        goodsNum: goods.goodsNum,
        addressId: addressId,
        leaveMessage: {},
        promisonId: goods.promisonId
      };
      data.leaveMessage[this.stores[0].storeId] = this.stores[0].leaveMessage;
      //和购物车代码保持一样的风格 把拼团生成订单的接口放在 shopping-cart 组件中
      this.shoppingCart.groupBuy(data).subscribe(data => {
        setTimeout(()=>{
          this.navCtrl.push(this.orderPayPage, { order: data,storeIds:this.stores[0].storeId });
        },1000)
      });

    } else { //购物车下单
      let storeIds=[];
      let cartIds = [];
      let leaveMessage = {};
      this.stores.forEach(store => {
        store.hasBuy && (leaveMessage[store.storeId] = store.leaveMessage);
        store.goods.forEach(goods => {
          if (goods.selected) {
            cartIds.push(goods.id);
            storeIds.push(store.storeId);
          }
        });
      });
      let data: any = { cartIds, leaveMessage, addressId };
      if (this.acitivityType == 2) { //有买赠
        data.goodsActivityVOS = this.createGoodsActivityVOS();
        data.acitivityType = 2;
      } else if (this.selectedCoupon) {
        data.couponId = this.selectedCoupon.couponId;
        data.worth = this.selectedCoupon.worth;
        data.acitivityType = 1;
      }
      this.shoppingCart.order(data).subscribe((data) => {
        setTimeout(()=>{
          this.navCtrl.push(this.orderPayPage, { order: data ,storeIds:storeIds.join(',')});
        },1000);
      });
    }
  }



 //查询订单确认页买赠及活动信息
  getSaleInfo(goodsActivityVOS) {
    this.api.post(this.api.config.host.bl + 'v2/activity/order', goodsActivityVOS).subscribe(data => {
      if (data.success && data.result) {//result为null时，表示没有优惠券
        data = data.result;
        if (data.coupon) {
          this.acitivityType = 1; //优惠券
          if (data.size) {
            this.saleInfo = `${data.size}张可用`;
            this.initSaleInfo = `${data.size}张可用`;
            this.couponIds = data.couponIds;
          } else {
            this.saleInfo = '无可用';
          }
        } else if (data.giftMap) {
          this.acitivityType = 2; //买赠
          // this.stores.gifts = data.giftMap;
          this.joinGift(data.giftMap);
        }
      }
    });
  }

  joinGift(giftMap) {
    this.stores.forEach(store => {
      store.goods.forEach(goods => {
        if (giftMap[goods.specKey||goods.goodsSpecKey]) {
          goods.gifts = giftMap[goods.specKey||goods.goodsSpecKey];
          goods.gifts[0].selected = true; //默认选中第一个
        }

      });
    });
  }

  //点选赠品
  selectGift(json) {
    json.goods.gifts.forEach(gift => {
        gift.selected = false;
    });
    json.giftOption.selected=true;
  }

  openOrderCouponModal() {
    this.common.openChangeModal(
      this.orderCouponPage,
      false,
      { couponIds: this.couponIds }
    ).subscribe(() => {
      let coupon = this.orderCoupon.getSelectedCoupon();
      if (coupon) {
        this.selectedCoupon = coupon;
        this.total = this.getTotal() - coupon.worth;
        this.total = this.total < 0 ? 0 : this.total;
        this.saleInfo = `-￥${coupon.worth}元`;
      } else {
        this.saleInfo = this.initSaleInfo;
        this.total = this.getTotal();
      }
    });
  }

  //
  test() { 

    debugger;
    if (!this.commonModel.userDefaultAndSetAddres.province) { //北京市市辖区石景山区cehsi1 
      this.api.get(this.api.config.host.bl + 'address/all').subscribe(data => {
        if (data.success && data.result.length > 0) {
          let list = data.result;
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.isDefault) {
              this.commonModel.userDefaultAndSetAddres = item;
              break;
            }
          }
          this.dataLength = this.stores.length;

          for (var i = 0; i < this.dataLength; i++) { 
             //获取运费
            let _i = i;
            this.api.post(this.api.config.host.bl + 'order/fare', {
              provinceId:this.commonModel.userDefaultAndSetAddres.province,
              goodsFreightList:this.stores[i].goods
            }).subscribe(data => { 
              if (data.success) {
                //保存运费  Nu
                this.commonModel.freightOrderGoods = this.commonModel.freightOrderGoods +data.result;
                console.log(this.commonModel.freightOrderGoods);
                // 对象里添加运费的字段
                this.stores[_i].freight = data.result;
                if (!this.stores[_i].defaultSelectTxt) {
                  this.stores[_i].defaultSelectTxt = '物流配送 - 送货上门';
                 }
                console.log(this.stores);
              }
            })
          }
        }
      });
    } else {
      this.dataLength = this.stores.length;
          for (var i = 0; i < this.dataLength; i++) { 
             //获取运费
            let _i = i;
            this.api.post(this.api.config.host.bl + 'order/fare', {
              provinceId:this.commonModel.userDefaultAndSetAddres.province,
              goodsFreightList:this.stores[i].goods
            }).subscribe(data => { 
              if (data.success) {
                //保存运费  Nu
                console.log(this.commonModel.freightOrderGoods);
                if (!this.stores[_i].defaultSelectTxt || this.stores[_i].defaultSelectTxt == "物流配送 - 送货上门") {
                  this.stores[_i].defaultSelectTxt = '物流配送 - 送货上门';
                } else { 
                  data.result = 0;
                }
                 // 对象里添加运费的字段
                this.stores[_i].freight = data.result;
                this.commonModel.freightOrderGoods = this.commonModel.freightOrderGoods +data.result;
                
                console.log(this.stores);
              }
            })
      }
    }
  
  }

}
