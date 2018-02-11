import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

/**
 * Generated class for the CirclePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-circle',
  templateUrl: 'circle.html',
})
export class CirclePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private events:Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CirclePage');
  }
}
