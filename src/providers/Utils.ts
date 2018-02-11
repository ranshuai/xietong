/**
 * Created by 61538187@qq.com on 2017/12/02.
 */
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { App, ToastController, ModalController, AlertController, ActionSheetController } from 'ionic-angular';
declare let hex_md5;

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Utils {

  constructor(
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {
}

/**
 * 
 * @param _page   //页面
 * @param data   //页面数据
 * @param options  //showBackdrop  enableBackdropDismiss  cssClass
 * @param _animate  打开动画
 */
 openModal(_page,  data: any = {}, options= {},_animate:boolean=true) {
  return new Observable((observer: Subscriber<any>) => {
    var modal=this.modalCtrl.create(_page, data, options);
    modal.present({ animate: _animate });
    modal.onDidDismiss(data => {
      observer.next(data);
    });
  });
}

  /**
   * @param title   //标题
   * @param buttons //按钮
   * @param subTitle //副标题
   * @param message //消息
   * @param cssClass //自定义css样式,以空格分隔
   * @param inputs //输入数组
   * @param _enableBackdropDismiss  //是否应该通过点击背景来解除警报。默认为true。
   */
  comConfirm(title, buttons: Number, _enableBackdropDismiss: boolean = true, cssClass: string = "com-confirm", subTitle?, message?, inputs?) {
    return new Observable(observer => {
      let confirm: any = {};
      confirm.title = title;
      confirm.enableBackdropDismiss = _enableBackdropDismiss;
      confirm.cssClass = cssClass;

      if (buttons == 1) {
        confirm.buttons = [{
          text: '取消',
          role: 'cancel'
        }, {
          text: '确定',
          handler: data => {
            observer.next(true);
          }
        }];
      } else if (buttons == 2) {
        confirm.buttons = [{
          text: '确定',
          handler: data => {
            observer.next(true);
          }
        }];
      }

      if (subTitle) {
        confirm.subTitle = subTitle;
      }
      if (message) {
        confirm.message = message;
      }
      if (inputs) {
        confirm.inputs = inputs;
      }
      let alert = this.alertCtrl.create(confirm);
      alert.present();
    });
  }

  /**
   * 设置api加载状态
   * @param data 
   * @param loading  boolean
   * @param error 
   */
  setApiLoading(data,loading:boolean=false,error:boolean=false) {
    data.loading = loading;
    data.error = error;
  }




  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }

  /**为manctrl提供时间转换*/
  setDateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string { 
    return Utils.dateFormat(date,sFormat)
  }


   //金钱格式化
   formatMoney(number, places?, symbol?, thousand?, decimal?) {
      number = number || 0;
      places = !isNaN(places = Math.abs(places)) ? places : 2;
      symbol = symbol !== undefined ? symbol : "￥";
      thousand = thousand || ",";
      decimal = decimal || ".";
      var negative = number < 0 ? "-" : "",
          i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
          j = (j = i.length) > 3 ? j % 3 : 0;
      return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number -parseFloat(i)).toFixed(places).slice(2) : "");
  }

  /**
   * 每次调用sequence加1
   * @type {()=>number}
   */
  static getSequence = (function () {
    let sequence = 1;
    return function () {
      return ++sequence;
    };
  })();

  /**
   * 返回字符串长度，中文计数为2
   * @param str
   * @returns {number}
   */
  static strLength(str: string): number {
    let len = 0;
    for (let i = 0, length = str.length; i < length; i++) {
      str.charCodeAt(i) > 255 ? len += 2 : len++;
    }
    return len;
  }



  
  /** 产生一个随机的32位长度字符串 */
  static uuid() {
    let text = "";
    let possible = "abcdef0123456789";
    for (let i = 0; i < 19; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + new Date().getTime();
  }
}
