import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api"
import { DataFilterService } from "../../providers/data-filter/data-filter.servce"



/**
 * Generated class for the StoreInfoBasePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-info-base',
  templateUrl: 'store-info-base.html',
})
export class StoreInfoBasePage {
  getBaseDataList: any;
  companyId: any;
  
  constructor(public api: Api, public dataFilterService: DataFilterService,public navParams:NavParams) {
    this.companyId = navParams.get('companyId');
  }

  ionViewDidLoad() {
    console.log(this.companyId );
    console.log('ionViewDidLoad StoreInfoBasePage');
    let url = "v2/check/queryStoreBaseInfo";
    this.api.get(this.api.config.host.org + url, {companyId:this.companyId}).subscribe(data => { 
      if (data.success) {
        this.dataFilterService.filter('storeInfoBase', data).subscribe(data => { 
          this.getBaseDataList = data
        })
      }
    })
  }

}
