import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ShowBigImgPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-big-img',
  templateUrl: 'show-big-img.html',
})
export class ShowBigImgPage {
    imgUrl;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
    this.imgUrl=navParams.get("imgUrl");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowBigImgPage');
  }
    dismissImg(){
    this.viewCtrl.dismiss();
    }
}
