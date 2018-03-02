import { MainCtrl } from './../../../../../providers/MainCtrl';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController,NavController } from "ionic-angular";
import { GoodsSpecsDetailPage } from "../../goods-detail/goods-specs-detail/goods-specs-detail";
import { ShoppingCart } from "../../../providers/user/shopping-cart";
import { CommonProvider } from './../../../providers/common/common';

/**
 * Generated class for the UserShoppingCartListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'user-shopping-cart-list',
  templateUrl: 'user-shopping-cart-list.html'
})
export class UserShoppingCartListComponent {

  @Input() data;
  @Input() view;
  @Output() clickCheckEmit = new EventEmitter();
  @Output() modifySpecsEmit = new EventEmitter();

  goodsSpecsDetailPage = GoodsSpecsDetailPage;
  constructor(
    private modalCtrl: ModalController,
    private shoppingCart: ShoppingCart,
    private common: CommonProvider,
    public mainCtrl: MainCtrl,
    public navCtrl:NavController
  ) { 

  }
  ngOnInit() {
    console.log(this.data);
    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  checkStore(store) {
    store[this.view] = !store[this.view];
    let modifyCartVOs = [];
    store.goods.forEach(goods => {
      //店铺全选与全取消
      goods[this.view] = store[this.view];
      //如果购物车里面有下架的和库存不足的商品就不添加到modifyCartVOs数组里面
      if (!goods.onSale || goods.storeCount == 0) {
        //商品已下架goods.onSale，
        //库存为 0 (goods.onSale && goods.storeCount == 0)
        goods[this.view] = false;
        //如果有库存不足或者商品下架
        store[this.view] = false;
      } else { 
        modifyCartVOs.push({
          cartId: goods.id,
          goodsNum: goods.goodsNum,
          goodsSpec: goods.specKey,
          check: store[this.view]
        });
      }


    });
    this.clickCheckEmit.emit();
    if (this.view == 'selected') {
      this.shoppingCart.modifyBatch(modifyCartVOs).subscribe();
    }
  }

  checkGoods(store, goods) {
    goods[this.view] = !goods[this.view];
    for (let i = 0; i < store.goods.length; i++) {
      let item = store.goods[i];
      //有未选中的商品
      if (!item[this.view]) {
        //店铺不全选
        store[this.view] = false;
        this.clickCheckEmit.emit();
        if (this.view == 'selected') {
          this.modifyRemoteShoppingCart(goods);
        }
        return;
      }
    }
    //店铺全选
    store[this.view] = true;
    this.clickCheckEmit.emit();
    if (this.view == 'selected') {
      this.modifyRemoteShoppingCart(goods);
    }
  }

  //修改服务器购物城
  modifyRemoteShoppingCart(goods) {
    this.shoppingCart.modify({
      cartId: goods.id,
      goodsNum: goods.goodsNum,
      goodsSpec: goods.specKey,
      check: goods[this.view]
    }, false).subscribe();
  }

  //打开规格编辑modal
  openSpecsModal(goods) {
    let specsModal = this.modalCtrl.create(this.goodsSpecsDetailPage, { goods: goods, view: 'shoppingCart' });
    specsModal.present({ animate: false });
    specsModal.onDidDismiss(tpSpecGoodsPrice => {
      if (tpSpecGoodsPrice) {
        this.modifySpecsEmit.emit(tpSpecGoodsPrice);
      }
    });
  }
  //打开商品详情
  goToGoodsDetail(item) {
    this.navCtrl.push('GoodsDetailPage', { goods_id: item.goodsId });
  }
  stopProp(event) {
    this.common.stopProp(event);
  }
}
