import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import { Api } from '../../../providers/api/api';
import { AddressCityData } from '../../../providers/user/address-cityData';

import * as IosSelect from 'iosselect';
import { CommonProvider } from '../../../providers/common/common';

/**
 * Generated class for the UserInfoBankDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-info-bank-detail',
  templateUrl: 'user-info-bank-detail.html',
})
export class UserInfoBankDetailPage {
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
    district: ''
  }
  addressName = {
    provinceName: '',
    cityName: '',
    areaName:''
  }
  accountId;
  enable_;
  //接口返回信息详情
  resData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public api: Api, private alertCtrl: AlertController, public cityData: AddressCityData, public common: CommonProvider) {
    this.accountId = this.navParams.get('accountId');
    this.initFrom();
  }
//初始化表单信息
initFrom() {
  this.newAddressForm = this.formBuilder.group({
    name: [this.newAddressData.name, [Validators.required]],
    bankCode: [this.newAddressData.bankCode, [Validators.required]],
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

  removeBank() {
    let alert = this.alertCtrl.create({
      message: '是否确认要删除该银行卡信息?',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '确定',
          handler: () => {
            this.enditMessage(1);
          }
        }
      ]
    });
    alert.present();
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

  enditMessage(_type) {
      this.api.post(this.api.config.host.org + 'v2/userAccount/saveUserBankInfo', {
        'account':this.newAddressData.bankCode,
        'accountName':this.newAddressData.name,
        'bankName': this.newAddressData.bankName,
        'bankBranchName':	this.newAddressData.bankAllName,
        'isDefault': this.isDefault == true?1:0,
        'provinceName':	this.addressName.provinceName,
        'provinceId':	this.addressId.provinceId,
        'cityName':	this.addressName.cityName,
        'cityId':	this.addressId.cityId,
        'areaName':	this.addressName.areaName,
        'areaId': this.addressId.district,
        'accountId': this.accountId,
        'enable_': _type == 1? 0 : '',
      }).subscribe(data => {
        if (data.success) {
          this.common.tostMsg({ msg: data.msg })
          this.navCtrl.pop();
        } else {
          this.common.tostMsg({ msg: data.msg });
        }
      })
  }

  getBankDetailed() {
    this.api.get(this.api.config.host.org + 'v2/userAccount/queryUserBankInfo' + '?accountId='+this.accountId).subscribe(data => {
      if (data.success) {
        this.resData = data.result[0];
        this.newAddressData = {
          name: data.result[0].accountName,
          bankName: data.result[0].bankName,
          bankAllName: data.result[0].bankBranchName,
          bankCode:data.result[0].account
        };
        this.city=data.result[0].provinceName + '-' + data.result[0].cityName + '-' + data.result[0].areaName,
        this.isDefault = data.result[0].isDefault == 1 ? true : false;
        //地址省市区id
        this.addressId = {
          provinceId: data.result[0].provinceId,
          cityId: data.result[0].cityId,
          district: data.result[0].areaId
        };
        this.addressName = {
          provinceName: data.result[0].provinceName,
          cityName: data.result[0].cityName,
          areaName:data.result[0].areaName
        }
        this.initFrom();
      } else {
        this.common.tostMsg({ msg: data.msg });
      }
    })
  }
//设置默认地址
  setDefault() {
    this.isDefault = !this.isDefault;
    console.log(this.newAddressData);
  }
  ionViewDidEnter(){
    this.getBankDetailed();
  }
}
