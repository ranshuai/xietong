import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PublicSetPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-set-password',
  templateUrl: 'public-set-password.html',
})
export class PublicSetPasswordPage {
  userPaymentPwd;
  //数据是否加载完毕
  loading: boolean = false;

  //设置密码输入框对象
  showPassword = "password";
  resPassword = "password";
  constructor(public navCtrl: NavController, public navParams: NavParams, private mainCtrl:MainCtrl) {
  }
  pageData = {
    password: '',
  };

  showPassWord() {
    this.resPassword = this.resPassword == 'password' ? 'text' : 'password';
  }

    //检测用户是否设置过支付密码
    // checkPayPass() {
    //     this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + this.mainCtrl.httpService.config.version + 'user/paypwd/check').subscribe(data => {
    //       if (data.success) {
    //         this.userPaymentPwd = data.result;
    //         this.loading = true;
    //       } else {
    //         this.loading = false;
    //         this.mainCtrl.nativeService.showToast(data.msg)
    //       }
    //     })
    // }
  
    //设置支付密码
    paymentPwd(_num) {
      if(this.pageData.password.match(/^[0-9]+$/) == null){
        this.mainCtrl.nativeService.showToast("请输入数字");
      }else{
        let url;
        if (_num == 1) {
          url = 'user/paypwd/set?optType=' + _num + '&payPassword=' + this.pageData.password
        } else {
          url = 'v2/myinfo/updatePassword?pwdType=' + _num + '&pwd=' + this.pageData.password
        }
        this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org+this.mainCtrl.httpService.config.version + url).subscribe(data => {
          if (data.success) {
            this.mainCtrl.nativeService.showToast(data.msg);
            (this.mainCtrl.commonModel.userInfo as any).isPayPwd=1;
            this.navCtrl.pop();
          } else {
            this.mainCtrl.nativeService.showToast( data.msg)
          }
        })
      }
    }
    
  ionViewDidLoad() {
    // this.checkPayPass();
  }

}
