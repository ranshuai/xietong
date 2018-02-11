import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides } from 'ionic-angular';
import { MainCtrl } from "../../../providers/MainCtrl";
import {  MyApp} from "../../../app/app.component";
/**
 * Generated class for the GuidePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guide',
  templateUrl: 'guide.html',
})
export class GuidePage {
  @ViewChild(Slides) slides: Slides;
  app: any;
  imgList;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private mainCtrl: MainCtrl,
  private myApp:MyApp) {
    this.imgList = this.navParams.get('imgList');
    window.localStorage.setItem('guidePage', 'true');
  }

  slideChanged() {
    if (this.slides.getActiveIndex() == (this.imgList.length - 1)) { 
    setTimeout(() => {
      //跳转到首页
      this.mainCtrl.setRootPage(this.navParams.get('page'))
        setTimeout(() => { 
        this.myApp.downAPP();
        }, 800)
      },1000)
    }
  }

}
