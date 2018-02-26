import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { AddressCityData } from '../../../providers/user/address-cityData';
import { CommonProvider } from '../../../providers/common/common';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";


import * as IosSelect from 'iosselect';

/**
 * Generated class for the UserInfoAddressNewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-address-new',
  templateUrl: 'user-info-address-new.html',
})
export class UserInfoAddressNewPage {
  city;
  newAddressForm: any;
  //设置密码输入框对象
  newAddressData = {
    name: '',
    phone: '',
    address: '',
  };
  newAddressMessages = {
    'name': {
      'errorMsg': '',
      'required': '姓名是必填的',
    },
    'phone': {
      'errorMsg': '',
      'required': '手机号是必填的',
      'phone':'请输入合法手机号'
    },
    'address': {
      'errorMsg': '',
      'required': '详细地址是必填的',
    },
  };
  //是否是默认地址
  isDefault: boolean = false;
  //地址省市区id
  addressId = {
    provinceId: '',
    cityId: '',
    district: ''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public cityData: AddressCityData, public api: Api, public common: CommonProvider, private formBuilder: FormBuilder, ) {
    this.initFrom();
  }
  //初始化表单信息
  initFrom() {
    this.newAddressForm = this.formBuilder.group({
      name: [this.newAddressData.name, [Validators.required]],
      phone: [this.newAddressData.phone, [Validators.required,Validators.phone]],
      address: [this.newAddressData.address, [Validators.required]],
    });

    this.newAddressForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.newAddressMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.newAddressForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        Object.assign(this.newAddressData, this.newAddressForm.value);
      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoAddressNewPage');
  }
  //打开设置地址页面
  openAddressModal() {
    var iosSelect = new IosSelect(3,
      [this.cityData.iosProvinces, this.cityData.iosCitys, this.cityData.iosCountys],
      {
        title: '地址选择',
        itemHeight: 35,
        relation: [1, 1, 0, 0],
        headerHeight: 44,
        callback: (one, two, three) => {
          this.city = one.value + '-' + two.value + '-' + three.value;
          this.addressId = {
            provinceId: one.id,
            cityId: two.id,
            district: three.id
          }
          this.initFrom();
        }
      });
  }
  //设置默认地址
  setDefault() {
    this.isDefault = !this.isDefault;
  }

  //保存用户收货地址
  saveAddree() {
    if (this.newAddressData.address == "" ||
      this.addressId.district == "" ||
      this.addressId.cityId == "" ||
      this.addressId.provinceId == "" ||  
      this.newAddressData.phone == "" ||
      this.newAddressData.name==""
    ){ 
      this.common.tostMsg({ msg: "输入项都不能为空哦" })
      return false;
    }
    this.api.post(this.api.config.host.bl + 'address/save', {
      "country": 0,
      "address": this.newAddressData.address,
      "city": this.addressId.cityId,//城市
      "email": "",
      "isDefault": this.isDefault,
      "mobile": this.newAddressData.phone,
      "consignee": this.newAddressData.name,
      "district": this.addressId.district,
      "province": this.addressId.provinceId,//省
      "twon": 0,
      "zipcode": "100000"
    }).subscribe(data => {
      if (data.success) {
        this.common.tostMsg({ msg: data.msg })
        if (this.api.config.isEditor) {
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.getViews().length-3))
       } else { 
         this.navCtrl.pop();
       }
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    });
  }
    ionViewWillLeave() {
  }
}
