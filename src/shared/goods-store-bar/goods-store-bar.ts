import { Component ,Input} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../providers/HttpService';
import { NativeService } from '../../providers/NativeService';
import { MainCtrl } from '../../providers/MainCtrl';

/**
 * Generated class for the GoodsStoreBarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'goods-store-bar',
  templateUrl: 'goods-store-bar.html',
})

export class GoodsStoreBarShared {

  @Input() data: any;
  @Input() noGoTo: Boolean; //不需要跳转，兼容店铺商品
  @Input() Join: Boolean; //显示加入按钮
  @Input() Address: Boolean; //显示单位地址

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpService: HttpService,
    private nativeService: NativeService,
    private mainCtrl:MainCtrl
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoodsStoreBarPage');
  }

  //跳转店铺主页
  goToStoreDetailPage() {
    if (this.noGoTo) return;
    this.navCtrl.push('StoreDetailPage', { store_id: this.data.tbCompanyInfo.companyInfoId });
  }
  //加入店铺
  joinCompany() {
    let url = 'v2/user/openStaffNew';
    this.httpService.post(this.httpService.config.host.org + url, { roleid: 3, belonCompanyid: this.data.tbCompanyInfo.companyId }).subscribe((data) => { 
      if (data.success) {
        this.nativeService.showToast('申请成功，等待后台审核！');
        setTimeout(() => {
          this.mainCtrl.setRootPage('TabMenuPage');
        }, 1000)
      }else{ 
        this.nativeService.showToast(data.msg);
      }
    })
  }

}
