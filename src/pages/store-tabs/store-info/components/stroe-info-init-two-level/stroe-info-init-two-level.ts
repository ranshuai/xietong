import { Component,Input,Output,EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StroeInfoInitTwoLevelPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-stroe-info-init-two-level',
  templateUrl: 'stroe-info-init-two-level.html',
})
export class StroeInfoInitTwoLevelPage {
  @Input() private data: any;
  @Output() private goaToLink = new EventEmitter<string>();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log(this.data);
    console.log('ionViewDidLoad StroeInfoInitTwoLevelPage');
  }
  goToLink(json) { 
    this.goaToLink.emit(json);
  }

}
