import { REQUEST_TIMEOUT } from './../../../providers/Constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { MainCtrl } from '../../../providers/MainCtrl';

/**
 * Generated class for the ConfirmCompanyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-company',
  templateUrl: 'confirm-company.html',
})
export class ConfirmCompanyPage {
  roleid = 3;
  company_name = decodeURIComponent(this.navParams.get('company_name'));//店铺名称
  company_id = this.navParams.get('company_id');//店铺id

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public mainCtrl: MainCtrl, private alertCtrl: AlertController
  ) {
  }

  ionViewDidEnter(){
     //检测用户是否绑定过或者实名认证
      this.detectIndividual();
  }

  //检测用户是否绑定过或者实名认证
  detectIndividual() {
    if (this.mainCtrl.httpService.config.platform == 'wx') {
      if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {
        this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false, 'popupAlert').subscribe(() => {
          setTimeout(() => {
            this.navCtrl.push('PublicUserSetMobilePage', { type: 1 });
          }, 500);
        })
      } else {
        let loading = this.loadingCtrl.create({
          content: '数据加载中。。。'
        })
        loading.present();
        //如果有userId 授权成功
        if (this.mainCtrl.commonModel.userId) {
          loading.dismiss();

          this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe(data => {
            //如果status = 10112 没有实名认证 
            data.result = data.result ? data.result : {};
            if (data.result && data.result.status == 10112) {
              this.mainCtrl.utils.comConfirm('需要实名认证之后,才能变身员工', 2, false, 'popupAlert').subscribe(data => {
                setTimeout(() => {
                  this.navCtrl.push('UserRealQueryPage', { scene: 2 });
                }, 500);
              })
              return false;
            } else {
              //保存用户的真实信息
              window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity))
            }
          })
        }
      }
    }
  }


  submit() {
    let alert;
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '数据加载中。。。'
    });
    loading.present();

    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + 'v2/user/inviteStaff/' + this.roleid + '?orgId=' + this.company_id, {
      "userId": this.mainCtrl.commonModel.userId, //用户ID
    }, { space: this.mainCtrl.httpService.config.space, userId: this.mainCtrl.commonModel.userId, storeId: this.company_id }).subscribe(data => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        subTitle: data.msg,
        buttons: ['确认']
      });
      setTimeout(() => {
        alert.present();
      }, 300)
    });

  }

  return() {
    this.mainCtrl.setRootPage('TabMenuPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmCompanyPage');
  }

}
