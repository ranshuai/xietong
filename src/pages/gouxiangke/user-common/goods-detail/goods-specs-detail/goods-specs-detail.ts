import { CommonModel } from './../../../../../providers/CommonModel';
import { GlobalDataProvider } from '../../../providers/global-data/global-data.model';
import { Storage } from '@ionic/storage';
import { Config } from './../../../providers/api/config.model';
import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../../providers/api/api";
import {ShoppingCart} from "../../../providers/user/shopping-cart";
import {CommonProvider} from "../../../providers/common/common";
import { OrderNowBuyProvider } from "../../../providers/user/order-now-buy";
/**
 * Generated class for the GoodsSpecSelectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-goods-specs-detail',
  templateUrl: 'goods-specs-detail.html',
})
export class GoodsSpecsDetailPage {

  goods: any; //从参数中获取的goods，然后通过goodsId获取商品详情
  goodsInfo: any;
  shareId: any; //分享Id
  view: string; //通过view判断，是商品详情还是购物车打开的modal，他们的底部footer不同

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private api: Api,
              private shoppingCart: ShoppingCart,
              private common: CommonProvider,
              private orderBuyNow: OrderNowBuyProvider,
              public storage:Storage,
              public config: Config,
    public globalDataProvider: GlobalDataProvider,
              public commonModel:CommonModel
  ) {
    this.view = navParams.get('view');
    this.shareId = navParams.get('shareId'); //分享Id
    let goods = this.goods = navParams.get('goods');
    //获取商品详情
    this.api.get(this.api.config.host.bl + 'v2/goods/detail/' + goods.goodsId).subscribe(data => {
      if (data.success) {
        this.goodsInfo = data.result;
        this.goodsInfo.tpSpecGoodsPrice = this.goodsInfo.tpSpecGoodsPrices; //返回字段多了一个s，修正
        this.initTpSpecGoodsPrice(this.goodsInfo.tpSpecGoodsPrice, null, goods); //此处的goods兼容从购物车打开规格编辑
        this.initTpSpecs(this.goodsInfo.tpSpecs, goods);//此处的goods兼容从购物车打开规格编辑
      }
    });
  }

  //给规格价格信息赋值
  initTpSpecGoodsPrice(tpSpecGoodsPrice, image?, goods?) {
    if (this.view == 'shoppingCart') {//从购物车打开规格编辑
      this.shoppingCart.getSpecsInfo(goods.goodsId, goods.specKey.split('_').pop(), goods.specKey).subscribe(data => {
        let tpSpecGoodsPrice =  this.goodsInfo.tpSpecGoodsPrice = data.result.tpSpecGoodsPrice;
        tpSpecGoodsPrice.buyCount = tpSpecGoodsPrice.minBuyNum ||tpSpecGoodsPrice.buyCount || this.goods.goodsNum || 1;
        if (tpSpecGoodsPrice.storeCount == 0) {
          tpSpecGoodsPrice.buyCount = 0;
        }
        tpSpecGoodsPrice.goodsSpec = this.goods.specKey;
        if (image && image.src) { //点选规格，获取的信息可能有src
          tpSpecGoodsPrice.image = `url( ${image.src} )`;
        } else {
          //如果本身还没有image，就把首图赋值过去
          tpSpecGoodsPrice.image = tpSpecGoodsPrice.image || `url( ${this.goodsInfo.originalImg} )`;
        }
      });
    } else {
      //从商品详情打开规格编辑
      tpSpecGoodsPrice.buyCount = tpSpecGoodsPrice.minBuyNum || tpSpecGoodsPrice.buyCount || 1;
      if (tpSpecGoodsPrice.storeCount == 0) {
        tpSpecGoodsPrice.buyCount = 0;
      }
      if (image && image.src) { //点选规格，获取的信息可能有src
        tpSpecGoodsPrice.image = `url( ${image.src} )`;
      } else {
        //如果本身还没有image，就把首图赋值过去
        tpSpecGoodsPrice.image = tpSpecGoodsPrice.image || `url( ${this.goodsInfo.originalImg} )`;
      }
    }
  }

  //初始化规格列表信息
  initTpSpecs(tpSpecs, goods) {
    tpSpecs.forEach(item => {
      let items = item.items;
      let count;
      for (var i = 0; i < items.length; i++) {
        var element = items[i];
        // if (element.active || (goods.specKey && goods.specKey.split('_').pop() == element.id)) {
          if (element.flag) {
          //判断如果已经有选中的规格，直接跳出
          element.active = true;
          element.storeCount = count;
          return;
        }
      }
      //判断如果没有选中的规格，将第一个规格选中
      item.items[0].active = true;
    });
  }

  // chang(buyCount, storeCount) {

  //   console.log(buyCount.test(/\D|^[0]/g));
  //   if (buyCount.test(/\D|^[0]/g)) { 
  //     this.common.showToast('亲，只能输入整数！');
  //   }

  //   if (buyCount > storeCount) {
  //     this.common.showToast('亲，该宝贝不能购买更多哟！');
  //     this.goodsInfo.tpSpecGoodsPrice.buyCount = storeCount;
  //   }
  // }

  delNum() {
    if (this.goodsInfo.tpSpecGoodsPrice.buyCount <= (this.goodsInfo.tpSpecGoodsPrice.minBuyNum ||1)) {
      return;
    }
    this.goodsInfo.tpSpecGoodsPrice.buyCount--;
  }

  addNum() {
    if (this.goodsInfo.tpSpecGoodsPrice.buyCount >= this.goodsInfo.tpSpecGoodsPrice.storeCount) {
      return;
    }
    this.goodsInfo.tpSpecGoodsPrice.buyCount++;
  }

  changeSpecs(items, item) {
    //改变选中状态
    items.forEach(item => {
      item.active = false;
    });
    item.active = true;
    let goodsSpec = this.joinSpecsActived(); //所有specs拼接

    //获取规格价格
    this.shoppingCart.getSpecsInfo(this.goodsInfo.goodsId, item.id, goodsSpec).subscribe(data => {
      if (data.success) {
        let tpSpecGoodsPrice = this.goodsInfo.tpSpecGoodsPrice = data.result.tpSpecGoodsPrice;
        (tpSpecGoodsPrice as any).buyCount = tpSpecGoodsPrice.minBuyNum || 1;
        if (tpSpecGoodsPrice.storeCount == 0) {
          (tpSpecGoodsPrice as any).buyCount = 0;
        }
        tpSpecGoodsPrice.specKey = goodsSpec;
        this.initTpSpecGoodsPrice(tpSpecGoodsPrice, data.image, tpSpecGoodsPrice);
      }
    });
  }

  joinSpecsActived() {
    //将选中的规格，拼接起来
    let activedArr = [];
    this.goodsInfo.tpSpecs.forEach(specs => {
      specs.items.forEach(item => {
        if (item.active) {
          activedArr.push(item.id);
        }
      })
    });
    return activedArr.join('_');
  }

  joinSpecsActivedName() {
    //将选中的规格，拼接起来
    let activedArrName = [];
    this.goodsInfo.tpSpecs.forEach(specs => {
      specs.items.forEach(item => {
        if (item.active) {
          activedArrName.push(item.item);
        }
      })
    });
    return activedArrName;
  }

  //添加购物车
  addCart() {
    if (!this.commonModel.userId) { 
      this.viewCtrl.dismiss({page:'PublicLoginPage'});
      return 
    }
    if (!this.goodsInfo.tpSpecGoodsPrice.buyCount) { 
      this.common.showToast('仔细瞅瞅，数量为零~');
      return 
    }
    this.viewCtrl.dismiss();
    let data = {
      goodsId: this.goodsInfo.goodsId,
      goodsSpec: this.goodsInfo.tpSpecGoodsPrice.key_,
      goodsNum: this.goodsInfo.tpSpecGoodsPrice.buyCount,
      shareId:this.shareId
    };
    this.shoppingCart.add(data).subscribe(data => {
      if (data) {
        this.submitModal();
      }
    });
  }

  //在购物车详情中点击确定，直接执行
  submitModal() {
    let tpSpecGoodsPrice = this.goodsInfo.tpSpecGoodsPrice;
    tpSpecGoodsPrice.goodsSpec = this.joinSpecsActived();//兼容购物车中的规格编辑
    // tpSpecGoodsPrice.goodsSpec = this.goodsInfo.tpSpecGoodsPrice.key_;
    tpSpecGoodsPrice.cartId = this.goods.id;//兼容购物车中的规格编辑
    tpSpecGoodsPrice.selected=this.goods.selected;
    this.viewCtrl.dismiss(tpSpecGoodsPrice);
  }

  //关闭modal
  closeModal() {
    this.viewCtrl.dismiss();
  }

  nowBuy() {
    if (!this.goodsInfo.tpSpecGoodsPrice.buyCount) { 
      this.common.showToast('仔细瞅瞅，数量为零~');
      return 
    }
    if (this.config.PLATFORM == 'APP'||this.config.PLATFORM == 'STOREAPP') { 
      //是否有userId
      if (this.commonModel.userId) {
          let goodsInfo = this.goodsInfo;
          if (goodsInfo.tpSpecGoodsPrice.buyCount == 0) {
            this.common.showToast('仔细瞅瞅，数量为零~');
            return;
          }
          setTimeout(() => {
            // 拼接返回参数    大小:小 重量:轻   包装:0.5KG
            let list = this.joinSpecsActivedName();
            let nameStr = "";
            this.goodsInfo.tpSpecs.forEach((specs, index) => {
              nameStr = nameStr + specs.name + ":" + list[index] + " ";
            });
  
            let stores = [{
              nowBuy: true,
              storeId: goodsInfo.storeId,
              storeName: goodsInfo.tbCompanyInfo.companyAlias ||goodsInfo.tbCompanyInfo.companyName,
              goods: [{
                goodsId: goodsInfo.goodsId,
                goodsImg: goodsInfo.originalImg,
                goodsName: goodsInfo.goodsName,
                goodsPrice: goodsInfo.tpSpecGoodsPrice.price,
                goodsNum: goodsInfo.tpSpecGoodsPrice.buyCount,
                goodsSpecKey: goodsInfo.tpSpecGoodsPrice.key_,
                selected: true,
                specKeyName: nameStr
              }]
            }];
            this.orderBuyNow.setData(stores);
            this.viewCtrl.dismiss({page:'OrderConfirmPage',shareId: this.shareId});
          }, 500)
        
      } else { 
        this.viewCtrl.dismiss({page:'PublicLoginPage'});
      }
    }
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') { 
      let goodsInfo = this.goodsInfo;
      if (goodsInfo.tpSpecGoodsPrice.buyCount == 0) {
        this.common.showToast('仔细瞅瞅，数量为零~');
        return;
      }
  
      setTimeout(() => {
        // 拼接返回参数    大小:小 重量:轻   包装:0.5KG
        let list = this.joinSpecsActivedName();
        let nameStr = "";
        this.goodsInfo.tpSpecs.forEach((specs, index) => {
          nameStr = nameStr + specs.name + ":" + list[index] + " ";
        });
  
        let stores = [{
          nowBuy: true,
          storeId: goodsInfo.storeId,
          storeName:goodsInfo.tbCompanyInfo.companyAlias || goodsInfo.tbCompanyInfo.companyName,
          goods: [{
            goodsId: goodsInfo.goodsId,
            goodsImg: goodsInfo.originalImg,
            goodsName: goodsInfo.goodsName,
            goodsPrice: goodsInfo.tpSpecGoodsPrice.price,
            goodsNum: goodsInfo.tpSpecGoodsPrice.buyCount,
            goodsSpecKey: goodsInfo.tpSpecGoodsPrice.key_,
            selected: true,
            specKeyName: nameStr
          }]
        }];
        this.orderBuyNow.setData(stores);
        this.viewCtrl.dismiss({page:'OrderConfirmPage',shareId: this.shareId});
      }, 500)
  
    }
  }
  stopProp(event) {
    event.stopPropagation();
  }
}
