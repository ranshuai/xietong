import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,Events } from 'ionic-angular';

/**
 * Generated class for the GetServiceModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-get-service-modal',
  templateUrl: 'get-service-modal.html',
})
export class GetServiceModalPage {
  data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public events:Events) {
    this.data = navParams.get('data')
    console.log(this.data);
    this.events.subscribe('GetServiceModalPage:events', () => { 
      if (this.viewCtrl.isOverlay) {
        this.viewCtrl.dismiss();
       }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetServiceModalPage');
  }
  cancle() {
    this.viewCtrl.dismiss();
  }
}
