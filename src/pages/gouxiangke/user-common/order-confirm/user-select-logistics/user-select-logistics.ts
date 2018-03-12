import { CommonModel } from './../../../../../providers/CommonModel';
import { Api } from './../../../providers/api/api';
import { CommonProvider } from './../../../providers/common/common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
/**
 * Generated class for the UserSelectLogisticsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-select-logistics',
  templateUrl: 'user-select-logistics.html',
})
export class UserSelectLogisticsPage {
  //店铺信息
  store;
  //默认的自提点
  defaultNearbySelfTxt = '';
  defaultNearbySelf = {};
  // 自提点信息
  getLogisticsInfoData : any;

  selectLogisticsConfig = [
    {
      tabNav1: true,
      tabNav1_1: true,
      tabNavTxt: '物流配送',
      show:true
    },
    {
      tabNav1: false,
      tabNav1_1: true,
      tabNavTxt: '到店自提',
      show:false
    }
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams, public commonProvider: CommonProvider, public events: Events, public api: Api, public commonModel: CommonModel) {
    
    this.store = navParams.get('store')
    console.log(this.store);
    this.events.subscribe('nearbySelf', (data) => { 
      console.log(data)
      this.defaultNearbySelfTxt =data.pickName;
      this.defaultNearbySelf = data;
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSelectLogisticsPage');
  }

  //切换导航
  tabNav(boolean?, index?) {
    let leng = this.selectLogisticsConfig.length;
    if (!boolean) { 
      for (var i = 0; i < leng; i++) {
        this.selectLogisticsConfig[i].tabNav1 = false;
      }
      this.selectLogisticsConfig[index].tabNav1 = true;
    }
  }

  //选择自提点
  goToNearbySelf() {
    var data = [
      {
        title: '金城大厦站点1',
        address: '北京市东城区建国门金城建国5号',
        neardy: '600',
        default: true,
        id:1
      },
      {
        title: '金城大厦站点2',
        address: '北京市东城区建国门金城建国5号',
        neardy: '600',
        default: false,
        id:2
      },
      {
        title: '金城大厦站点3',
        address: '北京市东城区建国门金城建国5号',
        neardy: '600',
        default: false,
        id:3
      }
    ];
    this.navCtrl.push('UserNearbySelfPage', {dataList:this.getLogisticsInfoData.pickSelfList })
  }

  //确认
  //确认
  selectConfirm() { 
    let txt;
    let json;
    if (this.selectLogisticsConfig[0].tabNav1) {
      txt = '物流配送 - 送货上门';
      json = {
        txt: txt,
      }
    } else { 
      txt = '到店自提';
      json = {
        txt: txt,
        defaultNearbySelf:this.defaultNearbySelf
      }
    }
    
    this.events.publish('defaultSelectTxt:OrderGoodsListComponent', json);
    this.navCtrl.pop()
  }

  ionViewDidEnter() {
    console.log(this.commonModel.userDefaultAndSetAddres);
    this.getLogisticsInfo(this.commonModel.userDefaultAndSetAddres);
  }
  //获取物流信息
  getLogisticsInfo(address?) {
    let str;
    let goods = [];
    for (var i = 0; i < this.store.goods.length; i++) { 
      goods.push(this.store.goods[i].goodsId);
    }
    str = address.provinceName + address.cityName + address.districtName +  address.consignee
    this.api.get(this.api.config.host.org + 'pick/type/sort', {
      address: str,
      storeId: this.store.storeId,
      goodsIds:goods.join(',')
    }).subscribe(data => { 
      console.log(data); 
      // data.result ||
      this.getLogisticsInfoData = data.result;
      if (!this.defaultNearbySelfTxt) { 
        this.defaultNearbySelfTxt = this.getLogisticsInfoData.pickSelfList[0].pickName;
          this.defaultNearbySelf = this.getLogisticsInfoData.pickSelfList[0]
      }

      this.selectLogisticsConfig[1].show = this.getLogisticsInfoData.pickSelf
    })
  }

}
