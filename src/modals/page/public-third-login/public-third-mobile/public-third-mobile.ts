import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MainCtrl } from '../../../../providers/MainCtrl';

/**
 * Generated class for the PublicThirdMobilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-third-mobile',
  templateUrl: 'public-third-mobile.html',
})
export class PublicThirdMobilePage {
  type;//判断是从哪个按钮点击进来了如果为1，隐藏密码选项
  source;
  showPassword = "password";
  pageData = {
    mobile: "",
    password: ""
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public mainCtrl: MainCtrl) {
    this.type = this.navParams.get('type');
    this.source = this.navParams.get('source');
  }

  //显示密码
  showPassWord() {
    this.showPassword = this.showPassword == 'password' ? 'text' : 'password';
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicThirdMobilePage');
  }

  //
  confirm() {
    if (this.pageData.mobile == '') {
      this.mainCtrl.nativeService.showToast('手机号必填');
      return;
    } else {
      if (this.pageData.mobile.match(/^1[3|4|5|8][0-9]\d{4,8}$/) == null || this.pageData.mobile.length < 11) {
        this.mainCtrl.nativeService.showToast("手机号码不正确,请重新输入");
        return;
      } else {
        //如果为2，需要判断密码
        if (this.type == 2) {
          if (this.pageData.password == '') {
            this.mainCtrl.nativeService.showToast('密码必填');
            return;
          } else {
            if (this.pageData.password.length < 6) {
              this.mainCtrl.nativeService.showToast('密码最少6位');
              return;
            }
          }
        }
        this.navCtrl.push('PublicThirdVerificationPage', { mobile: this.pageData.mobile, password: this.pageData.password, source: this.source,type:this.type });
      }
    }

  }
}
