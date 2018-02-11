import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonProvider } from "../../providers/common/common";
/**
 * Generated class for the GxkPayPasswordModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gxk-pay-password-modal',
  templateUrl: 'gxk-pay-password-modal.html',
})
export class GxkPayPasswordModalPage {

  password = [];
  inputBox = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public commonProvider:CommonProvider) {
    console.log(this.navParams.get('orderSn'))
  }

  //点击密码框
  changInput(_index) { 
    if (this.password.length < 6) { 
      if (this.password.length + 1 == 6) { 
        this.inputBox.push("●");
        this.password.push(_index);
        let payPassWord = this.password.join("");
        this.commonProvider.closeModal({payPassWord:payPassWord});
      } else {
        this.inputBox.push("●");
        this.password.push(_index);
      }
    }
  }
  //点击退格
  delInput() { 
   console.log(this.password)
    if (this.password.length > 0) { 
      this.inputBox.pop();
      this.password.pop();
    }
  }



   //关闭窗口
  closeModal() {
    this.commonProvider.closeModal();
  }
}
