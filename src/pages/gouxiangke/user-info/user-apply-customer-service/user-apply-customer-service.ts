import { CommonProvider } from './../../providers/common/common';
import { ThirdPartyApiProvider } from './../../providers/third-party-api/third-party-api';
import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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

  //保存最大值
  maxValue: number;
  selfApplyservicesImgIndex : number; //上传图片的下表，可以更新图片
  selfApplyservicesImgUpdate: boolean;//是否更新图片

  imgArr = ["","http://snsall.oss-cn-qingdao.aliyuncs.com/DF4D69929FD7F405/user/75803/8652e654-89cf-4df5-a32f-30b02debc276.jpg","http://snsall.oss-cn-qingdao.aliyuncs.com/DF4D69929FD7F405/user/75803/8652e654-89cf-4df5-a32f-30b02debc276.jpg","http://snsall.oss-cn-qingdao.aliyuncs.com/DF4D69929FD7F405/user/75803/8652e654-89cf-4df5-a32f-30b02debc276.jpg"];
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public mainCtrl:MainCtrl,public thirdPartyApiProvider:ThirdPartyApiProvider,public commonProvider:CommonProvider) {
    //orderInfo.orderData 订单数据
    //orderInfo.status 订单状态 1.仅退款 2.退货退款 3.换货
    //接收订单信息
    this.orderInfo.orderData = navParams.get('orderData');
    this.orderInfo.status = navParams.get('status');
    this.maxValue = this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum;


  }

  ngAfterViewInit() { 
    console.log(this.orderInfo);
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

  //数量的加减
  editNum(type?) { 
    if (type == 'add') {
      if (this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum == this.maxValue) {
        return
      }
      this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum = this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum+1
    } else { 
      if (this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum == 1) {
        return 
       }
      this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum = this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum-1
    }


  }

   //图片选中上传
   fileChange(file) { 
    let index = this.selfApplyservicesImgIndex;
    this.thirdPartyApiProvider.uploadImage(file.target.files[0], 'user').subscribe(data => { 
      if (data) { 
        this.imgArr.push(data);
      }
    })
   }
  
  //添加评论图片
  addImg() {
    if (this.imgArr.length > 6) {
      this.commonProvider.showToast('最多上传6张');
      return;
     }
    (<HTMLInputElement>document.getElementById("commentImg")).value = null;
    document.getElementById("commentImg").click();
    console.log(this.imgArr);
    
  }

  deleteImg(index) { 
    this.commonProvider.comConfirm('确认删除如下图片吗？').subscribe(() => { 
      this.imgArr.splice(index,1)
    })
  }

}
