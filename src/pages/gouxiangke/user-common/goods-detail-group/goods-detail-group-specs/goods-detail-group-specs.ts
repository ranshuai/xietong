import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Api } from "../../../providers/api/api";
import { ShoppingCart } from "../../../providers/user/shopping-cart";
import { CommonProvider } from "../../../providers/common/common";
import { OrderGroupBuyProvider } from "../../../providers/user/order-group-buy";

/**
 * Generated class for the GoodsSpecSelectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @Component({
   selector: 'goods-detail-group-specs',
   templateUrl: 'goods-detail-group-specs.html',
 })
 export class GoodsSpecsDetailGroupPage {

   goods: any; //从参数中获取的goods，然后通过goodsId获取商品详情
   price:any;
   promisonId:any;
   goodsInfo: any;
   view: string; //通过view判断，是商品详情还是购物车打开的modal，他们的底部footer不同
   goodsSpec:any;
   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl: ViewController,
     private api: Api,
     private shoppingCart: ShoppingCart,
     private common: CommonProvider,
     private orderGroupBuyProvider: OrderGroupBuyProvider,
     ) {
     this.view = navParams.get('view');
     this.price = navParams.get('price');
     this.promisonId = navParams.get('promisonId');
     let goods = this.goods = navParams.get('goods');
     //获取商品详情
     this.api.get(this.api.config.host.bl + 'v2/goods/detail/' + goods.goodsId).subscribe(data => {
       if (data.success) {
         this.goodsInfo = data.result;
         this.goodsInfo.tpSpecGoodsPrice = this.goodsInfo.tpSpecGoodsPrices; //返回字段多了一个s，修正

         this.defultSele(this.goodsInfo.tpSpecGoodsPrice,this.goodsInfo.tpSpecs)
       }
     });
   }
   //默认选中
   defultSele(tpSpecGoodsPrice,tpSpecs){
     //获取选中space
     let spaceArr = tpSpecGoodsPrice.key_.split('_');

     for(var i=0;i<tpSpecs.length;i++){
       var spaceArrDefaulet = spaceArr[i];
       for(var j=0;j<tpSpecs[i].items.length;j++){
         if(tpSpecs[i].items[j].id == spaceArrDefaulet){
           tpSpecs[i].items[j].active = true;
         }else{
           tpSpecs[i].items[j].active = false;
         }
       }
     }
     this.goodsSpec = tpSpecGoodsPrice.key_;

   }

   //规格单选
   changeSpecs(items, item) {
     //改变选中状态
     items.forEach(item => {
       item.active = false;
     });
     item.active = true;
     this.goodsSpec = this.joinSpecsActived(); //所有specs拼接
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

   //关闭modal
   closeModal() {
     this.viewCtrl.dismiss();
   }
   //确认购买
   nowBuy() {
     console.log(this.goodsSpec)
     let groupBuyNow={
       goodsNum:"1",
       goodsSpecKey:this.goodsSpec,
       promisonId:this.promisonId,
     }
     this.api.get(this.api.config.host.bl+'order/group/prepare',groupBuyNow).subscribe(data=>{
       if(data.success){
         console.log(data);
         let goodsInfo = this.goodsInfo;
         let stores = [{
           groupBuy: true,
           storeId: goodsInfo.storeId,
           storeName: goodsInfo.tbCompanyInfo.companyAlias ||goodsInfo.tbCompanyInfo.companyName,
           goods: [{
             goodsId: goodsInfo.goodsId,
             goodsImg: goodsInfo.originalImg,
             goodsName: goodsInfo.goodsName,
             goodsPrice: data.result.total,
             goodsNum: 1,
             promisonId:this.promisonId,
             goodsSpecKey: goodsInfo.tpSpecGoodsPrice.key_,
             specKeyName:goodsInfo.tpSpecGoodsPrice.keyName,
             selected: true
           }]
         }];

         this.orderGroupBuyProvider.setData(stores);
         this.viewCtrl.dismiss();
         this.navCtrl.push('OrderConfirmPage')
       }else{
         this.common.tostMsg({msg:data.msg})
       }
     })

   }

   stopProp(event) {
     event.stopPropagation();
   }

 }
