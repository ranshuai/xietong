import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import { Api } from '../../../providers/api/api';
import { AddressCityData } from '../../../providers/user/address-cityData';
import { CommonProvider } from '../../../providers/common/common';

import * as IosSelect from 'iosselect';


/**
 * Generated class for the UserInfoBankNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-info-bank-new',
  templateUrl: 'user-info-bank-new.html',
})
export class UserInfoBankNewPage {
  city;
  newAddressForm: any;
  newAddressData = {
    name: '',
    bankCode: '',
    bankName: '',
    bankAllName:'',
  };
  newAddressMessages = {
    'name': {
      'errorMsg': '',
      'required': '姓名是必填的',
    },
    'bankCode': {
      'errorMsg': '',
      'required': '银行卡号是必填的',
      'minlength': '卡号至少16位',
    },
    'bankName': {
      'errorMsg': '',
      'required': '开户行是必填的',
    },
    'bankAllName':{
      'errorMsg': '',
      'required': '详细地址是必填的'
    }
  };
  //是否是默认地址
  isDefault: boolean = false;
  //地址省市区id
  addressId = {
    provinceId: '',
    cityId: '',
    district: '',
  }
  addressName = {
    provinceName: '',
    cityName: '',
    areaName:''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder, public api: Api, public cityData: AddressCityData, public common:CommonProvider) {
    this.initFrom();
  }

  //初始化表单信息
  initFrom() {
    this.newAddressForm = this.formBuilder.group({
      name: [this.newAddressData.name, [Validators.required]],
      bankCode: [this.newAddressData.bankCode, [Validators.required,Validators.minLength(16)]],
      bankName: [this.newAddressData.bankName, [Validators.required]],
      bankAllName: [this.newAddressData.bankAllName, [Validators.required]],
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
//打开设置地址页面
openAddressModal() {
  var iosSelect = new IosSelect(3,
    [this.cityData.iosProvinces, this.cityData.iosCitys, this.cityData.iosCountys],
    {
      title: '地址选择',
      itemHeight: 70,
      relation: [1, 1, 0, 0],
      headerHeight: 88,
      callback: (one, two, three) => {
        this.city = one.value + '-' + two.value + '-' + three.value;
        this.addressId = {
          provinceId: one.id,
          cityId: two.id,
          district: three.id
        }
        this.addressName = {
          provinceName: one.value,
          cityName: two.value,
          areaName:three.value
        }
        this.initFrom();
      }
    });
}
  //设置默认地址
  setDefault() {
    this.isDefault = !this.isDefault;
    console.log(this.newAddressData);
  }

  saveBank() {
    if ( this.newAddressData.bankCode.match(/^[0-9]+$/) == null) {
      this.common.tostMsg({ msg: '请正确填写银行卡号' });
    } else {
      this.api.post(this.api.config.host.org + 'v2/userAccount/saveUserBankInfo', {
        'account':this.newAddressData.bankCode,
        'accountName':this.newAddressData.name,
        'bankName': this.newAddressData.bankName,
        'bankBranchName':	this.newAddressData.bankAllName,
        'isDefault': this.isDefault == true ? 1 : 0,
        'provinceName':	this.addressName.provinceName,
        'provinceId':	this.addressId.provinceId,
        'cityName':	this.addressName.cityName,
        'cityId':	this.addressId.cityId,
        'areaName':	this.addressName.areaName,
        'areaId': this.addressId.district,
        'accountId': '',
        'enable_': '',
      }).subscribe(data => {
        if (data.success) {
          this.common.tostMsg({ msg: data.msg });
          this.navCtrl.pop();
        } else {
          this.common.tostMsg({ msg: data.msg });
        }
      })
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoBankNewPage');
  }

}
