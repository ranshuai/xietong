import { CommonModel } from './../../../../providers/CommonModel';
import { CommonData } from './../../../gouxiangke/providers/user/commonData.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators } from "../../../gouxiangke/providers/api/Validators";
import { FormBuilder } from '@angular/forms';
import { ThirdPartyApiProvider } from "../../../gouxiangke/providers/third-party-api/third-party-api";
import * as IosSelect from 'iosselect';
import { AddressCityData } from '../../../gouxiangke/providers/user/address-cityData';
import { CommonProvider } from "../../../gouxiangke/providers/common/common";
import { Api } from "../../../gouxiangke/providers/api/api";

/**
 * Generated class for the StoreSendGoodsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-send-goods',
  templateUrl: 'store-send-goods.html',
})
export class StoreSendGoodsPage {

  order: any;
  deliveryList: any; //用来存放物流公司里列表

  sendGoodsForm: any;

  sendGoodsData = {
    orderId: null,  //订单号
    shippingType: '商家自送',  //配送方式的文字展现
    price: null,  //众包配送费用
    shippingName: null,  //快递公司名称
    nodeCity: null,  //地址选择的文字展现
    nodeAddress: null,  //详细地址
    name: null,  //站点联系人
    telephone: null,  //站点联系人电话
    thirdLogisticsNo: null,  //配送单号
    useful: '否', //是否常用地址的文字展现
  };

  sendGoodsMsg = {
    shippingPrice: {
      required: '众包配送价格必填的',
    },
    consigneeName: {
      required: '法人姓名是必填的',
    },
    consigneeZipcode: {
      required: '法人身份证是必填的',
    },
    consigneeMoile: {
      required: '法人手机号是必填的',
      phone: '法人手机号格式不正确'
    },
    consigneeAddress: {
      required: '负责人手机号是必填的',
      phone: '负责人手机号格式不正确'
    },
    city: {
      required: '店铺地址县是必填的'
    },
    address: {
      required: '店铺详细地址是必填的'
    }
  };

  shippingTypeMap: any = [{
    id: 'self',
    value: '商家自送',
    selected: true
    }, {
    id: 'thirdparty',
    value: '外包配送(快递物流)'
    // }, {
    //   id: 'publog_third',
    //   value: '众包+外包配送'
  },{
    id: 'carSelf',
    value: '商家自送(有车)'
}];

  usefulMap: any = [{
    id: 0,
    value: '否',
    selected: true
  }, {
    id: 1,
    value: '是',
  }];

  address = {
    province: null,
    city: null,
    district: null
  };

  shippingCode: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private thirdPartyApi: ThirdPartyApiProvider,
    public cityData: AddressCityData,
    private common: CommonProvider,
    private api: Api,
    public commonData: CommonData,
    public commonModel:CommonModel
  ) {
    this.order = navParams.get('order');
    this.sendGoodsData.orderId = this.order.orderId;

    this.sendGoodsForm = this.formBuilder.group({
      shippingType: [this.sendGoodsData.shippingType, [Validators.required]],
    });
    this.sendGoodsForm.valueChanges.subscribe(data => {
      let verifyMessages = this.sendGoodsMsg;
      for (let field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        let control = this.sendGoodsForm.get(field);
        if (control && control.dirty && !control.valid) {
          let message = verifyMessages[field];
          for (let key in control.errors) {
            message[key] && (verifyMessages[field].errorMsg += message[key] + ' ');
          }
        }
      }
      Object.assign(this.sendGoodsData, this.sendGoodsForm.value);
    });

    this.api.get(this.api.config.host.bl + 'admin/order/delivery').subscribe(data => {
      if (data.success) {
        data.result.forEach(item => {
          item.id = item.cCode;
          item.value = item.cName;
        });
        this.deliveryList = data.result;
      } else {
        this.common.showToast('获取快递公司列表错误，请稍后再尝试发货~');
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreSendGoodsPage');
  }

  close() {
    this.viewCtrl.dismiss(null, null, { animate: false });
  }

  initForm(type) {
    if (type == 'thirdparty') {
      this.sendGoodsForm = this.formBuilder.group({
        shippingType: [this.sendGoodsData.shippingType, [Validators.required]],
        shippingName: [this.sendGoodsData.shippingName, [Validators.required]],
        // name: [this.sendGoodsData.name, [Validators.required]],
        // telephone: [this.sendGoodsData.telephone, [Validators.required]],
        // nodeCity: [this.sendGoodsData.nodeCity, [Validators.required]],
        // nodeAddress: [this.sendGoodsData.nodeAddress, [Validators.required]],
        thirdLogisticsNo: [this.sendGoodsData.thirdLogisticsNo, [Validators.required]],
        // useful: [this.sendGoodsData.useful, [Validators.required]],
      });
    } else {
      this.sendGoodsForm = this.formBuilder.group({
        shippingType: [this.sendGoodsData.shippingType, [Validators.required]],
      });
    }

    this.sendGoodsForm.valueChanges.subscribe(data => {
      let verifyMessages = this.sendGoodsMsg;
      for (let field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        let control = this.sendGoodsForm.get(field);
        if (control && control.dirty && !control.valid) {
          let message = verifyMessages[field];
          for (let key in control.errors) {
            message[key] && (verifyMessages[field].errorMsg += message[key] + ' ');
          }
        }
      }
      Object.assign(this.sendGoodsData, this.sendGoodsForm.value);
    });
  }

  //打开发货方式选择
  openShippingTypeSelect() {
    let iosSelect = new IosSelect(1, [this.shippingTypeMap], {
      headerHeight: 44,
      itemHeight: 35,
      callback: (data) => {
        this.initForm(data.id);
        this.sendGoodsForm.controls.shippingType.reset(data.value);
        this.shippingTypeMap.find(item => item.selected).selected = false;
        this.shippingTypeMap.find(item => item.id == data.id).selected = true;
      }
    });
  }

  //打开快递公司选择
  openDeliverySelect() {
    var iosSelect = new IosSelect(1, [this.deliveryList], {
      headerHeight: 44,
      itemHeight: 35,
      callback: (data) => {
        this.sendGoodsForm.controls.shippingName.reset(data.value);
        this.shippingCode = data.id;
      }
    });
  }

  //打开地址选择
  openAddressSelect() {
    var iosSelect = new IosSelect(3, [this.cityData.iosProvinces, this.cityData.iosCitys, this.cityData.iosCountys], {
      headerHeight: 44,
      itemHeight: 35,
      relation: [1, 1, 0, 0],
      callback: (one, two, three) => {
        this.address = {
          province: one.id,
          city: two.id,
          district: three.id
        };
        let result = one.value + '-' + two.value + '-' + three.value;
        this.sendGoodsForm.controls.nodeCity.reset(result);
      }
    });
  }

  //打开是否设为常用选择
  openUsefulSelect() {
    let iosSelect = new IosSelect(1, [this.usefulMap], {
      headerHeight: 44,
      itemHeight: 35,
      callback: (data) => {
        this.sendGoodsForm.controls.useful.reset(data.value);
        this.usefulMap.find(item => item.selected).selected = true;
        this.usefulMap.find(item => item.id == data.id).selected = true;
      }
    });
  }

  submit() {
    this.api.post(this.api.config.host.bl + 'admin/order/v2/createLogistic', {
      orderId: this.order.orderId,//订单id
      //配送方式 self=>商家自送 publog=>众包物流 thirdparty=>外包配送 publog_third => 众包加外包
      shippingType: this.shippingTypeMap.find(item => item.selected).id,
      price: this.sendGoodsData.price,//价格
      shippingName: this.sendGoodsData.shippingName,//第三方配送方式名称
      shippingCode: this.shippingCode,//第三方配送方式编码
      nodeProvince: this.address.province,//站点省份
      nodeCity: this.address.city,//站点市
      nodeDistrict: this.address.district,//站点区
      nodeAddress: this.sendGoodsData.nodeAddress,//站点详细地址
      name: this.sendGoodsData.name,//站点负责人姓名
      telephone: this.sendGoodsData.telephone,//站点负责人电话
      thirdLogisticsNo: this.sendGoodsData.thirdLogisticsNo,//订单id
      useful: this.usefulMap.find(item => item.selected).id,//订单id是否添加到常用地址 0:否 1:是
      companyId:this.commonModel.TAB_INIT_USERINFO &&  this.commonModel.TAB_INIT_USERINFO.companyId, //假数据，暂时写死
      source_from: 1,
    }).subscribe(data => {
      if (data.success) {
        this.common.showToast('发货成功');
        this.viewCtrl.dismiss(true, null, { animate: false });
      } else {
        this.common.showToast(data.msg || '发货失败，请稍后再试~');
      }
    });
  }

}
