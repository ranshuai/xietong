import { MainCtrl } from './../../../providers/MainCtrl';
import { LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { Validators } from '../../../providers/Validators';
import { AddressCityData } from '../../../providers/address-city-data';
import * as IosSelect from 'iosselect';

/**
 * Generated class for the ApplyCompanyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-apply-company',
  templateUrl: 'apply-company.html',
})
export class ApplyCompanyPage {

  applyFormData = {
    companyName: null, 
    companyType: '物流公司',  
    isAccount:'是', 
    superiorUnit:null,//查询上级单位
    legalperson: null, //法人姓名
    legal: null, //法人身份证
    directorMobile: null, //负责人电话
    director: null, //负责人姓名
    city:null,//城市
    detailedAddress:null,//详细地址
    bankAccount:null,//银行账号
    bankAccounts:null,//开户行
    accountName:null,//开户名
    creditCode:null,//社会信用代码
    personNo:null,//独立会计实体
    idCardFront: null, //法人身份证正面
    idCardReverse: null, //法人身份证反面
    idCardHandheld: null, //法人手持身份证照片
    businessLicense: null, //营业执照
  };
  uploadImageType: string;
  companyFrom:any;
  applyFormMsg:any = {
    companyName: {
      required: '单位名称是必填的',
    },
    superiorUnit:{
      
    },
    legalperson: {
      required: '法人姓名是必填的',
      chinese:'姓名必须是中文',
    },
    legal: {
      required: '法人身份证是必填的',
    },
    directorMobile: {
      required: '负责人手机号是必填的',
    },
    director: {
      required: '负责人姓名是必填的',
      chinese:'姓名必须是中文',
    },
    city:{
      required: '城市是必填的',
    },
    detailedAddress:{
      required: '详细地址是必填的',
    },
    bankAccount:{
      required: '银行账号是必填的',
    },
    accountName:{
      required: '开户名是必填的',
    },
    creditCode:{
      required: '统一社会信用代码是必填的',
    }
  }
    //  选择公司类型
    companyTypeMap : any = [{
      id:1,
      value: '物流公司',
      selected: true
    },{
      id:2,
      value: '物流运营公司',
      selected: false
    },{
      id:3,
      value: '商流公司',
      selected: false
    },{
      id:4,
      value: '商流运营公司',
      selected: false
    }]
  
  //是否独立实体
  isAccountMap: any = [{
    id: 1,
    value: '是',
    selected: true
  }, {
    id: 0,
    value: '否',
    selected: false
  }]

//选择开户行
  bankAccountsMap = [{
    id:1,
    value: '中国银行',
    selected: true
  },{
    id:2,
    value: '工商银行',
    selected: false
  },{
    id:3,
    value: '招商银行',
    selected: false
  },{
    id:4,
    value: '中兴银行',
    selected: false
  },{
    id:5,
    value: '浦发银行',
    selected: false
  },{
    id:6,
    value: '光大银行',
    selected: false
  },{
    id:7,
    value: '建设银行',
    selected: false
  },{
    id:8,
    value: '其他银行',
    selected: false
  }]

  address = {
    province: null,
    city: null,
    district: null,
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mainCtrl: MainCtrl,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, 
    private viewCtrl: ViewController, 
    public cityData: AddressCityData
  ) {
    //创建Form表单
    this.companyFrom = this.formBuilder.group({
      companyName: [this.applyFormData.companyName, [Validators.required, Validators.maxLength(28)]],
      companyType: [this.applyFormData.companyType, [Validators.required]],
      isAccount:[this.applyFormData.isAccount,[Validators.required]],
      superiorUnit:[this.applyFormData.superiorUnit,[]],
      legalperson: [this.applyFormData.legalperson, [Validators.required, Validators.chinese, Validators.maxLength(10)]],
      legal: [this.applyFormData.legal, [Validators.required, Validators.maxLength(18), Validators.idcard]],
      directorMobile: [this.applyFormData.directorMobile, [Validators.required, Validators.phone]],
      director: [this.applyFormData.director, [Validators.required, , Validators.chinese, Validators.maxLength(10)]],
      city:[this.applyFormData.city,[Validators.required]],
      detailedAddress:[this.applyFormData.detailedAddress,[Validators.required]],
      bankAccount:[this.applyFormData.bankAccount,[Validators.required]],
      bankAccounts:[this.applyFormData.bankAccounts,[Validators.required]],
      accountName:[this.applyFormData.accountName,[Validators.required]],
      creditCode:[this.applyFormData.creditCode,[Validators.required,Validators.minLength(18)]],
      idCardFront: [this.applyFormData.idCardFront, [Validators.required]],
      idCardReverse: [this.applyFormData.idCardReverse, [Validators.required]],
      idCardHandheld: [this.applyFormData.idCardHandheld, [Validators.required]],
      businessLicense: [this.applyFormData.businessLicense, [Validators.required]],
      personNo:['']
    });
    //监听Form表单任何变化
    this.companyFrom.valueChanges.subscribe(data => { 
      let verifyMessages = this.applyFormMsg;
      for (let field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        let control = this.companyFrom.get(field);
        if (control && control.dirty && !control.valid) {
          let message = verifyMessages[field];
          for (let key in control.errors) {
            message[key] && (verifyMessages[field].errorMsg += message[key] + ' ');
          }
        }
      }
      Object.assign(this.applyFormData, this.companyFrom.value);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyRolePage');
  }
 //切换单位类型
  openShopTypeSelect() { 
    let iosSelect = new IosSelect(1,[this.companyTypeMap], {
      headerHeight: 88,
      itemHeight: 70,
      callback: (data) => {
        for (var i = 0; i < this.companyTypeMap.length; i++){
          if (this.companyTypeMap[i].id == data.id) {
            this.companyTypeMap[i].selected = true;
          } else { 
            this.companyTypeMap[i].selected = false;
          }
        }
        this.companyFrom.controls.companyType.reset(data.value);
      }
    });
  }
  //是否独立会计实体
  openIsAccountSelect() { 
    let iosSelect = new IosSelect(1, [this.isAccountMap], {
      headerHeight: 88,
      itemHeight: 70,
      callback: (data) => {
        for (var i = 0; i < this.isAccountMap.length; i++){
          if (this.isAccountMap[i].id == data.id) {
            this.isAccountMap[i].selected = true;
          } else { 
            this.isAccountMap[i].selected = false;
          }
        }
        this.companyFrom.controls.isAccount.reset(data.value);
      }
    });
  }


  openIsbankAccounts() { 
    let iosSelect = new IosSelect(1, [this.bankAccountsMap], {
      headerHeight: 88,
      itemHeight: 70,
      callback: (data) => {
        for (var i = 0; i < this.bankAccountsMap.length; i++){
          if (this.bankAccountsMap[i].id == data.id) {
            this.bankAccountsMap[i].selected = true;
          } else { 
            this.bankAccountsMap[i].selected = false;
          }
        }
        this.companyFrom.controls.bankAccounts.reset(data.value);
      }
    });
  }

  openAddressSelect() {
    var iosSelect = new IosSelect(3, [this.cityData.iosProvinces, this.cityData.iosCitys, this.cityData.iosCountys], {
      itemHeight: 70,
      relation: [1, 1, 0, 0],
      headerHeight: 88,
      callback: (one, two, three) => {
        let result = one.value + '-' + two.value + '-' + three.value;
        this.address = {
          province: one.id,
          city: two.id,
          district: three.id
        };
        this.companyFrom.controls.city.reset(result);
      }
    });
  }

  //上传图片
  upload(type) { 
    (<HTMLInputElement>document.getElementById("fileInput")).value = null;
    document.getElementById("fileInput").click();
    this.uploadImageType = type;
  }
  fileChange(event) {
    this.mainCtrl.thirdPartyApi.uploadImage(event.target.files[0], 'company').subscribe(data => {
      if (data) {
        switch (this.uploadImageType) {
          case 'idCardFront':
            this.companyFrom.controls.idCardFront.reset(data);
            break;
          case 'idCardReverse':
            this.companyFrom.controls.idCardReverse.reset(data);
            break;
          case 'idCardHandheld':
            this.companyFrom.controls.idCardHandheld.reset(data);
            break;
          case 'businessLicense':
            this.companyFrom.controls.businessLicense.reset(data);
            break;
        }
      }
    });
  }

  submit() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '提交中，请稍后...'
    });
    loading.present();
    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + 'v2/user/openModule/5', {
      companyName: this.applyFormData.companyName,
      shopType: this.companyTypeMap.find(item => item.selected).id,
      isAccount: this.isAccountMap.find(item => item.selected).id, //独角鲸传 0 
      personNo: this.applyFormData.personNo,   // 如果是独立会计实体 personNo:''
      ownerperson: this.applyFormData.legalperson,
      idCard: this.applyFormData.legal,
      ownerMobile: this.applyFormData.directorMobile, //ownerMobile
      director: this.applyFormData.director,
      city:this.applyFormData.city,
      detailedAddress:this.applyFormData.detailedAddress,
      bankAccount:this.applyFormData.bankAccount,
      accountName:this.applyFormData.accountName,
      idCardFront: this.applyFormData.idCardFront,
      idCardReverse: this.applyFormData.idCardReverse,
      // idCardHandheld: this.storeFormData.idCardHandheld,
      businessLicense: this.applyFormData.businessLicense,
      sourceFrom: 2,
      addressDetail:this.strDel_(this.companyFrom.city +'-'+this.companyFrom.address)
    }).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        this.mainCtrl.nativeService.showToast('CompanyHomepagePage');
      } else { 
        this.mainCtrl.nativeService.showToast('ApplyCompanyFailPage');
      }
    });
    // this.navCtrl.push('ApplyCompanyAuditPage');
  }

  strDel_(str) { 
    str = str.replace(/-/g,'');
    return str
  }

}
