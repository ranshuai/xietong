import {Component, ElementRef, ViewChild} from '@angular/core';
import {App, Events} from "ionic-angular";
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";
import {HttpService} from "../../providers/HttpService";
import {HttpConfig} from "../../providers/HttpConfig";
import {CommonModel} from "../../providers/CommonModel";

declare var RongIMLib: any;
declare var RongIMClient: any;
declare var MessageType: any;
declare var TextMessage: any;
/**
 * Generated class for the RongimMessageComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'rongim-message',
  templateUrl: 'rongim-message.html'
})
export class RongimMessageComponent {

    //-----融云相关start by mwh------
    @ViewChild('notice_msg')
    notice_msgEle: ElementRef;//音频
    @ViewChild('notifyBar')
    notifyBarEle: ElementRef;//弹窗
    nativeNotice: any;//悬浮通知声音对象
    notifyBar: any;//悬浮通知栏
    showNotifyBar = false;//是否显示弹窗
    isChatPage=false;
    //新消息弹窗item
    item = {
        beUserId: 1,
        senderUserId: 1,
        userName: "断水流大师兄",
        headPic: "./assets/images/sns/dashixiong.jpg",
        recentlyChat: "我想和你困觉",
        updateTime: "17:08",
        messageId: "",
        clientId:"",
        time:0,
        msgStatus:"success"//消息状态
    };
    //-----融云相关end by mwh------

  constructor( private events: Events, private httpService: HttpService,public httpConfig: HttpConfig,
               private commonModel: CommonModel,private appCtrl: App) {
      console.log('Hello RongimMessageComponent Component');
      this.appCtrl.viewWillEnter.subscribe((view) => {
            console.log("当前路由是：--------------",view.instance.constructor.name);
            if(view.instance.constructor.name=="ChatPage"){
                this.isChatPage=true;
            }
        });
      //选择用户--测试用
      //    this.roleSelectActionSheet();
      //监听融云登录事件
      this.events.subscribe("RongIMLogin", (data) => {
          if(window.localStorage.getItem('isGetRongIMToken')!='true'){
          window.localStorage.setItem('isGetRongIMToken',"true");
          this.initRongIM();
          let token = JSON.parse(data).token;
          console.log("监听到融云登录事件，接收到的token：", token);
          this.connectRongIM(token);
          }
      });
  //    监听融云退出 事件
      this.events.subscribe("RongIMLogout",()=>{
          console.log("监听到融云退出事件");
          // 接收到两次退出事件，需处理防止报错
 
          try {
              if(window.localStorage.getItem('isRongIMConnected')=="true"){
                  if (RongIMLib && RongIMLib.RongIMClient) {
                      RongIMLib.RongIMClient.getInstance().logout();
                      window.localStorage.setItem('isRongIMConnected',"false");
                      window.localStorage.setItem('isGetRongIMToken',"false");
                      (<any>window).IMUserId="";
                      console.log("退出融云成功！");
                  }
              }
              // RongIMClient.getInstance().logout();
          }catch(e){
              console.log("融云退出异常");
          }

 

      });
  }
ngAfterViewInit(){
    //通知元素
    this.nativeNotice = this.notice_msgEle.nativeElement;
    this.notifyBar = this.notifyBarEle.nativeElement;
}

    /**
     * 悬浮通知 动画
     * @param ele
     * @param json
     * @param fn
     */
    animate(ele, json, fn?) {
        let self = this;
        //            清除定时器
        clearInterval(ele.timer);
        ele.timer = setInterval(function () {
            var flag = true;
            //                循环遍历每个属性
            for (var a in json) {
                var target = json[a];
                var currentValue;
                //                    当获取不到对应属性时为NaN，为了避免出错，或上0。若能获取到，它是带px单位的，需要转化为整数
                //                    判断属性，如果是opacity需要特殊处理

                if (a === "opacity") {
                    currentValue = self.getAttrValue(ele, a) * 100;
                } else {
                    currentValue = parseInt(self.getAttrValue(ele, a));
                }

                var step = (target - currentValue) / 10 || 0;
                step = target > currentValue ? Math.ceil(step) : Math.floor(step);

                //                    如果是opacity,需要特殊处理
                if (a === "opacity") {
                    ele.style[a] = (currentValue + step) / 100;
                    //                        兼容IE6,7,8,使用百分制
                    ele.style.filter = "alpha(opacity=" + (currentValue + step) + ")";
                } else if (a === "zIndex") {//如果是层级zIndex，直接复制， 不需要缓动动画
                    //                        ele.style.zIndex=json[a];

                    ele.style[a] = json[a];
                } else {
                    ele.style[a] = currentValue + step + "px";
                }


                //                     如果当前值和目标值大于一个步长，则标记为false
                if (Math.abs(currentValue - target) > step) {
                    flag = false;
                } else {
                    //                        如果当前值和目标值差值小于一个步长了，则设置为目标值
                    if (a === "opacity") {
                        ele.style[a] = target / 100;
                        //                        兼容IE6,7,8,使用百分制

                        ele.style.filter = "alpha(opacity=" + target + ")";
                    } else {
                        ele.style[a] = target;
                    }

                }
            }
            //            当所有属性动画执行完，标识为true时，则清除定时器
            if (flag) {
                clearInterval(ele.timer);
                if (fn) {
                    fn();
                }
            }
        }, 20);

    }

    //        获取当前属性值
    getAttrValue(ele, attr) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(ele, null)[attr];
        } else {

            //                兼容IE

            return ele.currentStyle[attr];
        }
    }

    /**
     * 获取聊天用户信息
     * @param userId
     * @returns {{userId: any; nickName: string; headPic: string}}
     */
    getUserInfo(userId) {
        /* let nickName=userId==this.commonModel._userId?this.commonModel._userNickName:this.commonModel._targetNickName;
         return {
             "userId":userId,
             "nickName":nickName,
             "headPic":""
         }

         return {
                           "userId":data.userId,
                           "nickName":data.nickName,
                           "headPic":data.headPic
                       }
                       */
        return new Observable((observer: Subscriber<any>) => {
            this.httpService.get(this.httpConfig.host.org + "sns/user/getUserInfo", { "userId": userId })
                .subscribe((data) => {
                    if (data.success) {
                        console.log("sns获取个人资料,服务器返回数据：", data);
                        observer.next(data);

                    } else {
                        // observer.next(null);
                        observer.next({
                            "userId": userId,
                            "nickName": "test",
                            "headPic": ""
                        });
                    }
                });
        });

    }

    /**
     * 格式化时间
     * @param msgTimestamp
     * @returns {any}
     */
    parseTime(msgTimestamp){
        let weekArr=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
        let nowDate=new Date();
        let  nowTimestamp=nowDate.getTime();
        if(nowTimestamp-msgTimestamp<24*60*60*1000){
            //  显示小时分
            return nowDate.getHours()+":"+nowDate.getMinutes();
        }else if(nowTimestamp-msgTimestamp<48*60*60*1000){
            return "昨天";
        }else if(nowTimestamp-msgTimestamp<168*60*60*1000){
            return weekArr[nowDate.getDay()];
        }else{
            return  nowTimestamp.toLocaleString().replace(/:\d{1,2}$/, ' ')
        }
    }

    /**
     * 初始化融云配置
     * @constructor
     */
    initRongIM() {
        // var appKey = "pkfcgjstpr0r8";//购享客
        var appKey = "0vnjpoad0e1hz";//玖汇
        // var appKey = "25wehl3u29otw";//独角鲸
        console.log("开始初始化融云");
        // var token = "xIrErCRz2PyRtompKtmCqJf2+tBAwjD/88laR/D3lSLOG2ptGJLxVDXeE+xSpVNR4vM+Pqd2ZI8vQxJ44oGafQ==";
        //初始化
        RongIMLib.RongIMClient.init(appKey);

        // 通过配置初始化
        // 表情信息可参考 http://unicode.org/emoji/charts/full-emoji-list.html
        var config = {
            size: 24, // 大小, 默认 24, 建议15 - 55
            url: '//f2e.cn.ronghub.com/sdk/emoji-48.png', // 所有 emoji 的背景图片
            lang: 'zh', // 选择的语言, 默认 zh
            // 扩展表情
            extension: {
                dataSource: {
                    "u1F914":{
                        "en":"thinking face", // 英文名称
                        "zh":"思考", // 中文名称
                        "tag":"🤔", // 原生emoji
                        "position":"0px 0px" // 所在背景图位置坐标
                    }
                },
                // 新增 emoji 的背景图 url
                url: 'https://emojipedia-us.s3.amazonaws.com/thumbs/160/apple/96/thinking-face_1f914.png'
            }
        };
        RongIMLib.RongIMEmoji.init(config);
        /*var list = RongIMLib.RongIMEmoji.list;
        console.log(list);*/
        RongIMClient.setConnectionStatusListener({
        // RongIMClient.getInstance().setConnectionStatusListener({
            onChanged: function (status) {
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        console.log('域名不正确');
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        break;
                }
            }
        });
        // 消息监听器
        RongIMClient.setOnReceiveMessageListener({
        // RongIMClient.getInstance().setOnReceiveMessageListener({

            // 接收到的消息
            onReceived: function (message) {

                console.log("接收到消息了", message.messageType, message, message.content.content);
                if (message.senderUserId == self.commonModel._userId) {
                    //监听到自己发的消息

                    return;
                }

                // 需要根据用户id获取昵称和头像
                /*self.getUserInfo(message.targetId).subscribe((userInfo)=>{
                    if(userInfo){
                        let recTime = new Date(Math.round(message.receivedTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
                        self.item = {
                            userName: userInfo.nickName,
                            messageId: message.messageId,
                            updateTime: recTime,
                            senderUserId: message.senderUserId,
                            // beUserId:message.targetId,//目标id
                            beUserId: JSON.parse(message.content.extra).toUserId,//目标id
                            recentlyChat: message.content.content,
                            headPic: userInfo.headPic || "./assets/images/sns/contact_potrait.jpg"
                        }

                        //将消息发送给聊天页面
                        self.events.publish("recMsg", JSON.stringify(self.item));

                    }
                });*/

                //  (可以从消息中获取)
                // let recTime = new Date(Math.round(message.receivedTime)).toLocaleString().replace(/:\d{1,2}$/, ' ');
                let recTime = self.parseTime(new Date().getTime());
                self.item = {
                    // userName: JSON.parse(message.content.extra).toUserNickName,
                    userName: JSON.parse(message.content.extra).senderNickName,
                    messageId: message.messageId,
                    updateTime: recTime,
                    time: new Date().getTime(),
                    clientId: JSON.parse(message.content.extra).clientId,
                    senderUserId: message.senderUserId,
                    // beUserId:message.targetId,//目标id
                    beUserId: JSON.parse(message.content.extra).toUserId,//目标id
                    // recentlyChat: message.content.content,
                    recentlyChat: decodeURI(message.content.content) ,
                    // headPic: JSON.parse(message.content.extra).toUserHeadPic || "./assets/images/sns/contact_potrait.jpg",
                    headPic:JSON.parse(message.content.extra).senderHeadPic || "./assets/images/public/anonymity.png",
                    msgStatus:"success"//消息状态
                }
                console.log("接收到的消息是：", self.item );
                //将消息发送给聊天页面
                self.events.publish("recMsg", JSON.stringify(self.item));

                //标记有新消息
                window.localStorage.setItem("hasUnread",'true');
                // 播放通知声音
                if (self.nativeNotice != null && self.nativeNotice !== undefined) {
                    self.nativeNotice.play();
                }
                //如果当前在聊天页面或者会话列表页面则不弹窗.如果消息正是当前好友聊天窗口则不弹
                // if(!this.isChatPage){

                let friendId=window.localStorage.getItem("friendId");
                if(window.localStorage.getItem("currentPage")!='chat-in'&&window.localStorage.getItem("currentPage")!='recentChat-in'  //非会话页、非聊天页
                ||(window.localStorage.getItem("currentPage")=='chat-in'&&friendId&&friendId!=message.senderUserId//聊天页，非当前好友
                )){
                    self.showNotifyBar = true;

                /*if(window.localStorage.getItem("currentPage")=='chat-in'&&friendId&&friendId!=message.senderUserId||window.localStorage.getItem("currentPage")!='chat-in'){
                //    非当前聊天窗口消息或聊天页非该好友，标记有新消息
                    window.localStorage.setItem("hasUnread",'true');
                };*/


                var json = {
                    "top": 0, "opacity": 100//传递透明度值最好是百分制，方便计算
                }
                // self.animate(self.notifyBar,json);
                self.animate(self.notifyBar, json, function () {
                    var json = {
                        "top": -80, "opacity": 0//传递透明度值最好是百分制，方便计算
                    }
                    setTimeout(function () {
                        self.animate(self.notifyBar, json);
                    }, 1500);

                });
                }

                // 判断消息类型
                switch (message.messageType) {
                    // case RongIMClient.MessageType.TextMessage:
                    case "TextMessage":
                        // message.content.content => 消息内容
                        console.log("接收到" + message.senderUserId + "发送的消息了,内容是：",
                            message.content.content);
                        break;
                    case RongIMClient.MessageType.VoiceMessage:
                        // 对声音进行预加载
                        // message.content.content 格式为 AMR 格式的 base64 码
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        // message.content.content => 图片缩略图 base64。
                        // message.content.imageUri => 原图 URL。
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // message.content.extension => 讨论组中的人员。
                        break;
                    case RongIMClient.MessageType.LocationMessage:
                        // message.content.latiude => 纬度。
                        // message.content.longitude => 经度。
                        // message.content.content => 位置图片 base64。
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        // message.content.content => 文本消息内容。
                        // message.content.imageUri => 图片 base64。
                        // message.content.url => 原图 URL。
                        break;
                    case RongIMClient.MessageType.InformationNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ContactNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ProfileNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.UnknownMessage:
                        // do something...
                        break;
                    default:
                    // do something...
                }
            }
        });
        let self = this;


    }


    /**
     * 发送消息
     */
    sendMessage(_targetId, _msgContent,clientId) {
        var self = this;
        // var msg = new RongIMLib.TextMessage({content:"hello RongCloud!",extra:"附加信息"});
        var msg = new RongIMLib.TextMessage({ _msgContent, extra: "附加信息" });
        var conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
        console.log("即将发送消息给" + _targetId + "：" + _msgContent);
        RongIMClient.getInstance().sendMessage(conversationtype, _targetId, msg, {
                onSuccess: function (message) {
                    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    console.log(self.commonModel._userId + "发送给" + _targetId + "消息成功!");
                    //  保存消息到服务器
                    self.httpService.post(self.httpService.config.host.org + '/sns/history/',
                        {
                            "toUserId": _targetId, //接收方用户id
                            "message": _msgContent,
                            "clientId":clientId
                        }).subscribe((data) => {
                        console.log("保存消息接口服务器返回：", data);
                        if (data.success) {
                            console.log("保存消息到服务器成功");

                        }
                    })
                },
                onError: function (errorCode, message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = "x";
                            break;
                    }
                    console.log('发送失败:' + info);

                }
            }
        );
    }


    /**
     * 登录融云
     * @param token
     */
    connectRongIM(token) {
        let self = this;
        //获取服务器token无效，无法连接.写假数据判断
        /*if(this.commonModel._userId=="75816"){
            token="LZK5PWOUWaUOntAiVwg7tT7TTvv+QVS7Dcwv2vn8BeE9AjymRT8rvQwocL8oAPmtHzILZIjUE/CfMXtH/JwYOg==";
        }else if(this.commonModel._userId=="75807"){
            token="vUBP466EsxoLGfIUcH/1qB0nnmDHSIz22gmw/k7VTIK1wFz8M2JT9lpLgnX3/AoWmpNfqq1Ts63qUtbgYnBY8g==";
        }*/
        RongIMClient.connect(token, {
            onSuccess: function (userId) {
                window.localStorage.setItem('isRongIMConnected',"true");
                console.log("用户" + userId + "连接融云成功！");
                (<any>window).IMUserId=userId;
                //  发送消息
                // self.sendMessage(75807,"你好啊");
            },
            onTokenIncorrect: function () {
                console.log('token无效');
            },
            onError: function (errorCode) {
                var info = '';
                (<any>window).IMUserId="";
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                        info = '不可接受的协议版本';
                        break;
                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                        info = 'appkey不正确';
                        break;
                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                        info = '服务器不可用';
                        break;
                }
                console.log(errorCode);
            }
        });
    }

    /**
     * 进入聊天页面
     * @param userId
     * @param nickName
     * @param headPic
     */

    goTochat(userId, nickName, headPic) {
        this.showNotifyBar = false;
        console.log("通知栏被点击了");
        /*this.nav.push("ChatPage", {
            "toUserId": userId,
            "toUserName": nickName,
            "headPic": headPic
        })*/
        this.appCtrl.getRootNav().push("ChatPage", {
            "toUserId": userId,
            "toUserName": nickName,
            "headPic": headPic
        })
    }


    /**
     * 点击悬浮通知栏
     * @param event
     */

    notifyClick(event) {
        this.showNotifyBar = false;
        console.log("通知栏被点击了");

    }
}
