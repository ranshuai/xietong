import { Component } from '@angular/core';
import { NativeService } from "../../../../providers/NativeService";
import { CommonModel } from "../../../../providers/CommonModel";
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomeQrcodeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'home-qrcode',
  templateUrl: 'home-qrcode.html'
})
export class HomeQrcodeComponent {

  text: string;

  constructor(
    private nativeService: NativeService,
    public commonModel: CommonModel,
    public navCtrl: NavController
  ) {
    console.log('Hello HomeQrcodeComponent Component');
    this.text = 'Hello World';
  }

  /**
   * 打开二维码
   */
  openQcScanner() { 
    this.nativeService.OpenBarcodeScanner().subscribe(data => {
      if (this.commonModel.userId) {
        if (data.text) { 
          if (data.text.indexOf('queryUserApply') > -1) {
            // this.queryIsenrol(data.text.split('/').pop())
          } else { 
           this.nativeService.showToast('请扫描正确活动二维码') 
          }
        } 
      } else {
        this.navCtrl.push('PublicLoginPage');
      }
    })
  }

}
