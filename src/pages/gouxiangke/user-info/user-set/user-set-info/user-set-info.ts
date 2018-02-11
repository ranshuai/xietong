import { Component, Input , forwardRef, Inject} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { UserSetInfoSubPage } from '../../user-set/user-set-info-sub/user-set-info-sub'
import { Api } from '../../../providers/api/api';

/**
 * Generated class for the UserSetInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 
@Component({
  selector: 'page-user-set-info',
  templateUrl: 'user-set-info.html',
})
export class UserSetInfoPage {
  userSetInfoSubPage = UserSetInfoSubPage;
  pageData;
  constructor(public navCtrl: NavController, public navParams: NavParams, public common: CommonProvider, public api: Api) {
    
  }


 queryUserInfo() { 
   this.api.get(this.api.config.host.org + '/user/queryUserInfo').subscribe(data => { 
     if (data.success) {

       this.pageData = data.result;
       console.log( this.pageData )
     } else { 
       this.common.tostMsg({msg:data.msg})
     }
   })
 }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSetInfoPage');
  }

ionViewDidEnter() {
 this.queryUserInfo();
}


  goToPage() { 
    this.common.goToPage(this.userSetInfoSubPage, {user:this.pageData.user})
  }
    
  
}
