import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonProvider} from '../../../../providers/common/common';

/**
 * Generated class for the SexModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-sex-modal',
  templateUrl: 'sex-modal.html',
})
export class SexModalPage {
  state;
  
 constructor(public navCtrl: NavController, public navParams: NavParams, public common: CommonProvider) {
   if ([1, 2].indexOf(this.navParams.get('state'))>-1) { 
    this.state = this.navParams.get('state');
   } else {
     this.state=1
   }
  }
  //关闭窗口
  closeModal() { 
    this.common.closeModal();
  }
  

  setSex() { 
    this.common.closeModal({sex:this.state});
  }

}
