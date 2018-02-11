import { MainCtrl } from './../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators } from '../../../providers/Validators';


/**
 * Generated class for the UserRealQueryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-real-query',
  templateUrl: 'user-real-query.html',
})
export class UserRealQueryPage {
  scene;//认证场景 1=用户变身物流人，2=用户变身员工，3=用户变身招商合伙人，4=申请开店，5=申请开域，6=公司，7=营销人，8=专家 
  //上传图片
  uploadImageType: string;
  Form: any;
  //初始化表单数据
  FormData: any = {
    userId: this.mainCtrl.commonModel.userId,
    idCardName: '',
    idCard: '',
    bankCard: '',
    idCardFront: '',
    idCardReverse: '',
    idCardHandheld: ''
  }
  FormMsg: any = {
    idCardName: {
      required: '姓名是必填的',
      chinese: '姓名必须是中文',
      errorMsg: ''
    },
    idCard: {
      required: '身份证是必填的',
      errorMsg: ''
    },
    bankCard: {
      required: '银行卡是必填的',
      errorMsg: ''
    },
    idCardFront: {
      required: '身份证正面照片是必填的',
      errorMsg: ''
    },
    idCardReverse: {
      required: '身份证反面照片是必填的',
      errorMsg: ''
    },
    idCardHandheld: {
      required: '身份证手持照片是必填的',
      errorMsg: ''
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private mainCtrl: MainCtrl,
    private formBuilder: FormBuilder, private loadingCtrl: LoadingController

  ) {
    this.scene = navParams.get('scene');
    //创建表单元素
    this.Form = this.formBuilder.group({
      idCardName: [this.FormData.idCardName, [Validators.required, Validators.chinese]],
      idCard: [this.FormData.idCard, [Validators.required]],
      bankCard: [this.FormData.bankCard, [Validators.required]],
      idCardFront: [this.FormData.idCardFront, [Validators.required]],
      idCardReverse: [this.FormData.idCardReverse, [Validators.required]],
      idCardHandheld: [this.FormData.idCardHandheld, [Validators.required]]
    });

    //监听Form表单任何变化
    this.Form.valueChanges.subscribe(data => {
      let verifyMessages = this.FormMsg;
      for (let field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        let control = this.Form.get(field);
        if (control && control.dirty && !control.valid) {
          let message = verifyMessages[field];
          for (let key in control.errors) {
            message[key] && (verifyMessages[field].errorMsg += message[key] + ' ');
          }
        }
      }
      Object.assign(this.FormData, this.Form.value);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRealQueryPage');
  }

  //上传图片
  upload(type) {
    (<HTMLInputElement>document.getElementById("realquery")).value = null;
    document.getElementById("realquery").click();
    this.uploadImageType = type;
  }

  fileChange(event) {
    console.log('realquery进出此方法fileChange')
    this.mainCtrl.thirdPartyApi.uploadImage(event.target.files[0], 'company').subscribe(data => {
      if (data) {
        console.log('上传图片');
        console.log(data);
        switch (this.uploadImageType) {
          case 'idCardFront':
            this.FormData.idCardFront = data;
            this.Form.controls.idCardFront.reset(data);
            break;
          case 'idCardReverse':
            this.FormData.idCardReverse = data;
            this.Form.controls.idCardReverse.reset(data);
            break;
          case 'idCardHandheld':
            this.FormData.idCardHandheld = data;
            this.Form.controls.idCardHandheld.reset(data);
            break;
          case 'businessLicense':
            this.FormData.businessLicense = data;
            this.Form.controls.businessLicense.reset(data);
            break;
        }
      }
    });
  }
  submit() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop: false, //是否显示遮罩层
      content: '加载中...'
    });
    loading.present();
    //为了兼容pc后台管理在body中传入userId后期优化让后台删除
    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + 'user/real/sub', this.FormData, {
      scene: this.scene
    }).subscribe((data) => {
      loading.dismiss();
      if (data.success) {
        switch (data.result.status) {
          case 10113:
            this.mainCtrl.nativeService.showToast('实名认证成功')
            setTimeout((data) => {
              this.navCtrl.pop();
            }, 1000);
            return;
          case 203:
            this.mainCtrl.nativeService.showToast('银行卡号不正确')
            return;
          case 206:
            this.mainCtrl.nativeService.showToast('身份证号不正确')
            return;
          case 204:
            this.mainCtrl.nativeService.showToast('真实姓名包含特殊字符')
            return;
          case 210:
            this.mainCtrl.nativeService.showToast('没有信息')
            return;
          case 208:
            this.mainCtrl.nativeService.showToast('认证次数超过限制,请明天再试!')
            return;
          default:
            this.mainCtrl.nativeService.showToast('实名认证失败，请检查提交信息');
            return;
        }
      } else {
        this.mainCtrl.nativeService.showToast(data.msg)
      }
    })
  }

}
