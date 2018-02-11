import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../../gouxiangke/providers/api/api';
import { DataFilterService } from '../../providers/data-filter/data-filter.servce';

/**
 * Generated class for the StoreInfoScanPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-info-scan',
  templateUrl: 'store-info-scan.html',
})
export class StoreInfoScanPage {
  storeInfoScandata: any = {};
  companyId: any;
  constructor(public api: Api, public navParams: NavParams, public dataFilterService: DataFilterService) {
    this.companyId = this.navParams.get('companyId');
    console.log(this.companyId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreInfoScanPage');
    this.init();
  }

  init() { 
    this.getStoreInfoScan();
  }
  //orcode/getorcode
  getStoreInfoScan() {
    let url = 'orcode/getPopularizeOrcode?type=1'
    this.api.post(this.api.config.host.bl + url).subscribe(data => { 
      if (data.success) {
        console.log(data);
        this.dataFilterService.filter('storeInfoScan', data).subscribe(data => { 
          this.storeInfoScandata = data; 
        })
       }
    })
   }

}
