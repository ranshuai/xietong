import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { AddressCityData } from '../../../providers/user/address-cityData';
import { CommonProvider } from '../../../providers/common/common';
import { FormBuilder } from '@angular/forms';
import { Validators } from "../../../providers/api/Validators";
import * as IosSelect from 'iosselect';
import { RequestOptions, Headers } from '@angular/http';
import {OrderAddressProvider} from '../../../providers/user/order-address';
/**
 * Generated class for the UserInfoAddressEditorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-address-editor',
  templateUrl: 'user-info-address-editor.html',
})
export class UserInfoAddressEditorPage {
  city;
  editorAddressForm: any;
  //设置密码输入框对象
  editorAddressData = {
    name: '',
    phone: '',
    address: '',
  };
  editorAddressMessages = {
    'name': {
      'errorMsg': '',
      'required': '姓名是必填的',
    },
    'phone': {
      'errorMsg': '',
      'required': '手机号是必填的',
    },
    'address': {
      'errorMsg': '',
      'required': '详细地址是必填的',
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
  //接口返回信息详情
  resData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public cityData: AddressCityData, public api: Api, public common: CommonProvider, private formBuilder: FormBuilder,public orderAddressData:OrderAddressProvider) {
    this.initFrom();
    this.getAddressDetail();
  }
  //初始化表单信息
  initFrom() {
    this.editorAddressForm = this.formBuilder.group({
      name: [this.editorAddressData.name, [Validators.required]],
      phone: [this.editorAddressData.phone, [Validators.required]],
      address: [this.editorAddressData.address, [Validators.required]],
    });

    this.editorAddressForm.valueChanges
      .subscribe(data => {
        const verifyMessages = this.editorAddressMessages;
        for (const field in verifyMessages) {
          verifyMessages[field].errorMsg = '';
          const control = this.editorAddressForm.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = verifyMessages[field];
            for (const key in control.errors) {
              messages[key] && (verifyMessages[field].errorMsg += messages[key] + ' ');
            }
          }
        }
        Object.assign(this.editorAddressData, this.editorAddressForm.value);
      });
  }

  //获取地址详情
  getAddressDetail() {
    this.api.get(this.api.config.host.bl + 'address/' + this.navParams.get('addressId')).subscribe(data => {
      console.log(data)
      if (data.success) {
        this.resData = data.result[0];
        this.editorAddressData = {
          name: data.result[0].consignee,
          phone: data.result[0].mobile,
          address: data.result[0].address,
        };
        this.city=data.result[0].provinceName + '-' + data.result[0].cityName + '-' + data.result[0].districtName,
        this.isDefault = data.result[0].isDefault;
        //地址省市区id
        this.addressId = {
          provinceId: data.result[0].province,
          cityId: data.result[0].city,
          district: data.result[0].district
        };
        this.initFrom();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
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
          console.log(this.addressId);
          this.initFrom();
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoAddressNewPage');
  }

  //设置默认地址
  setDefault() {
    this.isDefault = !this.isDefault;
  }

  //保存用户收货地址
  saveAddree() {
    let options = new RequestOptions({ headers: new Headers({ addressId: this.navParams.get('addressId') }) });
    this.api.put(this.api.config.host.bl + 'address/modify', {
      "country": 0,
      "address": this.editorAddressData.address,
      "city": this.addressId.cityId,//城市
      "email": "",
      "isDefault": this.isDefault,
      "mobile": this.editorAddressData.phone,
      "consignee": this.editorAddressData.name,
      "district": this.addressId.district,//区
      "province": this.addressId.provinceId,//省
      "twon": 0,
      "zipcode": "100000"
    }, options).subscribe(data => {
      if (data.success) {
        this.common.tostMsg({ msg: data.msg })
        this.navCtrl.pop();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    });
  }

  //删除用户地址
  deleateAddress() {
    let options = new RequestOptions({ headers: new Headers({ addressId: this.navParams.get('addressId') }) });
    console.log(this.navParams.get('addressId'))
    this.api.delete(this.api.config.host.bl + 'address/remove', null, null, options)
      .subscribe(data => {
        if (data.success) {
          this.orderAddressData.data = null;
          this.common.tostMsg({ msg: data.msg })
          this.navCtrl.pop();
        } else {
          this.common.tostMsg({ msg: data.msg })
        }
       
      });
  }
  ionViewWillLeave() {
  }
}
