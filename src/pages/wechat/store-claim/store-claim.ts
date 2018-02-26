import { Config } from './../../gouxiangke/providers/api/config.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/Validators";
import { MainCtrl} from "../../../providers/MainCtrl";
/**
 * Generated class for the StoreClaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage({
    segment: 'store_claim'//change_role/store
  })
@Component({
  selector: 'page-store-claim',
  templateUrl: 'store-claim.html',
})
export class StoreClaimPage {
  storeClaimInterval = 60;
  timeInterval;
  stroeData;
  formFlag: boolean = false;
  //表单对象
  storeClaimForm: any;
  //表单输入对象
  storeClaimData = {
    mobile: '',
    mobileCode: '',
  };
  //表单验证错误信息
  storeClaimMessages = {
    'mobile': {
      'errorMsg': '',
      'required': '手机号必填',
      'phone': '手机号格式不正确'
    },
    'mobileCode': {
      'errorMsg': '',
      'required': '短信验证码必填',
    }

  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, public mainCtrl:MainCtrl,
    private formBuilder: FormBuilder, public toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.mainCtrl.httpService.config.clientType = '2';
    this.mainCtrl.httpService.config.space = '92E21DE17C0CE872';
    this.mainCtrl.httpService.config.storeId = null;
    this.storeClaimForm = this.formBuilder.group({
      mobile: [this.storeClaimData.mobile, [Validators.required, Validators.phone]],
      mobileCode: [this.storeClaimData.mobileCode, [Validators.required]],
    });
    this.storeClaimForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.storeClaimMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.storeClaimForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        this.formFlag = this.storeClaimForm.valid;
        Object.assign(this.storeClaimData, this.storeClaimForm.value);
      });
  }



  searchStore() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '加载中...'
    });
    loading.present();
    this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'v2/user/checkBindStroeByMobile', {
      mobile: this.storeClaimData.mobile,
    }).subscribe(data => {
      if (data.success) {
        this.stroeData = data.result;
      }

      let alert = this.alertCtrl.create({
        subTitle:data.msg,
        buttons: ['确认']
      });
      loading.dismiss();
      setTimeout(() => {
        alert.present();
       },300)
    });
  }


  getPhone() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '加载中...'
    });
    loading.present();
    if (this.stroeData) {
      this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'v2/user/sendMobileCode', {
        mobile: this.storeClaimData.mobile,
        checkCode: 'c1K@'
      }).subscribe(data => {
        if (data.success) {
          if (this.storeClaimInterval == 60) {
            clearInterval(this.timeInterval);
            this.timeInterval = setInterval(() => {
              if (this.storeClaimInterval != 0) {
                this.storeClaimInterval--;
              } else {
                this.storeClaimInterval = 60;
                clearInterval(this.timeInterval);
              }
            }, 1000);
          }
          loading.dismiss();
        } else {
          let alert = this.alertCtrl.create({
            subTitle:data.msg,
            buttons: ['确认']
          });
          loading.dismiss();
          setTimeout(() => {
            alert.present();
           },300)
        }
      });
    } else {
      let alert = this.alertCtrl.create({
        subTitle:'没有关联信息',
        buttons: ['确认']
      });
      loading.dismiss();
      setTimeout(() => {
        alert.present();
       },300)
    }
  }

  subCofirm() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '加载中...'
    });
    loading.present();
    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org+ 'v2/user/bindMobileToStore', {
      "orgId": this.stroeData.orgId, //组织id
      "userId": this.stroeData.userId,//原开店时的userId
      "mobileCode": this.storeClaimData.mobileCode, //手机验证码
      "mobile": this.storeClaimData.mobile, //手机号
      "openId":this.mainCtrl.httpService.config.openId, //微信openId
    }).subscribe(data => {
      loading.dismiss();
      let msg = data.msg;
      let alert = this.alertCtrl.create({
        subTitle:msg,
        buttons: ['确认']
      });
      loading.dismiss();
      setTimeout(() => {
        alert.present();
       },300)
    })
  }


}
