import { AddressCityData } from '../../../providers/address-city-data';
import { MainCtrl } from './../../../providers/MainCtrl';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserSetMobilePage } from '../../gouxiangke/user-info/user-set/user-set-mobile/user-set-mobile';
import { Validators } from '../../../providers/Validators';
import * as IosSelect from 'iosselect';

/**
 * Generated class for the ApplyRolePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage(
  {
    segment: 'open_store',
  }
)

@Component({
  selector: 'page-apply-role',
  templateUrl: 'apply-role.html',
})

export class ApplyRolePage {
  //表单验证是否成功
  checkForm = false;
  //营业执照必传
  isRequriedBusinessLicense = false;

  //招商人userid
  agentUserId: any;
  mobile: any;
  checkloading = false;//检测用户接口是否调用完毕
  checkInterval;
  detectUserInfo = false;//检测用户是否绑定手机号和实名认证
  userIdentity: any;//用户实名认证信息

  //上传图片
  uploadImageType: string;
  addressDetail: string;
  applyFormData = {
    companyName: null, //营业执照名称
    companyAlias: null,//商户(别名)
    shopType: '个人店', //店铺类型，1个人店，2企业店
    serviceType: '销售', //服务类型 1销售 2租赁
    isAccount: '是', //会计实体 1是，0不是
    isLegalPerson: '否',
    ownerperson: null, //法人姓名
    owner: null, //法人身份证
    ownerMobile: null, //法人电话
    director: null, //负责人姓名
    mobile: null, //负责人手机号
    city: null, //地址
    address: null,
    idCardFront: null, //法人身份证
    idCardReverse: null, //法人身份证反面
    idCardHandheld: null, //法人手持身份证照片
    businessLicense: null, //营业执照
    sourceFrom: 2, //来源：1app 2weixin 3web
    personNo: null
  };

  applyFormMsg: any = {
    companyName: {
      required: '店铺名称是必填的',
      maxLength: '不能超过28个字符'
    },
    companyAlias: {
      required: '别名(商号)是必填的',
      maxLength: '不能超过8个字符'
    },
    ownerperson: {
      required: '法人姓名是必填的',
      chinese: '姓名必须是中文',
      maxLength: '不能超过10个字符'
    },
    owner: {
      required: '法人身份证是必填的',
      maxLength: '不能超过18个字符',
      idcard: '身份证格式不正确'
    },
    ownerMobile: {
      required: '法人手机号是必填的',
      phone: '手机号格式不正确'
    },
    director: {
      required: '负责人姓名是必填的',
      chinese: '姓名必须是中文',
      maxLength: '不能超过10个字符'
    },
    mobile: {
      required: '负责人手机号是必填的',
      phone: '手机号格式不正确'
    },
    city: {
      required: '店铺地址县是必填的'
    },
    address: {
      required: '店铺详细地址是必填的'
    },
    idCardFront: {
      required: '身份证正面照必填'
    },
    idCardReverse: {
      required: '身份证反面照必填'
    }
  }
  //选择店铺类型
  shopTypeMap: any = [{
    id: 1,
    value: '个人店',
    selected: true
  }, {
    id: 2,
    value: '企业店',
    selected: false
  }];
  //店铺的服务类型
  serviceTypeMap: any = [{
    id: 1,
    value: '销售',
    selected: true
  }, {
    id: 2,
    value: '租赁',
    selected: false
  }];

  //地址
  address = {
    province: null,
    city: null,
    district: null
  }
  //是否独立实体
  isAccountMap: any = [{
    id: 1,
    value: '是',
    selected: true
  }, {
    id: 0,
    value: '否',
    selected: false
  }];

  //是否法人
  isLegalPersonMap: any = [{
    id: 1,
    value: '否',
    selected: true
  }, {
    id: 0,
    value: '是',
    selected: false
  }];

  applyForm: any;
  type;
  applyError: boolean;
  storeId;

  //初始化表单校验规则
  formInspection = {
    companyName: [this.applyFormData.companyName, [Validators.required, Validators.maxLength(28)]],
    companyAlias: [this.applyFormData.companyAlias, [Validators.required, Validators.maxLength(8)]],
    shopType: [this.applyFormData.shopType, [Validators.required]],
    // isAccount:[this.applyFormData.isAccount,[Validators.required]],
    isLegalPerson: [this.applyFormData.isLegalPerson, [Validators.required]],
    ownerperson: [this.applyFormData.ownerperson, [Validators.required, Validators.chinese, Validators.maxLength(10)]],
    owner: [this.applyFormData.owner, [Validators.required, Validators.maxLength(18), Validators.idcard]],
    ownerMobile: [this.applyFormData.ownerMobile, [Validators.required, Validators.phone]],
    director: [this.applyFormData.director, [Validators.required, , Validators.chinese, Validators.maxLength(10)]],
    mobile: [this.applyFormData.mobile, [Validators.required, Validators.phone]],
    city: [this.applyFormData.city, [Validators.required]],
    address: [this.applyFormData.address, [Validators.required]],
    idCardFront: [this.applyFormData.idCardFront, [Validators.required]],
    idCardReverse: [this.applyFormData.idCardReverse, [Validators.required]],
    businessLicense: [this.applyFormData.businessLicense, [Validators.required]],
    personNo: ['']
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private mainCtrl: MainCtrl, private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, private viewCtrl: ViewController, public cityData: AddressCityData) {

    this.type = this.navParams.get('type');
    //检测用户是否绑定过手机和实名认证
    this.detectIndividual();
    //招商人ID
    this.agentUserId = this.navParams.get('recruitUserId');
    console.log(this.agentUserId)
    if (this.agentUserId) {
      //如果打开的是自己分享的招募店铺链接,直接跳转到首页
      if (this.mainCtrl.commonModel.userId == this.agentUserId) {
        console.log('招募店铺--跳转到首页!')
        this.mainCtrl.setRootPage('TabMenuPage');
      }
    }
    this.initFormData();
  }

  initFormData() {
    //创建Form表单
    this.applyForm = this.formBuilder.group({
      companyName: [this.applyFormData.companyName, [Validators.required, Validators.maxLength(28)]],
      companyAlias: [this.applyFormData.companyAlias, [Validators.required, Validators.maxLength(16)]],
      shopType: [this.applyFormData.shopType, [Validators.required]],
      // isAccount:[this.applyFormData.isAccount,[Validators.required]],
      isLegalPerson: [this.applyFormData.isLegalPerson, [Validators.required]],
      ownerperson: [this.applyFormData.ownerperson, [Validators.required, Validators.chinese, Validators.maxLength(10)]],
      owner: [this.applyFormData.owner, [Validators.required, Validators.maxLength(18), Validators.idcard]],
      ownerMobile: [this.applyFormData.ownerMobile, [Validators.required, Validators.phone]],
      director: [this.applyFormData.director, [Validators.required, , Validators.chinese, Validators.maxLength(10)]],
      mobile: [this.applyFormData.mobile, [Validators.required, Validators.phone]],
      city: [this.applyFormData.city, [Validators.required]],
      address: [this.applyFormData.address, [Validators.required]],
      idCardFront: [this.applyFormData.idCardFront, [Validators.required]],
      idCardReverse: [this.applyFormData.idCardReverse, [Validators.required]],
      // // idCardHandheld: [this.storeFormData.idCardHandheld, [Validators.required]],
      businessLicense: [this.applyFormData.businessLicense, [Validators.required]],
      personNo: ['']
    });
    //监听Form表单任何变化
    this.applyForm.valueChanges.subscribe(data => {
      let verifyMessages = this.applyFormMsg;
      for (let field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        let control = this.applyForm.get(field);
        if (control && control.dirty && !control.valid) {
          let message = verifyMessages[field];
          for (let key in control.errors) {
            message[key] && (verifyMessages[field].errorMsg += message[key] + ' ');
          }
        }
      }
      Object.assign(this.applyFormData, this.applyForm.value);

      this.checkForm = this.checkFormData();

    })
  }

  /**
 * 检测表单验证方法
 */
  checkFormData() {
    var count = 0;
    for (var key in this.applyFormMsg) {
      var item = this.applyFormData[key];
      if (this.isRequriedBusinessLicense && this.applyFormData.businessLicense === null) {
        count++;
        break;
      }
      if (item === null || item == "") {
        count++;
        break;
      }

      if (this.applyFormMsg[key].errorMsg != '') {
        count++;
        break;
      }
    }
    return count > 0 ? false : true;
  }

  onCompanyNameBlur() {
    if (this.applyFormData.companyName == null) {
      this.applyFormMsg.companyName.errorMsg = "营业执照名称必填";
    } else {
      this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + 'v2/user/checkInfoName', {
        name: this.applyFormData.companyName,
      }).subscribe(data => {
        if (!data.success) {
          this.applyFormMsg.companyName.errorMsg = '营业执照名称不能重复';
        }
      })
    }
  }

  onCompanyAliasBlur() {
    if (this.applyFormData.companyAlias == null) {
      this.applyFormMsg.companyAlias.errorMsg = "商号名称必填";
    } else {
      this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + 'v2/user/checkInfoName', {
        name: this.applyFormData.companyAlias,
        optType: 2
      }).subscribe(data => {
        if (!data.success) {
          this.applyFormMsg.companyAlias.errorMsg = '商号名称不能重复';
        }
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyRolePage');
  }

  //页面初始化
  ionViewDidEnter() {
    this.resetSubmit();

    if (this.detectUserInfo) {
      this.detectIndividual();
    }
  }

  //检测用户是否绑定过或者实名认证
  detectIndividual() {
    //检测当前用户是否开过店
    this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'v2/check/queryOpenModule?moduleId=5').subscribe(data => {
      if (data.success) {
        //从未开过店
        if (data.result == 1000) {
          if (this.mainCtrl.httpService.config.platform == 'wx') {
            if (!this.mainCtrl.commonModel.TAB_INIT_USERINFO.mobile) {
              this.mainCtrl.utils.comConfirm('请绑定您的手机号~', 2, false).subscribe(() => {
                setTimeout(() => {
                  this.detectUserInfo = true;
                  this.navCtrl.push('PublicUserSetMobilePage', { type: 1 });
                }, 500);
              })
            } else {
              let loading = this.loadingCtrl.create({
                content: '数据加载中。。。'
              })
              loading.present();
              //如果有userId 授权成功
              if (this.mainCtrl.commonModel.userId) {
                loading.dismiss();

                this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'user/real/query').subscribe(data => {
                  //如果status = 10112 没有实名认证 
                  data.result = data.result ? data.result : {};
                  if (data.result && data.result.status == 10112) {
                    this.mainCtrl.utils.comConfirm('需要实名认证之后,才能变身店铺', 2, false, 'popupAlert').subscribe(data => {
                      setTimeout(() => {
                        this.detectUserInfo = true;
                        this.navCtrl.push('UserRealQueryPage', { scene: 4 });
                      }, 500);
                    })
                    return false;
                  } else {
                    //保存用户的真实信息
                    window.localStorage.setItem('userIdentity', JSON.stringify(data.result.identity));
                    this.userIdentity = JSON.parse(window.localStorage.getItem('userIdentity'));
                  }
                })
              }
            }
          }
          //为2为驳回状态
        } else if(data.result == 2) {
          this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'v2/admin/queryOrgStatusByUserId', {
            moduleId: 5,
          }).subscribe(data => {
            if (data.success) {
              this.storeId = data.result.status.storeId;
              console.log(data.result.storeId)
              if (data.result.status.status == 2) {
                this.applyError = true;
                this.applyForm.reset(data.result.status);
                this.applyForm.controls.owner.reset(data.result.status.idCard);
                this.applyForm.controls.city.reset(data.result.status.provinceName + '-' + data.result.status.cityName + '-' + data.result.status.districtName);
                data.result.status.ownerpersonId == window.localStorage.getItem('userId') ? this.applyForm.controls.isLegalPerson.reset("是") : this.applyForm.controls.isLegalPerson.reset("否");
                data.result.status.shopType == 1 ? this.applyForm.controls.shopType.reset("个人店") : this.applyForm.controls.shopType.reset("企业店");
                this.initFormData();
              }
            }
          })
          //-2被拉黑
        } else if (data.result == -2){
          this.mainCtrl.utils.comConfirm('您的店铺被拉黑!', 2, false).subscribe(() => {
            //如果有值，说明是从招募店铺过来的
            if (this.agentUserId) {
              this.mainCtrl.setRootPage('TabMenuPage');
            } else {
              this.mainCtrl.thirdPartyApi.closeWeixin();
            }
          });
        //-1被关闭
        }else if(data.result == -1){
          this.mainCtrl.utils.comConfirm('您的店铺被关闭,请联系客服~', 2, false).subscribe(() => {
            //如果有值，说明是从招募店铺过来的
            if (this.agentUserId) {
              this.mainCtrl.setRootPage('TabMenuPage');
            } else {
              this.mainCtrl.thirdPartyApi.closeWeixin();
            }
          });
        }else{
          //不能再次开店,跳转到首页
          this.mainCtrl.utils.comConfirm('您已开店,不能再次申请!', 2, false).subscribe(() => {
            //如果有值，说明是从招募店铺过来的
            if (this.agentUserId) {
              this.mainCtrl.setRootPage('TabMenuPage');
            } else {
              this.mainCtrl.thirdPartyApi.closeWeixin();
            }
          });
        }
      } else {
        this.mainCtrl.nativeService.showToast(data.msg);
        return;
      }
    });

  }


  //切换店铺类型
  openShopTypeSelect() {
    let serviceTypeMapFn = (cate2Id, callback) => {
      let data: any;
      if (cate2Id == 1) {
        data = [{
          id: 1,
          value: '销售',
          selected: true
        }];
      } else {
        data = [{
          id: 1,
          value: '销售',
          selected: true
        }, {
          id: 2,
          value: '租赁',
          selected: false
        }]
      }
      callback(data)
    }



    let iosSelect = new IosSelect(2, [this.shopTypeMap, serviceTypeMapFn], {
      headerHeight: 44,
      itemHeight: 35,
      relation: [1, 1, 0, 0],
      showLoading: true,
      callback: (one, two) => {
        //个人店铺不能选择租赁 one.id = 1; 企业 id =2
        if (one.id == 1) {
          this.applyForm.controls.shopType.reset(one.value);
          this.shopTypeMap[0].selected = true;
          this.shopTypeMap[1].selected = false;
          this.serviceTypeMap[0].selected = true;
          this.serviceTypeMap[1].selected = false;
          this.isRequriedBusinessLicense = false;
        } else {
          this.isRequriedBusinessLicense = true;
          this.applyForm.controls.shopType.reset(one.value + '-' + two.value);
          this.shopTypeMap[1].selected = true;
          this.shopTypeMap[0].selected = false;
          for (var i = 0; i < this.serviceTypeMap.length; i++) {
            if (this.serviceTypeMap[i].id == two.id) {
              this.serviceTypeMap[i].selected = true;
            } else {
              this.serviceTypeMap[i].selected = false;
            }
          }
        }
      }
    });
  }

  //是否法人
  openIsLegalPersonSelect() {
    let iosSelect = new IosSelect(1, [this.isLegalPersonMap], {
      headerHeight: 44,
      itemHeight: 35,
      callback: (data) => {
        for (var i = 0; i < this.isLegalPersonMap.length; i++) {
          if (this.isLegalPersonMap[i].id == data.id) {
            this.isLegalPersonMap[i].selected = true;
          } else {
            this.isLegalPersonMap[i].selected = false;
          }
        }
        this.applyForm.controls.isLegalPerson.reset(data.value);
        //为0表示我是法人,不需要检测法人手机号,我们为其赋值
        if (data.id == '0') {
          this.applyForm.controls.ownerperson.reset(this.userIdentity.idCardName);
          this.applyForm.controls.owner.reset(this.userIdentity.idCard);
          this.applyForm.controls.ownerMobile.reset(this.userIdentity.mobile);
          this.applyForm.controls.idCardFront.reset(this.userIdentity.idCardFront);
          this.applyForm.controls.idCardReverse.reset(this.userIdentity.idCardReverse);
        } else {
          this.applyForm.controls.ownerperson.reset('');
          this.applyForm.controls.owner.reset('');
          this.applyForm.controls.ownerMobile.reset('');
          this.applyForm.controls.idCardFront.reset('');
          this.applyForm.controls.idCardReverse.reset('');
        }
      }
    });
  }

  //是否独立会计实体
  openIsAccountSelect() {
    let iosSelect = new IosSelect(1, [this.isAccountMap], {
      headerHeight: 44,
      itemHeight: 35,
      callback: (data) => {
        for (var i = 0; i < this.isAccountMap.length; i++) {
          if (this.isAccountMap[i].id == data.id) {
            this.isAccountMap[i].selected = true;
          } else {
            this.isAccountMap[i].selected = false;
          }
        }
        this.applyForm.controls.isAccount.reset(data.value);
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
            this.applyForm.controls.idCardFront.reset(data);
            break;
          case 'idCardReverse':
            this.applyForm.controls.idCardReverse.reset(data);
            break;
          case 'idCardHandheld':
            this.applyForm.controls.idCardHandheld.reset(data);
            break;
          case 'businessLicense':
            this.applyForm.controls.businessLicense.reset(data);
            break;
        }
      }
    });
  }
  //选择城市级联插件
  openAddressSelect() {
    var iosSelect = new IosSelect(3, [this.cityData.iosProvinces, this.cityData.iosCitys, this.cityData.iosCountys], {
      itemHeight: 35,
      relation: [1, 1, 0, 0],
      headerHeight: 44,
      callback: (one, two, three) => {
        let result = one.value + '-' + two.value + '-' + three.value;
        this.address = {
          province: one.id,
          city: two.id,
          district: three.id
        };
        this.applyForm.controls.city.reset(result);
      }
    });
  }

  resetSubmit() {
    if (this.type == 2) {
      this.mainCtrl.httpService.get(this.mainCtrl.httpService.config.host.org + 'v2/admin/queryOrgStatusByUserId', {
        moduleId: 5,
      }).subscribe(data => {
        if (data.success) {
          this.storeId = data.result.status.storeId;
          console.log(data.result.storeId)
          if (data.result.status.status == 2) {
            this.applyError = true;
            this.applyForm.reset(data.result.status);
            this.applyForm.controls.owner.reset(data.result.status.idCard);
            this.applyForm.controls.city.reset(data.result.status.provinceName + '-' + data.result.status.cityName + '-' + data.result.status.districtName);
            data.result.status.ownerpersonId == window.localStorage.getItem('userId') ? this.applyForm.controls.isLegalPerson.reset("是") : this.applyForm.controls.isLegalPerson.reset("否");
            data.result.status.shopType == 1 ? this.applyForm.controls.shopType.reset("个人店") : this.applyForm.controls.shopType.reset("企业店");
            this.initFormData();
          }
        }
      })
    }
  }

  submit() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '提交中，请稍后...'
    });
    loading.present();
    let url;
    if (this.applyError) {
      url = 'v2/user/updateModule/5';
    } else {
      url = 'v2/user/openModule/5';
    }
    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + url, {
      agentUserId: Number(this.agentUserId),//招商人id
      companyName: this.applyFormData.companyName,
      companyAlias: this.applyFormData.companyAlias,
      shopType: this.shopTypeMap.find(item => item.selected).id,
      serviceType: this.serviceTypeMap.find(item => item.selected).id,
      shopAttr: this.serviceTypeMap.find(item => item.selected).id,
      // isAccount: this.isAccountMap.find(item => item.selected).id, //独角鲸传 0 
      personNo: this.isAccountMap.find(item => item.selected).id ? '' : this.applyFormData.personNo,   // 如果是独立会计实体 personNo:''
      ownerperson: this.applyFormData.ownerperson,
      idCard: this.applyFormData.owner,
      ownerMobile: this.applyFormData.ownerMobile, //ownerMobile
      director: this.applyFormData.director,
      mobile: this.applyFormData.mobile,
      province: this.address.province,
      city: this.address.city,
      district: this.address.district,
      address: this.applyFormData.address,
      idCardFront: this.applyFormData.idCardFront,
      idCardReverse: this.applyFormData.idCardReverse,
      // idCardHandheld: this.storeFormData.idCardHandheld,
      businessLicense: this.applyFormData.businessLicense,
      sourceFrom: 2,
      isAccount: 1,
      storeId: this.storeId,
      addressDetail: this.strDel_(this.applyFormData.city + '-' + this.applyFormData.address)
    }).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        let result = data.result;
        if (result.status == 1) {
          this.mainCtrl.nativeService.showToast('申请成功,等待后台审核~');
          setTimeout(() => {
            //跳转到根页面
            if (this.agentUserId) {
              this.mainCtrl.setRootPage('TabMenuPage');
            } else {
              this.mainCtrl.thirdPartyApi.closeWeixin();
            }
          }, 1000);
        } else if (result.status == 10108) {
          this.mainCtrl.nativeService.showToast('每个账号只允许申请一个店铺~');
        } else if (result.status == 501) {
          this.mainCtrl.nativeService.showToast('您名下有多个店铺，数据异常，请通知客服~');
        } else {
          this.mainCtrl.nativeService.showToast('数据异常，异常代码' + result.status + '，请通知客服~');
        }
      } else {
        this.mainCtrl.nativeService.showToast(data.msg)
      }
    });
  }
  //删除字符串里面的‘-’
  strDel_(str) {
    str = str.replace(/-/g, '');
    return str
  }

}
