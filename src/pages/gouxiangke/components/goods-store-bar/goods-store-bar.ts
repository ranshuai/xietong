import { NavController } from 'ionic-angular';
import { HttpConfig } from './../../../../providers/HttpConfig';
import { Api } from './../../providers/api/api';
import { Component, Input } from '@angular/core';
import { CommonProvider } from '../../providers/common/common';
/**
 * Generated class for the GoodsStoreBarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-store-bar',
  templateUrl: 'goods-store-bar.html'
})
export class GoodsStoreBarComponent {

  @Input() data: any;
  @Input() noGoTo: Boolean; //不需要跳转，兼容店铺商品
  @Input() Join: Boolean; //显示加入按钮


  constructor(
    private common: CommonProvider,
    public api: Api,
    public httpConfig: HttpConfig,
    public navCtrl:NavController
  ) { }
  //跳转店铺主页
  goToStoreDetailPage() {
    if (this.noGoTo) return;
    this.navCtrl.push('StoreDetailPage', { store_id: this.data.tbCompanyInfo.companyInfoId })
  }
  //加入店铺
  joinCompany() {
    console.log(this.data)
    let url = 'v2/user/openStaffNew';

    this.api.post(this.api.config.host.org + url, { roleid: 3, belonCompanyid: this.data.tbCompanyInfo.companyId }).subscribe((data) => { 
      if (data.success) {
        this.common.showToast('申请成功，等待后台审核！');
      }else{ 
        this.common.showToast(data.msg);
      }
    })
  }
}
