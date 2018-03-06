import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

/**
 * Generated class for the UserApplyCustomerServicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-apply-customer-service',
  templateUrl: 'user-apply-customer-service.html',
})
export class UserApplyCustomerServicePage {

  orderInfo: any = {};
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController) {
    //orderInfo.orderData 订单数据
    //orderInfo.status 订单状态 1.仅退款 2.退货退款 3.换货
    //接收订单信息
    this.orderInfo.orderData = navParams.get('orderData');
    this.orderInfo.status = navParams.get('status');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserApplyCustomerServicePage');

    
  }
  //退款原因 
  goToReasonRadioList(status?) { 

    let json = {
      1: {
        'RadioList' :[
          '拍错/多拍/不想要','协商一致退款','缺货','未按约定时间发货','其他'
        ],
        'title':'退款原因'
      },
      2: {
        'RadioList' :[
          '未收到货','已收到货'
        ],
        'title':'货物状态'
      },
      3: {
        'RadioList' :[
          '拍错/多拍/不想要','商品质量有问题','版本/颜色等与商品描述不符','卖家发错货','其他'
        ],
        'title':'换货原因'
      }
    }

    let modalCtrl = this.modalCtrl.create('ReasonradioListPage', {RadioListInfo:json[status]} ,{ cssClass: 'self-modal'});
    modalCtrl.present();
    modalCtrl.onDidDismiss((data) => { 
      console.log(data);
    })
  }
}
