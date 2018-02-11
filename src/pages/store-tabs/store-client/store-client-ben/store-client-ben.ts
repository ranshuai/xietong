import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api"
import { CommonProvider}from "../../../gouxiangke/providers/common/common"

/**
 * Generated class for the StoreClientBenPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-client-ben',
  templateUrl: 'store-client-ben.html',
})
export class StoreClientBenPage {
  letterList: any = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  getStoreClinentData: any = {};
  constructor(public api: Api, public common: CommonProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreClientBenPage');

    this.api.get(this.api.config.host.bl + 'company/search/mail').subscribe(data =>  {
      if (data.success) {
        if (data.result&&data.result.status == 10106){ 
          this.common.tostMsg({ msg: data.msg })
          return 
        }
        this.getStoreClinentData = data.result ? data.result.mail : {};
        console.log(this.getStoreClinentData);

        
      } else { 
        this.common.tostMsg({msg:data.msg})
      }
    })
  }

  ngOnInit() { 
   
  }


}
