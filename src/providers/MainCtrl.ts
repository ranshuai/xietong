/**
 * Created by 61538187@qq.com on 2017/12/02.
 */
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { NativeService } from "./NativeService";
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Http, Response, RequestOptions } from "@angular/http";
import { Utils } from "./Utils";
import { Logger } from "./Logger";
import { AlertController, LoadingController, App, Events } from "ionic-angular";
import { CommonModel } from "./CommonModel";
import { HttpService } from "../providers/HttpService";
import { ThirdPartyApiProvider } from "./third-party-api";
import { FUNDEBUG_API_KEY } from "./Constants"
declare var Media: any;
import * as fundebug from "fundebug-javascript";
// 融云聊天相关
declare var RongIMLib: any;
declare var RongIMClient: any;
declare var MessageType: any;
declare var TextMessage: any;
export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}
export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}

/**
 * MainCtrl类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class MainCtrl {
  tabs;//当前所属模块tabs
  my_media;//音频播放对象
  mediaFlag;//播放样式
  mediaTimer;//问答播放定时器
  mediaMsg = {
    id: 0,//当前播放的音频ID
    flag: 0,    //当前播放状态
    duration: 0,//音频总时长
    position: 0,//当前播放时间
    progress: 0, //当前播放进度
  }//播放对象信息
  constructor(private http: Http,
    public logger: Logger,
    private alertCtrl: AlertController,
    public httpService: HttpService,
    public nativeService: NativeService,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public commonModel: CommonModel,
    public thirdPartyApi: ThirdPartyApiProvider,
    private appCtrl: App,
    public utils: Utils,
    public events: Events
  ) {
  }



  /**
   * 设置根页面 优化tabs跳转tabs 设置失败
   * @param page 
   */
  setRootPage(page) {
    this.appCtrl.getRootNav().setRoot('SpringboardPage', {
      type: 'root',
      page: page
    },
      { animate: false }
    ).then(() => {
      this.appCtrl.getRootNav().popToRoot();
    })
  }

  /**
   * 返回到指定页面  要跳转的页面必须有pageName字段
   * @param pageName 
   */
  popToPage(pageName) {
    this.appCtrl.getRootNav().getViews().forEach((data, index) => {
      if (data.instance.pages == pageName) {
        this.appCtrl.getRootNav().popTo(data);
      }
    })
  }


  /**
   * 微信跳转的时候需要先判断二级页面所属根页面 然后跳转二级页面
   * @param rootPage 设置跟页面
   * @param page  跳转二级页面
   */
  goPage(rootPage, page?) {
    this.appCtrl.getRootNav().setRoot(rootPage, {},
      { animate: false }
    ).then(() => {
      if (page) {
        this.appCtrl.getRootNav().push(page.name, page.data);
      } else {
        this.appCtrl.getRootNav().popToRoot();
      }
    })
  }

  /**
   * 返回此导航控制器中当前的视图堆栈
   */
  getAppViews() {
    return this.appCtrl.getRootNav().getViews();
  }

  /**
   * 返回到根页面
   */
  popRoot() { 
    this.appCtrl.getRootNav().popToRoot();
  }

  /**
   * 动态设置APP头部平台信息
   */
  setPlatfrom() {
    if (this.nativeService.isMobile()) {
      if (this.nativeService.isAndroid()) {
        this.httpService.config.platform = 'android';
      }
      if (this.nativeService.isIos()) {
        this.httpService.config.platform = 'ios';
      }
      //如果是手机就删除此缓存记录 hashUrl 只针对浏览器 
      window.localStorage.removeItem('hashUrl')   
    } else {
      //微信设置 space    以及设置platform类型
      var ua = window.navigator.userAgent.toLowerCase();
      let micro: any = "micromessenger";
      if (ua.match(/MicroMessenger/i) == micro) {
        //动态设置openId
        if (window.localStorage.getItem('openId')) {
          this.httpService.config.openId = window.localStorage.getItem('openId');
          window.localStorage.removeItem('openId')
        }
        this.httpService.config.platform = 'wx';
      } else {
        this.httpService.config.platform = 'web';
      }
    }

      
    this.httpService.config.space = (<any>window).colink.space;
    this.httpService.config.storeId = (<any>window).colink.storeId;
    this.httpService.config.clientType = (<any>window).colink.clientType;
    switch ((<any>window).colink.host) {
      case 'test':
        this.httpService.config.host = this.httpService.config.hostList.test;
          break;
      case 'dev':
      this.httpService.config.host = this.httpService.config.hostList.dev;
          break;
      case 'prod':
      this.httpService.config.host = this.httpService.config.hostList.prod;
        break;
      default :
      this.httpService.config.host = this.httpService.config.hostList.test;
        break;
  }

    //设置本机UUID
    this.httpService.config.uuid = this.nativeService.getUUId();

    //初始化FUNDEBUG信息
    fundebug.apikey = FUNDEBUG_API_KEY;
    this.httpService.IS_DEBUG = this.isDeBUG();
    fundebug.releasestage = this.httpService.IS_DEBUG ? 'development' : 'production';//应用开发阶段，development:开发;production:生产
    fundebug.silent = this.httpService.IS_DEBUG;//如果暂时不需要使用Fundebug，将silent属性设为true
    if (!this.httpService.IS_DEBUG && this.nativeService.isMobile()) {//设置日志监控app的版本号
      this.nativeService.getVersionNumber().subscribe(version => {
        fundebug.appversion = version;
      })
    }
  }

  

  /**
   * 设置用户信息
   * @param data getUserInfo返回的用户数据信息
   */ 
  setUserInfo(data) { 
    if (data.success) {
      if (this.nativeService.isMobile()) { 
        var user = {
          userId: data.result.userId,
          space: this.httpService.config.space,
          IS_DEBUG: this.httpService.IS_DEBUG,
          clientType:this.httpService.config.clientType
        }
        window.localStorage.setItem('APP_USER_INFO', JSON.stringify(user));
        window.localStorage.setItem('userId', data.result.userId);
        this.commonModel.userId = data.result.userId;
        this.commonModel.TAB_INIT_USERINFO = data.result;
      } else {
        this.commonModel.userId = data.result.userId;
        this.commonModel.TAB_INIT_USERINFO = data.result;
        window.localStorage.setItem('userId', data.result.userId);
        
      }
    }
  }
 
  /**
   * 清除缓存用户信息
   */
  clearUserInfo() { 
    if (window.localStorage.getItem('APP_USER_INFO')) { 
      window.localStorage.removeItem('APP_USER_INFO')
    }
    if (window.localStorage.getItem('userId')) { 
      window.localStorage.removeItem('userId')
    }
    var obj: any;
    this.commonModel.userId = "";
    this.commonModel.TAB_INIT_USERINFO = obj;
  }

  /** 
   * 获取公用用户信息方法
   */
  getUserInfo() {
    return new Observable((observer: Subscriber<any>) => {
      this.httpService.get(this.httpService.config.host.org + 'user/userinfo').subscribe(data => {
        this.setUserInfo(data)
        observer.next(data);
      });
    })
  }

  /**
   * 图片格式化
   * imgUrl 图片路径
   * speac 初始化规格 '?x-oss-process=image/resize,m_fixed,h_142,w_142'
  */
  imgFilter(imgUrl?, speac?) {
    if (!imgUrl) { 
      return false;
    }
    if (!speac) { 
      return imgUrl;
    }
    return imgUrl + speac;
}

  /**
   * 动态监测当前是否是正式
   * https://b.snsall.com 为配置未见正式的一个接口地址
   */
  isDeBUG() {
    if (this.httpService.config.host.bl.indexOf('https://b.snsall.com') > -1) {
      return false
    } else {
      return true
    }
  }

  /**
   * 获取微信授权信息
   */
  getWechatImpower() {
    return new Observable((observer: Subscriber<any>) => {
      this.httpService.get(this.httpService.config.host.org + 'v2/auth2/userAccessTokenBefore', {
        type: 1 //授权成功默认返回首页
      }).subscribe(data => {
        observer.next(data);
      })
    });
  }

  /**
   * 获取表情
   * @param emojiList
   * @returns {Array}
   */
  getEmojis(emojiList?) {
    /* 能完整显示的emoji --勿删--
    const EMOJIS = "😀 😃 😄 😁 😆 😅 😂 ☺" +
        "️😊 😇 🙂 🙃 😉 😌 😍 😘" +
        " 😗 😙 😚 😋 😜 😝 😛 🤑" +
        " 🤗 🤓 😎 😏 😒 😞 😔 😟 " +
        "😕 🙁 😣 😖 😫 😩 😤 😠 " +
        "😡 😶 😐 😑 😯 😦 😧 😮 " +
        "😲 😵 😳 😱 😨 😰 😢 😥 " +
        "😭 😓 😪 😴 🙄 🤔 😬 🤐 " +
        "😷 🤒 🤕 😈 👿 👹 👺 💩 " +
        "👻 💀 ☠️👽 👾 🤖 🎃 😺" +
        " 😸 😹 😻 😼 😽 🙀 😿 😾" +
        " 👐 🙌 👏 🙏 👍 👎 👊 ✊" +
        " 👌 👈 👉 👆 👇 ☝️" +
        "✋ 🖐 🖖 👋 💪 🖕 💅 🖖 💄 " +
        "💋 👅 👂 👃 👣 👁 👀 🗣" +
        " 👤 👥 👶 👦 👧 👨 👩 👱‍" +
        " 👴 👵 👲 👳‍️👳 👮 " +
        "👷‍️👷 💂 🍳" +
        " ‍🎤 ‍🏫‍ ‍" +
        "👸 👰 👼 🙇 💁 🙅 🙆 🙋" +
      " 🙎 🙍 💇 💆 🕴 💃 👯 🚶 " +
        "🏃 👫 👭 👬 💑 💏 " +
        "👪 " +
        "👚 👕 👖 👔 " +
        "👗 👙 👘 👡 👢 👞 👟 👒" +
        " 🎩 🎓 👑 ⛑ 🎒 👝 👛 👜" +
        " 💼 👓 🕶 🌂 ☂️";*/
      // 兼容android部分机型
     /* const EMOJIS = "😀 😃 😄 😁 😆 😅 😂 ☺" +
          "️😊 😇 😉 😌 😍 😘" +
          " 😗 😙 😚 😋 😜 😝 😛" +
          " 😎 😏 😒 😞 😔 😟 " +
          "😕 😣 😖 😫 😩 😤 😠 " +
          "😡 😶 😐 😑 😯 😦 😧 😮 " +
          "😲 😵 😳 😱 😰 😢 😥 " +
          "😭 😓 😪 😴 😬 " +
          "😷 😈 👿 👹 👺 💩 " +
          "👻 💀 ☠️👽 👾 🎃 😺" +
          " 😸 😹 😻 😼 😽 🙀 😿 😾" +
          " 👐 🙌 👏 🙏 👍 👎 👊 ✊" +
          " 👌 👈 👉 👆 👇 ☝️" +
          "✋ 👋 💪 💅 💄 " +
          "💋 👅 👂 👃 👣 👀" +
          " 👤 👥 👶 👦 👧 👨 👩 👱‍" +
          " 👴 👵 👲 👳‍️👳 👮 " +
          "👷‍️👷 💂 🍳" +
          " ‍🎤 ‍🏫‍ ‍" +
          "👸 👰 👼 🙇 💁 🙅 🙆 🙋" +
        " 🙎 🙍 💇 💆 💃 👯 🚶 " +
          "🏃 👫 👭 👬 💑 💏 " +
          "👪 " +
          "👚 👕 👖 👔 " +
          "👗 👙 👘 👡 👢 👞 👟 👒" +
          " 🎩 🎓 👑 ⛑ 🎒 👝 👛 👜" +
          " 💼 👓 🌂 ☂️";*/
      const  EMOJIS="😀 😁 😂 😃 😅 😆 😇 😈 😉 😑 😒 😓 😔 😕 😖 😘 😡 😭 😣 😤 😨 😩 😰 😱 😲 😳 😴 😵 😶 😷 🎤 🎲 🎵 🏀 🏂 🏡 🀄 💡 💢 💣 💤 💩 💪 💰 📚 📞 📢 🚫 🚿 🌏 🌻 🍚 🍫 🍻 👊 👌 👍 👎 👏 👪 👫 😬 👻 👼 👽 👿 💊 💋 💍 🔫 😊 😋 😌 😍 😎 😏 😚 😜 😝 😞 😟 😪 😫 😢 😯 🙊 🙏 🌙 🌲 🌹 🍉 🍖 🍦 🍷 🎁 🎂 🎄 🎉 🎓 🐴 🐶 🐷 👑 💄 💔 🔥 🕖 🙈 🙉 🚀 ⭐ ⏰ ⏳ ⚡ ⚽ ⛄ ⛅ ☝ ☺ ✊ ✋ ✌ ✏ ☀ ☁ ☔ ☕ ❄ 🤔"
    let EmojiArr = EMOJIS.split(' ');

    let groupNum = Math.ceil(EmojiArr.length / (24));
    let items = [];
    let flagArr=[];
    // 记录每个面板最后一个位置
    for(let i=0;i<EmojiArr.length;i++){
      if (i ==EmojiArr.length-1){
        flagArr.push(i);
      }else  if(i>0&&(i+1)%24==0){
        flagArr.push(i);
      }
    }
    //往指定位置插入空格，没循环一次，要插入的角标位置-1
    for (let j=0;j<flagArr.length-1;j++){
      // EmojiArr.splice(flagArr[j]-j,0," ");
      console.log("要插入删除按钮的位置：",flagArr[j]);
      EmojiArr.splice(flagArr[j],0," ");
    }
    EmojiArr[EmojiArr.length]=" ";
    for (let i = 0; i < groupNum; i++) {
      items.push(EmojiArr.slice(i * 24, (i + 1) * 24));
    }
    return items
  }
  /**
   * 获取融云表情
   * @param emojiList
   * @returns {Array}
   */
  getRongIMEmojis(emojiList) {
    let groupNum = Math.ceil(emojiList.length / (24));
    let items = [];

    for (let i = 0; i < groupNum; i++) {
      items.push(emojiList.slice(i * 24, (i + 1) * 24));
    }

    return items
  }

  /**
   * 模拟新消息
   * @param msg
   */
  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
      status: 'success',
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, Date.now())
    }, Math.random() * 1800)
  }

  /**
   * 获取消息列表
   * @returns {Promise<ChatMessage[]>}
   */
  getMsgList(): Promise<ChatMessage[]> {
    const msgListUrl = './assets/json/sns/msg-list.json';
    return this.http.get(msgListUrl)
      .toPromise()
      .then(response => response.json().array as ChatMessage[])
      .catch(err => Promise.reject(err || 'err'));
  }

  /**
   * 发送消息
   * @param {ChatMessage} msg
   * @returns {Promise<any>}
   */
  sendMsg(msg: ChatMessage) {
    return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
      .then(() => this.mockNewMsg(msg));
  }

  /**
   * 获取聊天用户信息
   * @returns {Promise<UserInfo>}
   */
  getChatUserInfo(): Promise<UserInfo> {
    let _TAB_INIT_USERINFO = this.commonModel._TAB_INIT_USERINFO ||
      JSON.parse(window.localStorage.getItem("_TAB_INIT_USERINFO"));
    const userInfo: UserInfo = {
      id: this.commonModel._userId,
      name: _TAB_INIT_USERINFO.nickname,
      avatar: _TAB_INIT_USERINFO.headPic
    };
    return new Promise(resolve => resolve(userInfo));
  }


  /**
   * 余额支付
   * @param orderNo 
   * @param payType 
   * @param description 
   * @param payPassWord 
   */
  balancePay(orderNo, payType, description?, payPassWord?) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '支付中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.httpService.post(this.httpService.config.host.bl + 'payment/balance', {
        description: description || "{ parent: true }",
        orderNo: orderNo,
        payPassWord: payPassWord || "",
        payType: payType
      }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next(data);
        } else {
          this.nativeService.showToast(data.msg || '支付失败,请稍后再试~')
        }
      });
    });
  }

  /**
   * 微信支付
   * @param orderNo 
   * @param type 
   * @param b 
   */
  wxPay(orderNo, type?, b?) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '支付中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      //如果是微信调用微信js的支付
      if (this.httpService.config.platform == 'wx') {
        this.httpService.get(this.httpService.config.host.org + 'v2/weixinPay/wxPayUnifiedorder', {}, { orderSn: orderNo, openId: window.localStorage.openId }).subscribe(data => {
          loading.dismiss();
          if (data.success) {
            if (data.result == 3001) {
              this.nativeService.showToast(data.msg)
              return
            }
            let charge = data.result.weiXinPayVo;
            // charge = JSON.stringify(charge);
            this.thirdPartyApi.wxPay(charge).subscribe(data => {
              if (data) {
                observer.next(data);
              }
            });
          } else {
            this.nativeService.showToast(data.msg || '支付失败,请稍后再试~')
          }
        });
        return
      }
      //如果是APP 调用P++支付
      if (this.httpService.config.platform == 'android' || this.httpService.config.platform == 'ios') {
        this.httpService.post(this.httpService.config.host.bl + 'payment/charge/' + type + '/get', {
          orderSn: orderNo,
          all: b,
          // openId: window.localStorage.openid
        }).subscribe(data => {
          loading.dismiss();
          if (data.success) {
            if (data.result == 3001) {
              this.nativeService.showToast(data.msg)
              return
            }
            let charge = data.result;
            charge = JSON.stringify(charge);
            this.thirdPartyApi.wxPay(charge).subscribe(data => {
              if (data) {
                observer.next(data);
              }
            });
          } else {
            this.nativeService.showToast(data.msg || '支付失败,请稍后再试~')
          }
        });
        return
      }
    });
  }


  /***********财税卡牌 */

  /**知识共享统一获取用户信息**/
  getBrainpowerUserInfo() {
    return new Observable((observer: Subscriber<any>) => {
      this.httpService.get(this.httpService.config.host.bl + this.httpService.config.version + 'ft/userInfo/queryAppUserInfo').subscribe(data => {
        if (data.success) {
          this.commonModel.userInfo = data.result;
        }
        observer.next(data);
      })
    })
  }

  /**
 * 获取领域列表
 */
  queryFieldByDomainNo() {
    return new Observable((observer: Subscriber<any>) => {
      this.httpService.get(this.httpService.config.host.bl + this.httpService.config.version + 'ft/homePage/queryFieldByDomainNo').subscribe(data => {
        if (data.success) {
          this.commonModel.doMain = data.result;
          observer.next(data);
        } else {
          this.nativeService.showToast(data.msg || '网络连接错误')
        }
      });
    });

  }

  /**
 * 点击变色
 * @param e 当前点击对象
 */
  changeClass(e) {
    var evtTarget = e.target || e.srcElement;
    var list = [];
    if (evtTarget.className.indexOf('icons') > -1) {
      list = evtTarget.parentNode.parentNode.children;
    } else {
      list = evtTarget.parentNode.children;
    }
    for (var i = 0; i < list.length; i++) {
      list[i].classList.remove('active')
    }
    if (evtTarget.className.indexOf('icons') > -1) {
      evtTarget.parentNode.classList.add('active')
    } else {
      evtTarget.classList.add('active')
    }
  }


  /**
   * 
   * @param type  "type": 0//类型1=专家 2=问题 3=专题 4=讲堂 5=评论
   * @param item  likesId:“主键id”
   */
  likeNum(type, likesId, item) {//类型，id，item
    if (this.commonModel.userId) {
      var url;
      if (item.isLiked == '1') {//如果是点赞状态，则取消点赞。
        url = 'ft/likes/cancelLikes';
      } else {
        url = 'ft/likes/addLikes';
      }
      this.httpService.post(this.httpService.config.host.bl + this.httpService.config.version + url, {
        likesId: likesId,
        type: type
      }).subscribe(data => {
        if (data.success) {
          if (item.isLiked == '1' || item.isLiked == 1) {
            item.likesCount-- || item.likeNum--;
            item.isLiked = 0;
          } else {
            item.likesCount++ || item.likeNum++;
            item.isLiked = 1;
          }
        } else {
          this.nativeService.showToast(data.msg || '连接超时')
        }
      })
    } else {
      this.appCtrl.getRootNav().push('LoginPage');
    }
  }






  /**
 * 
 * @param querstionId 问题ID
 * @param answerId 答案Id
 */
  createQuestionListen(querstionId, answerId) {
    return new Observable((observer: Subscriber<any>) => {
      // this.config.host.ip+this.config.version
      this.httpService.post(this.httpService.config.host.bl + this.httpService.config.version + 'ft/answerListen/createQuestionListen', {
        querstionId: querstionId,
        answerId: answerId,
      }).subscribe(data => {
        if (data.success) {
          observer.next(data);
        } else {
          this.nativeService.showToast(data.msg || '网络连接错误')
        }
      });
    });
  }

  /**
  * 
  * @param originId  外键的id
  * @param commentType 必传字段 查询的类型 1：课程 2：课程节点 3：活动 4：问题 5：问题回复 6:教师' 评论时需要
  * @param pageNo  页码
  * @param rows  每页的行数
  * @param replyNum 取得回复的条数
  */
  queryAppComments(originId, commentType, pageNo, rows, replyNum) {
    return new Observable((observer: Subscriber<any>) => {
      this.httpService.get(this.httpService.config.host.bl + this.httpService.config.version + 'ft/commentManager/queryAppComments', {
        originId: originId,
        commentType: commentType,
        pageNo: pageNo,
        rows: rows,
        replyNum: replyNum
      }).subscribe(data => {
        if (data.success) {
          observer.next(data);
        } else {
          this.nativeService.showToast(data.msg || '网络连接错误')
        }
      });
    });
  }


  /**
  * 
  * @param id  评论对象的id
  * @param type 必传字段1：课程 2：课程节点 3：专题 4：问题 5：问题回复 6:专家主页
  */
  openPublicReplyModal(id, type) {
    return new Observable((observer: Subscriber<any>) => {
      this.utils.openModal('PublicReplyModal', { id: id, type: type }, {
        showBackdrop: false,
        cssClass: 'ReplyModal'
      }, false).subscribe(
        data => {
          observer.next(data);
        }
        )
    });
  }



  /**
   * @param  data 回复的对象
   */
  openPublicPersonalResponseModal(data) {
    return new Observable((observer: Subscriber<any>) => {
      this.utils.openModal('PublicPersonalResponseModal', data, {
        showBackdrop: false,
        cssClass: 'personalResponse'
      }, false).subscribe(
        data => {
          observer.next(data);
        }
        )
    })
  }

  /**
 *  回答问题
 */
  openPublicReplyAnswerPageModal(id) {
    return new Observable((observer: Subscriber<any>) => {
      this.utils.openModal('PublicReplyAnswerPage', { id: id }, {}, false).subscribe(
        data => {
          observer.next(data);
        }
      )
    })
  }


  /**
  * 
  * @param collectId 主键Id
  * @param collectType   "0=取消关注、收藏1=增加关注、收藏")
  * @param type  1关注  2收藏
  */
  addSysCollect(collectId, collectType, type) {
    return new Observable((observer: Subscriber<any>) => {
      // this.config.host.ip+this.config.version
      this.httpService.post(this.httpService.config.host.bl + this.httpService.config.version + 'sys/collect/addSysCollect', {
        collectId: collectId,
        type: type,
        collectType: collectType == 1 ? 0 : 1
      }).subscribe(data => {
        if (data.success) {
          observer.next(data);
        } else {
          this.nativeService.showToast(data.msg || '网络连接错误')
        }
      });
    });
  }


  /**
   * 
   * @param id 评论对象的id
   * @param type 必传字段1：课程 2：课程节点 3：专题 4：问题 5：问题回复 6:专家主页
   * @param content 	对评论主体评论的内容
   */
  commentByType(id, type, content) {
    return new Observable((observer: Subscriber<any>) => {
      this.httpService.post(this.httpService.config.host.bl + this.httpService.config.version + 'ft/commentManager/commentByType', {
        originId: id,
        type: type,
        content: content,
      }).subscribe(data => {
        if (data.success) {
          observer.next(data);
        } else {
          this.nativeService.showToast(data.msg || '网络连接错误')
        }
      });
    });
  }




  //问答音频播放
  answer_play(id, url) {
    var mediaFlag = this.mediaMsg.flag;
    if (id == this.mediaMsg.id) {
      if (mediaFlag) {
        if (mediaFlag == 2) {
          this.my_media.pause()
        } else if (mediaFlag == 3 || mediaFlag == 4) {
          this.my_media.play()
          this.updateProgress();
        }
      } else {
        this.answer_newPlay(url)
      }

    } else {
      clearInterval(this.mediaTimer);
      this.mediaMsg.id = id;
      this.destructionMedia();
      this.answer_newPlay(url)
    }

  }

  /**
     * 
     * @param url 新建音频播放
     */
  answer_newPlay(url) {
    this.my_media = new Media(url,
      success => {// success callback
        clearInterval(this.mediaTimer);
      },
      error => { // error callback
        clearInterval(this.mediaTimer);
      },
      mediaStatus => {
        // console.log('当前播放状态为' + mediaStatus)
        // 1加载中 2播放中  3暂停 4 结束  
        this.mediaMsg.flag = mediaStatus;
        if (mediaStatus == '2') {
          console.log('当前状态为播放中')
        }
        if (mediaStatus == '3') {
          console.log('当前状态为暂停')
        }
        if (mediaStatus == '4') {
          console.log('当前播放已结束')
        }
      }
    );
    this.mediaMsg.progress = 0;
    // Get duration
    var counter = 0;
    var timerDur = setInterval(() => {
      counter = counter + 100;
      if (counter > 5000) {
        clearInterval(timerDur);
      }
      var dur = this.my_media.getDuration();

      if (dur > 0) {
        console.log('获取音频时长')
        this.mediaMsg.duration = dur;
        this.updateProgress();
        clearInterval(timerDur);
      }
    }, 100);
    this.my_media.play();
  }



  //播放进度
  updateProgress() {
    //每隔一秒更新当前播放时间和进度条
    this.mediaTimer = setInterval(() => {
      if (this.my_media) {
        this.my_media.getCurrentPosition(
          // success callback
          position => {
            if (position > 0) {//当前播放时间 63.344
              this.mediaMsg.progress = Math.floor((position / this.mediaMsg.duration * 100));
              this.mediaMsg.position = position;
              if ((this.mediaMsg.duration - position) <= 1) {
                this.mediaMsg.progress = 0;
                clearInterval(this.mediaTimer);
              }
            }
          },
          e => {
            //如果错误则清除更新播放时间定时器
            clearInterval(this.mediaTimer);
          }
        );
      }
    }, 1000);
  }



  //录音的时候用的
  play(recordUrl) {
    if (this.my_media) {
      this.my_media.stop();
      this.my_media.release();
    }
    this.my_media = new Media(recordUrl,
      success => {

      },
      error => {

      }
    );
    this.my_media.play();
  }


  //销毁音频
  destructionMedia() {
    if (this.my_media) {
      this.mediaFlag = null;
      this.my_media.stop();
      this.my_media.release();
    }
  }

}
