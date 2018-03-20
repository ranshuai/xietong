import { Api } from './../../providers/api/api';
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
  //提交信息
  submitInfo:any = {};
  //退款金额
  returnMoney: any;
  //退款说明
  buyerMarks: string;
  //退款换货的愿意
  returnReason: string;
  //货物的状态
  goodsStatus: number;

  imgArr = [""];
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public mainCtrl:MainCtrl,public thirdPartyApiProvider:ThirdPartyApiProvider,public commonProvider:CommonProvider,public api:Api) {
    //orderInfo.orderData 订单数据
    //orderInfo.status 订单状态 0.仅退款 1.退货退款 2.换货
    //接收订单信息
    this.orderInfo.orderData = navParams.get('orderData');
    this.orderInfo.status = navParams.get('status');
    this.maxValue = this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum;
    this.returnMoney = this.orderInfo.orderData.orderGoodsSimpleVOS[0].marketPrice * this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum;

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

      if (data.title == '货物状态') {
        if (data.selectedValue == '未收到货') {
          this.goodsStatus = 0;
        } else { 
          this.goodsStatus = 1;
        }
        this.submitInfo[data.title] = data.selectedValue;
        return 
       }
      this.submitInfo[data.title] = data.selectedValue;
      this.returnReason = data.selectedValue;
    })
  }

  //数量的加减
  editNum(type?) { 
    if (type == 'add') {
      if (this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum == this.maxValue) {

        return
      }
      this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum = this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum+1
      this.returnMoney = this.orderInfo.orderData.orderGoodsSimpleVOS[0].marketPrice * this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum;
    } else { 
      if (this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum == 1) {
        return 
       }
      this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum = this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum-1
      this.returnMoney = this.orderInfo.orderData.orderGoodsSimpleVOS[0].marketPrice * this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum;
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

  submit() { 
    let newArrImg = [];
    for(var i=1;i<this.imgArr.length;i++){
      newArrImg.push(this.imgArr[i]);
    }

    let json = { "orderId":this.orderInfo.orderData.orderId , "orderStatus": this.orderInfo.orderData.orderStatus, "returnType": this.orderInfo.status, "shippingStatus": this.orderInfo.orderData.shippingStatus, "payStatus": this.orderInfo.orderData.payStatus, "goodsId":this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsId, "goodsName":this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsName, "goodsSpecKey": this.orderInfo.orderData.orderGoodsSimpleVOS[0].specKey, "goodsNum": this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum, "returnMoney": this.returnMoney, "returnImgs": newArrImg, "returnReason": this.returnReason, "buyerMarks": this.buyerMarks, "goodsStatus": this.goodsStatus }
    

    this.api.post(this.api.config.host.bl + 'order/return/apply', json).subscribe((data) => { 
      if (data.success) {
        this.commonProvider.showToast(data.msg);
        this.navCtrl.getViews().forEach(data => {
          if (data.name == 'UserInfoOrderPage') {
            this.navCtrl.popTo(data);
          }
        })
      } else { 
        this.commonProvider.showToast(data.msg)
      }
    })
  }

  keyup(event?) {
    
    if (event.inputType == 'deleteContentBackward') {
      
      console.log(this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum);
      
      if (!this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum) 
        setTimeout(() => {
        this.orderInfo.orderData.orderGoodsSimpleVOS[0].goodsNum = 1;
        }, 10);
      }
  }
}
