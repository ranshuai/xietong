import { Component } from '@angular/core';
import { NavController, NavParams,ModalController,LoadingController,ToastController,Events } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api";

/**
 * Generated class for the StoreOrderCancelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-order-cancel',
  templateUrl: 'store-order-cancel.html',
})
export class StoreOrderCancelPage {
  data;
  pageData={
    type:'请选择取消订单的原因',
    content:'',
    msgType:''
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private modalCtrl: ModalController,
    private api: Api,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private events:Events) {
    this.data = this.navParams.data;
    console.log(this.data)
  }



  openSexSelectModal() {
    var modal=this.modalCtrl.create('SexSelectModal',{
      list:["本店不支持货到付款","卖家要求取消订单","商品库存不足","其他原因"]
  });
    modal.present({ animate: true});
    modal.onDidDismiss(data => {
      if(data){
        switch (data.item){
            case '本店不支持货到付款' :
                this.pageData.msgType='1'
                this.pageData.type='本店不支持货到付款'
                break;
            case '卖家要求取消订单' :
                this.pageData.msgType='2'
                this.pageData.type='卖家要求取消订单'
                break;
            case '商品库存不足' :
                this.pageData.msgType='3'
                this.pageData.type='商品库存不足'
                break;
            case '其他原因' :
                this.pageData.msgType='4'
                this.pageData.type='其他原因'
                break;
        }
    }
    });
}



  submit() {
    let loading = this.loadingCtrl.create({
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    loading.present();
    this.api.delete(this.api.config.host.bl + 'order/cancel/' + this.data.orderId, {
      cancelReason:this.pageData.msgType,
      timestamp: this.data.updateTime,
      otherCancelReason:this.pageData.msgType=='4'?this.pageData.content:''
    }).subscribe(data => { 
      loading.dismiss();
      if (data.success) {
        this.toastCtrl.create({
          message: data.msg,
          duration: 800,
          position: 'middle',
          showCloseButton: false
        }).present().then(data => {
          this.events.publish('store-order-cancel:success', {orderId:this.data.orderId});
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
}
