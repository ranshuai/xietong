import { Injectable } from '@angular/core';
import { App, ToastController, ModalController, PopoverController, AlertController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import * as IosSelect from 'iosselect';
/*
  Generated class for the GoToPageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CommonProvider {

  openModal;
  popover;
  toast;
  alertMobile;
  alert;
  orderList = 0;
  count: boolean;
  constructor(
    private appCtrl: App,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private platform: Platform,
  ) { }

  goToPage(page, params?, option?) {
    this.appCtrl.getRootNav().push(page, params, option);
  }

  /**返回指定页面 */
  popToPage(_str?) {
    if (!_str) {
      this.appCtrl.getRootNav().pop();
    } else {
      if (_str && ['UserPage'].indexOf(_str) == -1) {
        // 代码有差异 不知道店铺APP哪里使用，方便代码回复 11-28
        /** 
        let pageIndex;
        if (_str == 'UserInfoOrderPage') { 
          pageIndex = this.orderList;
        }
        this.appCtrl.getRootNav().getViews().forEach((data, index) => {
          if (index == (pageIndex)) {
            this.appCtrl.getRootNav().popTo(data);
          }
        })
        */
        let count = 0;
        this.appCtrl.getRootNav().getViews().forEach(data => {
          if (data.name == _str) {
            this.appCtrl.getRootNav().popTo(data);
          }
        })
      } else {
        this.appCtrl.getRootNav().push(_str);
      }
    }
  }

  /**返回上级页面信息  type:0 返回页面名称  1：上级页面控制器navCtrl */
  getFormState(type) {
    return type == 0 ? this.appCtrl.getRootNav().last().name : this.appCtrl.getRootNav().last();
  }

  //判断上一页名字是否是pageName
  lastPageIs(pageName) {
    return this.appCtrl.getRootNav().getPrevious().name == pageName;
  }

  //打开公共弹窗
  openChangeModal(_page, _animate?, _data?) {
    return new Observable((observer: Subscriber<any>) => {
      this.openModal = this.modalCtrl.create(_page, _data);
      this.openModal.present({ animate: _animate });
      this.openModal.onDidDismiss(data => {
        observer.next(data);
      });
    });
  }

  //主动关闭公共弹框
  closeModal(data?, animate = true) {
    if (data) {
      this.openModal.dismiss(data, null, { animate: animate });
    } else {
      this.openModal.dismiss(null, null, { animate: animate });
    }
  }

  /**底部信息提醒 */
  showToast(str, duration = 1500) {

    if (!str) {
      return;
    }
    let toast = this.toastCtrl.create({
      message: str,
      duration: duration,
      cssClass: 'toast-bottom'
    });
    toast.present();
  }

  /**信息提醒 */
  tostMsg(_data) {
    this.showToast(_data.msg)
  }

  //电话号码过滤替换
  phoneFilter(_txt) {
    var txt = _txt + '';
    var len = '';
    for (var i = 0; i < txt.length - 7; i++) {
      len += '*'
    }
    var out = "";
    out = txt.substr(0, 3) + len + txt.substr(-4)
    return out;
  }

  //性别转换
  sexFilter(_code) {
    var json = {
      0: "保密",
      1: "男",
      2: "女",
      'true': '男',
      'false': '女'
    }
    return json[_code];
  }

  /***时间选择器 */
  selectDate(_defulData) {
    return new Observable(observer => {
      var now = new Date();
      var nowYear = now.getFullYear();
      var nowMonth = now.getMonth() + 1;
      var nowDate = now.getDate();
      // 数据初始化
      function formatYear(nowYear) {
        var arr = [];
        for (var i = nowYear - 70; i <= nowYear -0 ; i++) {
          arr.push({
            id: i + '',
            value: i + '年'
          });
        }
        return arr;
      }
      function formatMonth() {
        var arr = [];
        for (var i = 1; i <= 12; i++) {
          arr.push({
            id: i + '',
            value: i + '月'
          });
        }
        return arr;
      }
      function formatDate(count) {
        var arr = [];
        for (var i = 1; i <= count; i++) {
          arr.push({
            id: i + '',
            value: i + '日'
          });
        }
        return arr;
      }
      var yearData = function (callback) {
        callback(formatYear(nowYear))
      }
      var monthData = function (year, callback) {
        callback(formatMonth());
      };
      var dateData = function (year, month, callback) {
        if (/^(1|3|5|7|8|10|12)$/.test(month)) {
          callback(formatDate(31));
        }
        else if (/^(4|6|9|11)$/.test(month)) {
          callback(formatDate(30));
        }
        else if (/^2$/.test(month)) {
          if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
            callback(formatDate(29));
          }
          else {
            callback(formatDate(28));
          }
        }
        else {
          throw new Error('month is illegal');
        }
      };

      var iosSelect = new IosSelect(3,
        [yearData, monthData, dateData],
        {
          title: '生日',
          itemHeight: 44,
          relation: [1, 1, 0, 0],
          itemShowCount: 5,
          headerHeight: 44,
          oneLevelId: _defulData.year ? _defulData.year : '',
          twoLevelId: _defulData.month ? _defulData.month : '',
          threeLevelId: _defulData.day ? _defulData.day : '',
          callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
            let item = {
              one: selectOneObj,
              two: selectTwoObj,
              three: selectThreeObj
            }
            observer.next(item);
          },

        });
    });
  }

  //阻止事件冒泡
  stopProp(event) {
    event.stopPropagation();
  }

  //打开popover
  openPopover(popoverPage, event, data?, opts?) {
    this.popover = this.popoverCtrl.create(popoverPage, data, opts);
    this.popover.present({ ev: event });
  }

  //关闭popover
  closePopover() {
    this.popover.dismiss();
  }
  //店铺通用确认弹窗
  storeConfirm(title) {
    return new Observable(observer => {
      this.alert = this.alertCtrl.create({
        title: title,
        cssClass: 'store-confirm',
        buttons: [{
          text: '取消',
          role: 'cancel'
        }, {
          text: '确定',
          handler: data => {
            observer.next();
          }
        }]
      });
      this.alert.present();
    });
  }
  //关闭popover
  closeAlert() {
    this.alert.dismiss();
  }

  //绑定手机号modal
  openMobileModal() {
    return new Observable(observer => {
      this.alertMobile = true;
      let title;
      this.count == true ? title = "请绑定您的手机号~" : title = "开店需绑定手机号~";
      let alert = this.alertCtrl.create({
        title: title,
        enableBackdropDismiss: false,
        buttons: [{
          text: '去绑定',
          handler: () => {
            this.alertMobile = false;
            observer.next();
            // this.goToPage(this.userSetMobilePage);
          }
        }],
      });
      alert.present();
    })
  }
 
  //共用的强制跳转页面
  openCoercionJumpModel(title){
    return new Observable(observer => {
      this.alert = this.alertCtrl.create({
        title: title,
        cssClass: 'com-confirm',
        buttons: [{
          text: '确定',
          handler: data => {
            observer.next(true);
          }
        }]
      });
      this.alert.present();
    });
  }
 

  //共用的confirm窗口
  comConfirm(title) {
    return new Observable(observer => {
      this.alert = this.alertCtrl.create({
        title: title,
        cssClass: 'com-confirm',
        buttons: [{
          text: '取消',
          role: 'cancel'
        }, {
          text: '确定',
          handler: data => {
            observer.next(true);
          }
        }]
      });
      this.alert.present();
    });
  }
  //共用的会员分级售价模式提示框
  comSellingMode(title) {
    return new Observable(observer => {
      this.alert = this.alertCtrl.create({
        title: title,
        cssClass: 'com-confirm',
        buttons: [{
          text: '确定',
          handler: data => {
            observer.next();
          }
        }]
      });
      this.alert.present();
    });
  }



  /**
* 是否真机环境
*/
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }


}
