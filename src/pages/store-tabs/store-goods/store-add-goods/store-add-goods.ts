import { HttpConfig } from './../../../../providers/HttpConfig';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { RequestOptions, Headers } from '@angular/http';
import { FormBuilder } from '@angular/forms';
import { CommonProvider } from "../../../gouxiangke/providers/common/common";
import { StoreAddGoods2Page } from "./store-add-goods2/store-add-goods2";
import { StoreAddGoodsSpecsPage } from "./store-add-goods-specs/store-add-goods-specs";
import { GlobalDataProvider } from "../../../gouxiangke/providers/global-data/global-data.model";
import { Api } from "../../../gouxiangke/providers/api/api";
import * as IosSelect from 'iosselect';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Validators } from "../../../gouxiangke/providers/api/Validators";
import { StoreAddGoodsSpecsProvider } from "../../providers/store-add-goods-specs";
/**
 * Generated class for the StoreAddGoodsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-add-goods',
  templateUrl: 'store-add-goods.html',
})
export class StoreAddGoodsPage {

  storeAddGoods2Page = StoreAddGoods2Page;
  storeAddGoodsSpecsPage = StoreAddGoodsSpecsPage;

  isEdit = false; //是否编辑的判断

  selfCategoryLevel: any; //商品分类 2，3

  goodsForm;

  goodsFormData = {
    goodsCategory: null,
    specsName: null,
    goodsName: null,
    specDataPrice: null,
    storeCount: null,
    isReal: 1,
    goodsSn: null,
    commission: null,
    // allowProxy: 0,
    // proxyMission: null,
  };

  //商品类型
  isRealList = [{
    id: 1,
    value: '商品'
  }, {
    id: 0,
    value: '服务'
  }];

  goodsFormMsg = {
    goodsCategory: { required: '店铺名称是必填的', },
    specsName: { required: '店铺名称是必填的', },
    goodsName: { required: '商品名称是必填的', },
    specDataPrice: { required: '商品售价是必填的', moneyTrue: '商品售价格式不对',above0: '数字必须大于0'},
    storeCount: { required: '库存是必填的',money:'请输入正整数' },
    goodsSn: { required: '商品编号是必填的', },
    commission: { required: '营销比例是必填的', max30: '营销比例最大30' },
    proxyMission: { required: '代售比例是必填的', max30: '代售比例最大30' },
  };

  goodsCategory; //分类
  orgCode;
  orgName;
  specDataKeyName; //规格名称
  specDataKey; //规格key
  domainRate;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private common: CommonProvider,
    private globalData: GlobalDataProvider,
    private api: Api,
    private validators: Validators,
    private loadingCtrl: LoadingController,
    private storeSpecs: StoreAddGoodsSpecsProvider,
    public httpConfig:HttpConfig
  ) {
    this.isEdit = this.navParams.get('isEdit');

    this.goodsForm = this.formBuilder.group({
      goodsCategory: [this.goodsFormData.goodsCategory, [Validators.required]],
      specsName: [this.goodsFormData.specsName, [Validators.required]],
      goodsName: [this.goodsFormData.goodsName, [Validators.required]],
      specDataPrice: [this.goodsFormData.specDataPrice, [Validators.required, Validators.moneyTrue,Validators.above0]],
      storeCount: [this.goodsFormData.storeCount, [Validators.required,Validators.money]],
      isReal: [this.goodsFormData.isReal, [Validators.required]],
      goodsSn: [this.goodsFormData.goodsSn],
      commission: [this.goodsFormData.commission, [Validators.required, Validators.max30]],
      // allowProxy: [this.goodsFormData.allowProxy, [Validators.required]],
      // proxyMission: [this.goodsFormData.proxyMission, [Validators.required, Validators.max30]],
    });

    this.goodsForm.valueChanges.subscribe(data => {
      let verifyMessages = this.goodsFormMsg;
      for (let field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        let control = this.goodsForm.get(field);
        if (control && control.dirty && !control.valid) {
          let message = verifyMessages[field];
          for (let key in control.errors) {
            message[key] && (verifyMessages[field].errorMsg += message[key] + ' ');
          }
        }
      }
      Object.assign(this.goodsFormData, this.goodsForm.value);
    });

    //重置规格
    this.storeSpecs.specses = null;
  }

  ionViewDidLoad() {
    this.getDomainRate();
    if (this.isEdit) {
      this.initEditData();
    }
  }

  initEditData() {
    let editData = this.globalData.editStoreGoods;
    //处理三级分类
    this.orgCode = editData.goods.orgCode;
    this.orgName = editData.goods.orgName;
    this.goodsCategory = { id: editData.goods.catId };
    let name = this.orgName.split('_');
    let resultName;
    do {
      resultName = name.pop();
    } while (!resultName);
    this.goodsForm.controls.goodsCategory.reset(resultName);
    // let cateList = editData.cateList;
    // let category1 = cateList.find(item => item.categoryVOList);
    // if (category1) {
    //   let category2 = category1.categoryVOList.find(item => item.categoryVOList);
    //   if (category2) {
    //     let category3 = category2.categoryVOList.find(item => item.flag);
    //     if (category3) {
    //       this.orgCode = category1.id + '_' + category2.id + '_' + category3.id;
    //       this.orgName = category1.mobileName + '_' + category2.mobileName + '_' + category3.mobileName;
    //       this.goodsCategory = category3;
    //       this.goodsForm.controls.goodsCategory.reset(category3.mobileName);
    //     } else {
    //       this.common.showToast('商品数据有问题，没有有3级分类，请重新选择~', 3000);
    //     }
    //   } else {
    //     this.common.showToast('商品数据有问题，没有有2级分类，请重新选择~', 3000);
    //   }
    // }
    //处理规格
    let specList = editData.specList;
    let specsName = [];
    let specDataKey = [];
    specList.forEach(specs => {
      let selectedSpecs = specs.specItemList.find(specsitem => specsitem.flag);
      if (selectedSpecs) {
        specsName.push(selectedSpecs.itemName);
        specDataKey.push(selectedSpecs.itemId);
      }
    });
    this.goodsForm.controls.specsName.reset(specsName.join('·'));
    this.specDataKey = specDataKey.join('_');
    this.specDataKeyName = specsName.join('_');
    //其他数据
    this.goodsForm.controls.goodsName.reset(editData.goods.goodsName);
    this.goodsForm.controls.specDataPrice.reset(editData.itemList[0].price);
    this.goodsForm.controls.storeCount.reset(editData.goods.storeCount);
    this.goodsForm.controls.isReal.reset(editData.goods.isReal);
    this.goodsForm.controls.goodsSn.reset(editData.goods.goodsSn);
    this.goodsForm.controls.commission.reset(editData.goods.commission);
    this.goodsForm.controls.allowProxy.reset(editData.goods.allowProxy1);
    this.goodsForm.controls.proxyMission.reset(editData.goods.proxyMission);
  }

  getDomainRate() {
    this.api.post(this.api.config.host.bl + 'v2/goods/queryRate').subscribe(data => {
      if (data.success) {
        this.domainRate = data.result;
      }
    });
  }

  openCategory() {
    let that = this;
    let api = (cateId) => {
      let options = new RequestOptions({ headers: new Headers({ cateId: cateId }) });
      return new Observable((observer: Subscriber<any>) => {
        this.api.post(this.api.config.host.bl + 'v2/category/queryCategory', null, options).subscribe(data => {
          if (data.success) {
            let list = data.result;
            list.forEach(item => {
              item.value = item.mobileName;
            });
            observer.next(list);
          }
        });
      });
    }

    //获取商品分类
    let getCategory1 = (callback) => {
      api(0).subscribe(data => {
        callback(data);
      });
    };

    //获取商品分类
    let getCategory2 = (cate2Id, callback) => {
      api(cate2Id).subscribe(data => {
        callback(data);
      });
    };

    let getCategory3 = (cate2Id, cate3Id, callback) => {
      api(cate3Id).subscribe(data => {
        if (data.length == 0) {
          callback([{ //假数据，后台接口未完善，完善后必有数据
            id:'',
            value: ''
          }]);
          return;
        }
        callback(data);
      });
    };

    var iosSelect = new IosSelect(3, [getCategory1, getCategory2, getCategory3], {
      headerHeight: 44,
      itemHeight: 35,
      relation: [1, 1, 0, 0],
      showLoading: true,
      callback: (one, two, three) => {
        if (three.id) {
          this.goodsCategory = three;
          this.goodsForm.controls.goodsCategory.reset(three.mobilename);
          this.orgCode = '_' + one.id + '_' + two.id + '_' + three.id + '_';
          this.orgName = one.mobilename + '_' + two.mobilename + '_' + three.mobilename;
        } else { 
          this.goodsCategory = two;
          this.goodsForm.controls.goodsCategory.reset(two.mobilename);
          this.orgCode = '_'+one.id + '_' + two.id + '_';
          this.orgName = one.mobilename + '_' + two.mobilename;
        }
      }
    });
  }

  openSpecs() {
    this.common.openChangeModal(this.storeAddGoodsSpecsPage, '',{templetId:this.goodsCategory.templetid}).subscribe(selectedList => {
      if (selectedList) {
        console.log(selectedList)
        let specsName = [];
        let specDataKey = [];
        selectedList.forEach(item => {
          specsName.push(item.specName +':'+item.itemName );
          specDataKey.push(item.itemId);
        });
        this.goodsForm.controls.specsName.reset(specsName.join('·'));
        this.specDataKey = specDataKey.join('_');
        this.specDataKeyName = specsName.join(' ');
        console.log(this.specDataKeyName)
        console.log(this.specDataKey)
        //[重量：一斤 大小：小]
      }
    });
  }

  next() {
    this.globalData.storeGoodsForm = {
      // storeId: this.api.config.storeId,
      storeId:this.httpConfig.storeId || window.localStorage.storeId,
      type: 1, //价格类型   1=统一售价   2= 分级售价
      categoryLevel: 3,
      catId: this.goodsCategory.id,
      orgCode: this.orgCode,
      orgName: this.orgName,
      spec_data_key: [this.specDataKey],
      spec_data_key_name: [this.specDataKeyName],
      goodsName: this.goodsFormData.goodsName,
      spec_data_price: [this.goodsFormData.specDataPrice],
      marketPrice:this.goodsFormData.specDataPrice,
      spec_data_count: [this.goodsFormData.storeCount],
      storeCount: this.goodsFormData.storeCount,
      isReal: this.goodsFormData.isReal, //是否实物0=否1=是
      goodsSn: this.goodsFormData.goodsSn,
      commission: this.goodsFormData.commission, //店铺佣金,营销比例

      //前端隐藏掉所有比例，在提交商品信息时候，
      //代售商品比例， 商品分成比例， 域公司分成比例这些只有就都默认为0
      // allowProxy: this.goodsFormData.allowProxy ? 1 : 0, //是否允许代售
      // proxyMission: this.goodsFormData.proxyMission, //店铺代卖佣金
      // domainRate: this.domainRate, //平台抽成比例
        allowProxy: 0, //是否允许代售
       proxyMission: 0, //店铺代卖佣金
       domainRate: 0, //平台抽成比例
      sourceFrom: 1,
    };

    this.common.goToPage(this.storeAddGoods2Page, { isEdit: this.isEdit });
  }

}
