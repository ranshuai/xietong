import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { CommonData } from '../../../providers/user/commonData.model';
import { CommonProvider } from '../../../providers/common/common';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import {ThirdPartyApiProvider } from "../../../providers/third-party-api/third-party-api";

/**
 * Generated class for the UserInfoOrderApplyservicesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-order-applyservices',
  templateUrl: 'user-info-order-applyservices.html',
})
export class UserInfoOrderApplyservicesPage {
  selfApplyservicesImgIndex : number; //上传图片的下表，可以更新图片
  selfApplyservicesImgUpdate : boolean;//是否更新图片
  searchValue;
  pageData;
  userInfoOrderServicesPage = 'UserInfoOrderServicesPage';

 applyservicesForm: any;
  //设置密码输入框对象
 applyservicesData = {
    logisticsName: '',
    logisticsCode:''  
  };
  applyservicesMessages = {
    'logisticsName': {
      'errorMsg': '',
      'required': '物流名称是必填的',
    }, 'logisticsCode': {
      'errorMsg': '',
      'required': '物流单号是必填的',
    }
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public commonData: CommonData, public api: Api, public common: CommonProvider,private formBuilder: FormBuilder,public thirdPartyApi:ThirdPartyApiProvider) {
    //获取缓存文件中的数据
    this.initPageData();
  }


  initPageData() {
    this.commonData.user_info_order.img=[];
    this.commonData.user_info_order.content = '',//售后内容
    this.commonData.user_info_order.serviceType = '0';//0退货 1换货  
    this.pageData = this.commonData.user_info_order;
    this.initFormData();
  }


  initFormData() {
    this.applyservicesForm = this.formBuilder.group({
      logisticsName: [this.applyservicesData.logisticsName, [Validators.required,Validators.maxLength(12)]],
      logisticsCode: [this.applyservicesData.logisticsCode, [Validators.required,Validators.maxLength(18)]],
    
    });
    this.applyservicesForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.applyservicesMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.applyservicesForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        Object.assign(this.applyservicesData, this.applyservicesForm.value);
      });
  }

   //图片选中上传

  fileChange(file) { 
  this.thirdPartyApi.uploadImage(file.target.files[0], 'comment').subscribe(data => { 
    if (data) { 
      //是否更新
      if (this.selfApplyservicesImgUpdate) {
        this.pageData.img[this.selfApplyservicesImgIndex] = data;
      } else {
        this.pageData.img.push(data);
       }
      }
    })
  }
  //添加评论图片
  addImg(item, index?, b?) {
    if (b) {
      this.selfApplyservicesImgIndex = index;
      this.selfApplyservicesImgUpdate = b;
      (<HTMLInputElement>document.getElementById("applyservicesImg")).value = null;
      document.getElementById("applyservicesImg").click();
    } else { 
      this.selfApplyservicesImgUpdate = false;
      if (item.img.length < 5) { 
        (<HTMLInputElement>document.getElementById("applyservicesImg")).value = null;
        document.getElementById("applyservicesImg").click();
      }
    }
    console.log(item);
  }

  afterService_form_submit(item) {
    var json = {
      imgs: item.img,
      reason: item.content,
      orderId: this.pageData.orderId,
      shippingCode: this.applyservicesData.logisticsCode,
      shippingName: this.applyservicesData.logisticsName,
      type: parseInt(item.serviceType),
    };
    this.api.post(this.api.config.host.bl + 'order/apply/afterservice', json).subscribe(data => {
      if (data.success) {
        this.common.tostMsg({ msg: data.msg });
        this.navCtrl.push(this.userInfoOrderServicesPage)
        this.navCtrl.removeView(this.navCtrl.getViews()[this.navCtrl.getViews().length-1])
      } else {
        this.common.tostMsg({ msg: data.msg });
      }
    })
  }

  checkValue(data) {
    console.log(data.value)
  }
}
