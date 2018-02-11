import { Injectable } from '@angular/core';
@Injectable()
export class DataFilterConfig{ 

  storeInfoList=[
    {
      name: "店铺信息",
      icon: "ion-ios-icon-gxk-2",
      link: "StoreInfoBasePage",
      companyId:''
    },
    {
      name: "店铺资质",
      icon: "ion-ios-icon-gxk-83",
      link: "StoreInfoAptitudePage",
      companyId:''
    },
    {
      name: "店铺地址",
      icon: "ion-ios-icon-gxk-82",
      link: "StoreInfoAddressPage",
      companyId:''
    },
    {
      name: "查看二维码",
      icon: "ion-ios-icon-gxk-49",
      link: "StoreInfoScanPage",
      companyId:''
    },
    {
      name: "退出店铺",
      icon: "ion-ios-icon-gxk-59",
      link: "StoreInfoQuitPage",
      quit:true
    }
  ]
  storeInfo: any = {};
  storeInfoBaseDataList: any = [];
  storeInfoAptitudeList: any = [];
  storeInfoAddressData: any = {};
  storeInfoScanData: any = {};
  //店铺信息
  commonStoreInfofileList: any = [];
  //店铺信息1
  setStoreInfoFn(json: any) { 
    let _json = json.result;
    for (var i = 0; i < this.storeInfoList.length; i++){
      this.storeInfoList[i]['companyId'] = _json.companyId
     }
    this.storeInfo = {
      logo: _json.logo,
      storeFront:_json.unitBackground,
      name: _json.companyName,
      des: _json.unitIntroduction,
      address: _json.districtName,
      // lists: [
      //   {
      //     name: '我的余额',
      //     num:_json.userMoney
      //   },
      //   {
      //     name: '店铺粉丝',
      //     num:_json.collectCounts
      //   }
      // ]
    };
    return this.storeInfo;
  }
  //店铺信息
  setStoreInfoBaseFn(json: any) { 
    let _json = json.result;
    this.storeInfoBaseDataList= [
      {
        name: '店铺名称',
        show:true,
        value:_json.name
      },
      {
        show:true,
        name:'店铺类型',
        value:"店铺 - "+(_json.shopType == '1' )? '个人店' : '企业店'
      },
      {
        show:true,
        name:'是否为独立会计实体',
        value:_json.rootUserId ? '否' : '是'
      },
      {
        show: true,
        name:'上级单位',
        value:_json.parentName
      },
      {
        show:true,
        name:'招商人手机',
        value:_json.mobile 
      },
      {
        show:true,
        name:'法人姓名',
        value:_json.owner
      },
      {
        show:true,
        name:'法人身份证号',
        value:_json.idCard
      },
      {
        show:true,
        name:'负责人姓名',
        value:_json.director
      },
      {
        show:true,
        name:'店铺联系电话',
        value:_json.storeMobile
      },
      {
        show:true,
        name:'店铺简介',
        value:_json.unitIntroduction
      },
      // {
      //   show:false,
      //   name:'营业时间',
      //   value: {
      //     // startTime: this.utilesStrToArr(_json.startTime)[0]+'至'+this.utilesStrToArr(_json.endTime)[0],
      //     // endTime:this.utilesStrToArr(_json.startTime)[1]+'至'+this.utilesStrToArr(_json.endTime)[1]
      //   }
      // }
    ];
    return this.storeInfoBaseDataList
  }
  //店铺资质
  setStoreInfoAptitudeFn(json: any) {
    let _json = json.result;
    this.storeInfoAptitudeList = [
      {
        name: '营业执照',
        value: _json.businessLicense,
        alt:'图片'
      },
      {
        name: '法人身份证正面照',
        value: _json.idCardFront,
        alt:'图片'
      },
      {
        name: '法人身份证反面照',
        value: _json.idCardReverse,
        alt:'图片'
      },
      {
        name: '法人手持身份证照',
        value: _json.idCardHandheld,
        alt:'图片'
      },
      {
        name: '店面照',
        value: _json.unitPhoto,
        alt:'图片'
      }
    ];
    return this.storeInfoAptitudeList;
  }
  //店铺地址
  setStoreInfoAddressFn(json: any) {
    let _json = json.result;
    this.storeInfoAddressData = {
      city: _json.provinceName+'-'+_json.cityName+'-'+_json.districtName,
      address: _json.address,
      map: {
        latitit: _json.latitit,
        longtit:_json.longtit
      }
    }
    return this.storeInfoAddressData;
  }
  setStoreInfoScanFn(json: any) { 
    let _json = json.result;
    this.storeInfoScanData = {
      scan: _json.orcodeUrl,
      text: '扫码进入店铺',
      alt:'二维码'
    }
    return this.storeInfoScanData;
  }
  commonStoreInfofileFn(json: any) { 
    this.commonStoreInfofileList = [];
    let _json = json.result || [];
    for (var i = 0; i < _json.length; i++){
      let a = {
        tbCompanyInfo: {
          companyName: _json[i].name, //名称
          headPic: _json[i].logo || 'http://snsall.oss-cn-qingdao.aliyuncs.com/21A4A35DE3403C5B/user/8/b691cf92-1499-4c97-8cfd-652f0c130002.jpg',// logo
          companyId:_json[i].companyId
        },
        totalSalesSum:'18', //销量
        storeGoodsNum: '12', //数量
        buyRank: '3'//评价
      }
      this.commonStoreInfofileList.push(a)
     }
    return this.commonStoreInfofileList;
  }
  //小工具 把字符串提转成数组。
  utilesStrToArr(str ?:string) { 
    let arr: Array<string> = str.split(',');
    return arr;
  }



}