import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api";
import { DataFilterService } from "../../providers/data-filter/data-filter.servce";


/**
 * Generated class for the StoreInfoAptitudePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-info-aptitude',
  templateUrl: 'store-info-aptitude.html',
})
export class StoreInfoAptitudePage {

  data: any = [];
  companyId: any;


  constructor(
    public api: Api,
    public dataFilterService: DataFilterService,
    public navParams:NavParams
  ) {
    this.companyId = navParams.get('companyId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreInfoAptitudePage');

    this.init()
  }

  init() { 
    this.getStoreAptitudeData()
  }
  getStoreAptitudeData() { 
    let url = "/v2/check/queryStoreIntelligence";
    let params = {
      companyId: this.companyId
        }
    this.api.get(this.api.config.host.org + url, params).subscribe(data => { 
      if (data.success) {
        this.dataFilterService.filter('storeInfoAptitude', data).subscribe(data => { 
          this.data = data;
        })
       }
    })
  }

}
