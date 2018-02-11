import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {App, IonicApp, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Events, Content, TextInput, ActionSheetController} from 'ionic-angular';
import {ChatMessage, UserInfo} from "../../../providers/MainCtrl";
import {CommonModel} from "../../../providers/CommonModel";
import {MainCtrl} from "../../../providers/MainCtrl";
import {ThirdPartyApiProvider} from "../../../providers/third-party-api";
import {HttpService} from "../../../providers/HttpService";
import {HttpConfig} from "../../../providers/HttpConfig";
import {Camera, CameraOptions} from "@ionic-native/camera";
import { GalleryModal } from 'ionic-gallery-modal';
declare var RongIMLib: any;
declare var RongIMClient: any;
declare var MessageType: any;
declare var TextMessage: any;

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {
    isFirstIn=true;
    @ViewChild(Content) content: Content;
    @ViewChild('chat_input') messageInput: TextInput;
    @ViewChild('msContent') msgContent: ElementRef;
    @ViewChild('footerContent') footerContent: ElementRef;
    msgList: ChatMessage[] = [];
    user: UserInfo;
    toUser: UserInfo;
    editorMsg = '';
    showEmojiPicker = false;
    isScrolling = false;
    selectImgTime;
    currentTime;//记录当前10条中最新时间，没有则为当前时间
    lastItemTime;//上一次10条中最小时间
    lastItemTimeHide=false;
    extra;
    // 下拉加载
    pageData = {
        pageNo: 1,
        rows: 10,
        loadEnd: false,
        clist: undefined,
        scrollTop: 0
    }
   EMOJIS="😀 😁 😂 😃 😅 😆 😇 😈 😉 😑 😒 😓 😔 😕 😖 😘 😡 😭 😣 😤 😨 😩 😰 😱 😲 😳 😴 😵 😶 😷 🎤 🎲 🎵 🏀 🏂 🏡 🀄 💡 💢 💣 💤 💩 💪 💰 📚 📞 📢 🚫 🚿 🌏 🌻 🍚 🍫 🍻 👊 👌 👍 👎 👏 👪 👫 😬 👻 👼 👽 👿 💊 💋 💍 🔫 😊 😋 😌 😍 😎 😏 😚 😜 😝 😞 😟 😪 😫 😢 😯 🙊 🙏 🌙 🌲 🌹 🍉 🍖 🍦 🍷 🎁 🎂 🎄 🎉 🎓 🐴 🐶 🐷 👑 💄 💔 🔥 🕖 🙈 🙉 🚀 ⭐ ⏰ ⏳ ⚡ ⚽ ⛄ ⛅ ☝ ☺ ✊ ✋ ✌ ✏ ☀ ☁ ☔ ☕ ❄ 🤔"
    EmojiArr;
    constructor(public navParams: NavParams,
                public mainCtrl: MainCtrl,
                public events: Events, public commonModel: CommonModel, public thirdPartyApi: ThirdPartyApiProvider,
                public httpService: HttpService, public httpConfig: HttpConfig,public navCtrl:NavController,
                private renderer: Renderer2, private el: ElementRef,public actionSheetCtrl:ActionSheetController,
                private camera: Camera,public  viewCtrl:ViewController,public ionicApp:IonicApp,public modalCtrl:ModalController) {
        this.EmojiArr = this.EMOJIS.split(' ');

        let self=this;
        this.events.subscribe("emoji-delete",(res)=>{
        //    刪除表情
            this.deleteEmoji();
        });
        // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
        let activePortal = this.ionicApp._modalPortal.getActive();
        if (activePortal) {
            activePortal.dismiss().catch(() => {});
            activePortal.onDidDismiss(() => {});
            return;
        }

        window.addEventListener("native.keyboardshow", function(e){
            console.log("键盘弹起事件",e);
            // this.content.scrollBottom();
            self.scrollToBottom();
            // self.content.scrollTo(0,e["keyboardHeight"]);
            self.footerContent.nativeElement.setElementStyle("bottom",e["keyboardHeight"]);
        });
        window.addEventListener("native.keyboardhide", function(e){
            console.log("键盘隐藏事件",e);
            // this.content.scrollBottom();
            self.scrollToBottom();
            self.footerContent.nativeElement.setElementStyle("bottom",0);
        });

       /* let extra={
            productInfo:{
                goodsName:data.goodsName,
                goods_id:data.goodsId,
                marketPrice:data.marketPrice,
                originalImg:data.originalImg
            }
            ,from:"productDetail"
        };*/
        this.extra=navParams.get("extra");

        // app.platform.fullScreen(true,false);
        // Get mock user information
        //获取当前用户信息
        this.mainCtrl.getChatUserInfo()
            .then((res) => {
                this.user = res
                console.log("当前用户信息：", this.user);
            });
        // Get the navParams toUserId parameter、
        this.toUser = {
            id: navParams.get('toUserId'),
            name: navParams.get('toUserName'),
            avatar: navParams.get('headPic')
        };
        //存储当前聊天窗口好友id
        window.localStorage.setItem("friendId",navParams.get('toUserId'));
        console.log("聊天好友信息：", this.toUser);

        //订阅新消息事件
        this.events.subscribe('recMsg', (msg) => {
            console.log("聊天界面接收到消息事件：", msg);
            msg = JSON.parse(msg);
            //   如果是当前窗口好友发送的则添加
            if (msg.senderUserId == this.toUser.id) {
                // 废弃
                let newMsg: ChatMessage = {
                    messageId: msg.messageId,
                    userId: msg.senderUserId,
                    userName: msg.userName,
                    userAvatar: msg.headPic,
                    toUserId: msg.beUserId,
                    time: msg.updateTime,
                    message: msg.recentlyChat,
                    // status: 'pending'
                    status: 'success'
                };
                let mType=this.getMsgType(msg.recentlyChat);
                //判断消息时间是在十分钟内
                let msgTime=this.msgTimeShow(msg.time,msg.updateTime);
                let msgObj= {
                        "headPic": msg.headPic,
                        "message": msg.recentlyChat,
                        "me": false,
                    "messageType":mType,
                    "clientId":msg.clientId,//消息id
                    // timestamp:msg.updateTime,
                    timestamp:msgTime,
                    time:msg.time,
                    userId: this.user.id,
                    toUserId: this.toUser.id,
                    msgStatus:msg.msgStatus
                    };

                // this.pushNewMsg(newMsg);
                this.addNewMsg(msgObj);
            //    如果当前在聊天页面并且是当前好友发的消息才标记已读
                let friendId=window.localStorage.getItem("friendId");
                if(window.localStorage.getItem("currentPage")=='chat-in'&&friendId&&friendId==this.toUser.id){
            //    标记为已读
                this.setReadStatus();
                }
            }
        });


        // 标记为已读
        this.setReadStatus();
        // 从服务器获取聊天记录
        this.getHistoryChat();
    }

    deleteEmoji(){
        //由于emoji字符长度可能是2或者1，需要判断
        if (this.editorMsg.charAt(this.editorMsg.length-1)==' '){//去掉最后一个空格
            this.editorMsg =this.editorMsg.substring(0,this.editorMsg.length-1);
        }
        if(this.editorMsg.length==1){//字符或者长度为1的emoji，直接删最后一个字符
            this.editorMsg =this.editorMsg.substring(0,this.editorMsg.length-1);
        }else if (this.editorMsg.length>1){//取最后一位或者2位判断是否在emoji集合中
            let charStr1=this.editorMsg.substring(this.editorMsg.length-1);
            let charStr2=this.editorMsg.substring(this.editorMsg.length-2);
            let len=0;
            for (let i=0;i<this.EmojiArr.length;i++){
                    if (this.EmojiArr[i] ==charStr1){
                        len=1;
                        break;
                    }else if (this.EmojiArr[i] ==charStr2){
                        len=2;
                        break;
                    }
            };
        //    根据字符长度截取，如果为0则截取1
            if (len==0){
                this.editorMsg =this.editorMsg.substring(0,this.editorMsg.length-1);
            }else{
                this.editorMsg =this.editorMsg.substring(0,this.editorMsg.length-len);
            }
        }
    }
    /**
     * 进入商品详情页
     * @param extra
     */
    productDetail(extra){
        this.navCtrl.pop();
    }
    /**
     * 十分钟内消息则显示
     * @param time
     * @param timeStr
     */
    msgTimeShow(time,timeStr){
        console.log("msgTimeShow 接收进来参数：",time,timeStr);
    //    判断当前新消息与上一条消息间隔时间
        if(this.pageData.clist&&this.pageData.clist.length>0){//如果有消息
            let lastTime=this.pageData.clist[this.pageData.clist.length-1].time;
            if(time-lastTime<=10*60*1000){
                return "";
            }else{
                return timeStr;
            }
        }else{
            return  timeStr;
        }


    }
    addElement() {
        /*const div = this.renderer.createElement('div');
        const text = this.renderer.createText('Hello world!');

        this.renderer.appendChild(div, text);
        this.renderer.appendChild(this.el.nativeElement, div);*/
        let str="<span class='rong-emoji-content' name='[喜极而泣]' style='width: 24px; height: 24px; line-height: 24px; background-image: url(//f2e.cn.ronghub.com/sdk/emoji-48.png); background-position: -48px 0px; background-size: auto 24px; overflow: hidden; vertical-align: middle; font-size: 0 !important;'>😂</span>";
        // let child = document.createElement("span");
        // child.innerHTML=str;
        // this.msgContent.nativeElement.appendChild(child);


        const li = this.renderer.createElement('span');
        li.innerHTML=str;
        // const text = this.renderer.createText(str);
        // this.renderer.appendChild(li, text);
        if(this.msgContent){
        this.renderer.appendChild(this.msgContent.nativeElement, li);
        }
    }

    loadMore(InfiniteScroll) {
        console.log("加载更多数据");
        this.pageData.loadEnd = false;
        this.getHistoryChat(InfiniteScroll);
    }




    seeUserInfo(msg){
        let nickName=msg.me?this.user.name:this.toUser.name;
        let userId=msg.me?this.user.id:this.toUser.id;
        let headPic=msg.me?this.user.avatar:this.toUser.avatar;
        this.navCtrl.push("SnsUserInfoPage",{
            userId:userId,
            nickName:nickName,headPic:headPic
        })
    }
    /**
     * 设置消息读取状态
     */
    setReadStatus(){
        let url = this.httpConfig.host.org + "/sns/history/" +  this.toUser.id;
        this.httpService.put(url).subscribe(data => {
            if (data.success) {
                console.log("更新消息读取状态成功！");
            } else {
                console.log("更新消息读取状态失败：", data.msg);
            }
        })
    }
    //从服务器获取聊天记录
    getHistoryChat(InfiniteScroll?) {

        if (this.pageData.loadEnd) {
            InfiniteScroll && InfiniteScroll.complete();
            return false;
        }
        if (this.isScrolling) {//正在加载中
            return;
        }
        this.isScrolling = true;
        let url = this.httpConfig.host.org + "/sns/history/" + this.toUser.id;
        let reqData = {
            pageNo: this.pageData.pageNo,
            rows: this.pageData.rows,
        };

        this.httpService.get(url, reqData).subscribe(data => {
            if (data.success) {
                if(data.result.length>0){

                /*if(this.pageData.pageNo==1){//第一页为当前时间
                    // this.currentTime=new Date().getTime();
                    this.currentTime=data.result[data.result.length-1].time;
                }*/
                /*else{
                    this.currentTime=this.lastItemTime;//上一页第一条记录
                }*/
                /* data.result.forEach((item,index)=>{
                     //    增加消息类型
                     item["messageType"]=this.getMsgType(item.message);

                 });*/
                //   遍历，如果两个时间点小于10分钟，则隐藏时间
                for(let i=data.result.length;i>0;i--){
                    if(this.pageData.pageNo==1&&i==data.result.length){
                        continue;
                    }
                    let offTime;
                    if(i==data.result.length){
                        offTime=this.lastItemTime-(data.result[i-1]["time"]);
                    }else{
                        offTime=data.result[i].time-data.result[i-1].time;
                    }
                    if(offTime<10*60*1000){
                        if(i==data.result.length){
                        //   标记隐藏上一页第一个元素时间
                            this.lastItemTimeHide=true;
                        }else{
                        data.result[i].timestamp="";
                        }
                    }
                    //    增加消息类型
                    if(i<data.result.length){
                    data.result[i]["messageType"]=this.getMsgType(data.result[i].message);
                    }
                }
                    this.lastItemTime=data.result[0].time;
                }
            //    顺着推时间，每页第一条时间始终展示，加载一页数据之后，根据末尾时间与上一页第一条时间比较，隐藏第一条时间.
            //    这种方式不行，因为存在相邻之间小于10，但是间隔1个大于10的情况，此时时间不应该被隐藏。
            //    如果类似冒泡的话，也不准确，当加载新页数据，会导致之前判断 不准确。所以只能每次对总的集合进行判断。太消耗性能，暂放
               /* for(let j=0;j<data.result.length;j++){
                    for(let k=j+1;k<data.result.length;k++){
                }*/

            if (data.result.length >= this.pageData.rows) {
                    this.pageData.loadEnd = false;
                } else {
                    this.pageData.loadEnd = true;
                }
                if (this.pageData.pageNo == 1) {
                    this.pageData.clist = data.result;
                } else {
                    // this.pageData.clist = this.pageData.clist.concat(data.result);
                    this.pageData.clist =data.result.concat(this.pageData.clist);
                    if(this.lastItemTimeHide){
                    this.pageData.clist[data.result.length].timestamp="";
                    }
                }
                this.pageData.pageNo++;
                InfiniteScroll && InfiniteScroll.complete();
            } else {
                console.log("从服务器获取聊天记录失败：", data.msg);
            }
            this.isScrolling = false;
            if(this.isFirstIn){//第一次进入获取聊天记录才滚动到底部
                this.scrollToBottom();
            }
            this.lastItemTimeHide=false;
            this.isFirstIn=false;
        })

    }

    ionViewWillEnter(){
        setTimeout(()=>{
            if (this.content)
            this.content.scrollToBottom();
        },400);
    }
    ionViewWillLeave() {
        this.isFirstIn=false;
        // unsubscribe
        window.localStorage.setItem("currentPage","chat-out");
        this.events.unsubscribe('chat:received');

    }
ionViewDidLoad(){
    /*let imgPicker=document.getElementById("userInfoHeader");
    imgPicker.addEventListener("click",(e)=> {
        this.stopPropagation(e);
    })*/
}

     stopPropagation(e) {
        e = e || window.event;
        if(e.stopPropagation) { //W3C阻止冒泡方法
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法
        }
    }

    ionViewDidEnter() {
        this.isFirstIn=true;
        window.localStorage.setItem("currentPage","chat-in");

        console.log("已经进入最近聊天页面");
        //get message list
        /* this.getMsg()
             .then(() => {
                 this.scrollToBottom();
             });*/

        //融云拉取历史记录不可用
        // this.getHistoryMessage();
        // Subscribe to received  new message events
       /* this.events.subscribe('chat:received', msg => {
            this.pushNewMsg(msg);
        })

        let str="<span class='rong-emoji-content' name='[喜极而泣]' style='width: 24px; height: 24px; line-height: 24px; background-image: url(//f2e.cn.ronghub.com/sdk/emoji-48.png); background-position: -48px 0px; background-size: auto 24px; overflow: hidden; vertical-align: middle; font-size: 0 !important;'>😂</span>";
        let child = document.createElement("span");
        child.innerHTML=str;
        this.msgContent.nativeElement.appendChild(child);*/
    }

    /**
     * 监听输入改变
     * @param event
     */
    inputChange(event){
        let str=event.target.value;
        console.log("输入改变了：",str);
        if(this.editorMsg==""){
            console.log("输入框为空");
        }
    }
    onFocus(event) {

        var target = this.messageInput.getNativeElement();
        var footerEle = this.footerContent.nativeElement;
        console.log("当前输入框对象是：",target,this.messageInput._native.nativeElement);
        setTimeout(()=>{

        },400);
        setTimeout(()=>{
            // target.scrollIntoViewIfNeeded();
            // console.log('scrollIntoViewIfNeeded');
            console.log("浏览器高度,键盘高度：", window.innerHeight,footerEle,footerEle.offsetTop);
        },400);

        // this.content.scrollTo(0,event.keyboardHeight);
        console.log("键盘高度：",event.keyboardHeight);
        this.showEmojiPicker = false;
        this.content.resize();
        // this.scrollToBottom();
    //    弹出软键盘
    //     this.messageInput.setFocus();
    }

    //uploadImg
    uploadImg() {
        //由于按钮会触发两次点击，所以判断如果间隔小于1s则认为是重复弹窗
        let offTime=new Date().getTime()-this.selectImgTime;
        console.log("uploadImg触发间隔时间：",offTime);
        if(this.selectImgTime&&offTime<1000){
            return;
        }

        //拍照或从相册选择
        this.imagePicker();

    }

    /**
     * 图片选中上传
     * @param file
     */
    fileChange(file) {
        this.selectImgTime=0;
        // this.thirdPartyApi.uploadImage(file.target.files[0], 'snsImageMsg').subscribe(data => {
        this.thirdPartyApi.uploadImage(file.target.files[0], 'chat').subscribe(imgdata => {
            console.log("上传成功,返回imgdata：",imgdata);
            if (imgdata) {
                console.log("上传图片返回结果:", imgdata);
                //发送图片消息至服务器
                this.sendMessageToServer(null,"ImageMessage",imgdata);
            }
        })
    }

    /**
     * 拍照或从相册选择
     */
    imagePicker() {
        if(this.httpConfig.platform == 'android'||this.httpConfig.platform == 'ios'){
            let actionSheet = this.actionSheetCtrl.create({
                buttons: [
                    {
                        text: '拍照',
                        role: 'destructive',
                        handler: () => {

                            this.selectImgTime=new Date().getTime();
                            this.takePhoto();
                            console.log('用户选择拍照方式');

                        }
                    },{
                        text: '从相册选择',
                        handler: () => {
                            this.selectImgTime=new Date().getTime();
                            // document.getElementById("userInfoHeader").click();
                            document.getElementById("imgUpdate").click();
                        }
                    },{
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            console.log('取消选择图片');
                        }
                    }
                ]
            });
            actionSheet.present();
        }else{
            let imgPicker=document.getElementById("userInfoHeader");
            imgPicker.click();
        }

    }
    imagePicker2() {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照',
                    role: 'destructive',
                    handler: () => {
                       /* let navTransition = actionSheet.dismiss();
                        navTransition.then(() => {
                            this.takePhoto();
                        });*/
                       this.selectImgTime=new Date().getTime();
                        this.takePhoto();
                        console.log('用户选择拍照方式');

                    }
                },{
                    text: '从相册选择',
                    handler: () => {
                        /*let navTransition = actionSheet.dismiss();
                        navTransition.then(() => {
                            setTimeout(()=>{
                                document.getElementById("userInfoHeader").click();
                            },1000);

                        });*/
                        this.selectImgTime=new Date().getTime();
                        // user has clicked the action sheet button
                        // begin the action sheet's dimiss transition
                        let navTransition = actionSheet.dismiss();

                        // start some async method

                            // once the async operation has completed
                            // then run the next nav transition after the
                            // first transition has finished animating out

                            navTransition.then(() => {
                                // this.imgPicker.click();
                                let imgPicker=document.getElementById("userInfoHeader");
                                imgPicker.click();

                                if(actionSheet){
                                    actionSheet.dismiss();
                                }

                            });
                        actionSheet=null;
                        console.log('从相册选择');
                        return false;

                       /* if(actionSheet){
                            actionSheet.dismiss();
                            actionSheet = null;
                        }*/
                       /* imgPicker.addEventListener("click",
                            (e)=>{
                            console.log("被点击了");
                                imgPicker.click();
                                e.stopPropagation();

                        })*/
                       /* setTimeout(()=>{
                            document.getElementById("userInfoHeader").click();
                            // this.uploadImgEle.nativeElement.click();
                        },3000);*/



                    }
                },{
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('取消选择图片');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    /**
     * 拍照
     */
    takePhoto(){
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        }

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            // this.imgUrl=base64Image;
            // console.log("获取到的内容是：",base64Image);
        //    将base64图片上传到服务器
             this.httpService.post(this.httpService.config.host.bl+'upload/base64?type=chat',base64Image).subscribe((data)=>{
                 if(data.success){
                    console.log("上传图片成功",data);
                     //发送图片消息至服务器
                     this.sendMessageToServer(null,"ImageMessage",data.result.unserialize[0]);
                 }
             })
        }, (err) => {
            // Handle error
        });
    }

    /**
     * 发送图片消息至服务器
     * @param uploadImgUrl
     */
    sendImageMsg(uploadImgUrl) {

    }

    switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }
        this.content.resize();
        this.scrollToBottom();
    }

    /**
     * @name getMsg
     * @returns {Promise<ChatMessage[]>}
     */
    getMsg() {
        // Get mock message list
        return this.mainCtrl
            .getMsgList()
            .then(res => {
                this.msgList = res;
            })
            .catch(err => {
                console.log(err)
            })
    }

    getHistoryMessage() {
        //请确保单群聊消息云存储服务开通，且开通后有过收发消息记录
        console.log("RongIMClient:", RongIMClient.getInstance());
        RongIMClient.getInstance().getHistoryMessages(RongIMLib.ConversationType.PRIVATE, this.toUser.id+"",
            1514534742, 20,
            {
                onSuccess: function (list, hasMsg) {
                    // hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
                    // list 为拉取到的历史消息列表
                    console.log("拉取到的历史记录：", list, hasMsg);
                },
                onError: function (error) {
                    // APP未开启消息漫游或处理异常
                    // throw new ERROR ......
                    console.log("拉取到的历史记录错误：", error, error.message);
                }
            });
    }

    /**
     * @name sendMsg
     */
    sendMsg() {
        if (!this.editorMsg.trim()) return;

        // Mock message
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
            toUserId: this.toUser.id,
            time: Date.now(),
            message: this.editorMsg,
            status: 'pending'
        };

        this.pushNewMsg(newMsg);
        this.editorMsg = '';

        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }


        this.mainCtrl.sendMsg(newMsg)
            .then(() => {
                let index = this.getMsgIndexById(id);
                if (index !== -1) {
                    this.msgList[index].status = 'success';
                }
            })
    }

    /**
     * 判断消息类型
     * @param msgContent
     */
    getMsgType(msgContent){
        if(msgContent&&msgContent.indexOf("http://snsall.oss-cn-qingdao.aliyuncs.com")!=-1){
            return "ImageMessage";
        }
        return "TextMessage";
    }

    parseTime(msgTimestamp){
        let weekArr=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
        let nowDate=new Date();
          let  nowTimestamp=nowDate.getTime();
        if(nowTimestamp-msgTimestamp<24*60*60*1000){
        //  显示小时分
        //    getMinutes为啥返回一位数？
            let min=nowDate.getMinutes()<10?"0"+nowDate.getMinutes():nowDate.getMinutes();
            return nowDate.getHours()+":"+min;
        }else if(nowTimestamp-msgTimestamp<48*60*60*1000){
            return "昨天";
        }else if(nowTimestamp-msgTimestamp<168*60*60*1000){
            return weekArr[nowDate.getDay()];
        }else{
            return  nowTimestamp.toLocaleString().replace(/:\d{1,2}$/, ' ')
        }
    }

    /**
     * 保存消息到服务器
     * @param msgContent
     */
    sendMessageToServer(event,msgType, content,btnSend?) {
        let self = this;
        let msgContent;
        if (msgType == "ImageMessage") {//图片消息
            msgContent = content;
        } else {//文本消息
            console.log("点击发送消息按钮：", event.target.value);
            this.editorMsg=this.editorMsg.replace(/[\r\n]/,"");
            msgContent = this.editorMsg;
            //如果为空字符串则不发送
            if(this.editorMsg==''){
                return ;
            }
            if (btnSend){//隐藏表情面板
                this.showEmojiPicker=false;

            }
            // msgContent = RongIMLib.RongIMEmoji.symbolToHTML(this.editorMsg);
        }
        // 废弃
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
            toUserId: this.toUser.id,
            // time: new Date().toLocaleString().replace(/:\d{1,2}$/, ' '),
            time: this.parseTime(new Date().getTime()),
            message: msgContent,
            // status: 'pending'
            status: 'success'
        };
        //  保存消息到服务器
        let messageId=this.getMessageId();
        //判断消息时间是在十分钟内
        let msgTime=this.msgTimeShow( new Date().getTime(),this.parseTime(new Date().getTime()));
        //判断消息类型
        let mType=this.getMsgType(msgContent);
        let msgObj= {
            "headPic": this.user.avatar,
            "message": msgContent,
            "me": true,
            "clientId":messageId,
            "messageType":mType,
            // timestamp:new Date().toLocaleString().replace(/:\d{1,2}$/, ' '),
          /*  timestamp: this.parseTime(new Date().getTime()),
            time: new Date().getTime(),*/
            timestamp: msgTime,
            time:new Date().getTime(),
            userId: this.user.id,
            toUserId: this.toUser.id,
            msgStatus:"success"//默认值
        };

        this.addNewMsg(msgObj);
       /* var divEle = document.createElement('div');
        divEle.innerHTML = '<li>' + msgContent + '</li>';
        var child = divEle.childNodes[0];*/
        /*this.addElement();
        let str="<span class='rong-emoji-content' name='[喜极而泣]' style='width: 24px; height: 24px; line-height: 24px; background-image: url(//f2e.cn.ronghub.com/sdk/emoji-48.png); background-position: -48px 0px; background-size: auto 24px; overflow: hidden; vertical-align: middle; font-size: 0 !important;'>😂</span>";
        let child = document.createElement("span");
        child.innerHTML=str;
         this.msgContent.nativeElement.appendChild(child);*/

       /* if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }*/
        if (msgType == "TextMessage") {
            this.editorMsg = '';
        }


        this.httpService.post(this.httpService.config.host.org + '/sns/history/',
            {
                "toUserId": this.toUser.id, //接收方用户id
                "message": msgContent,
                "clientId":messageId
            }).subscribe((data) => {
            console.log("保存消息接口服务器返回：", data);
            if (data.success) {
                console.log("保存消息到服务器成功");
                //    调用融云发送消息
                this.sendMessageToRongIM(msgType, msgContent,messageId)
            /*//    测试发送失败情况
                this.pageData.clist[this.pageData.clist.length-1].msgStatus=false;*/
            }else{//保存消息失败
                if(data.code==10005){
                    this.mainCtrl.nativeService.showToast("Ta已被你拉黑,无法接收你的消息!");
                    console.log("消息"+messageId+"发送失败，"+this.toUser.id+"已被你拉黑");
                    this.setMsgStatus(data);
                }else if(data.code==10006){
                    this.mainCtrl.nativeService.showToast("消息已发出,但被对方拒收了!");
                    console.log("消息"+messageId+"发送失败，"+this.toUser.id+"拒收了");
                    this.setMsgStatus(data);
                }else{
                    this.mainCtrl.nativeService.showToast("消息发送异常,请重试!");
                    this.setMsgStatus(data);

                }

            }
        })
    }

    /**
     * 设置消息发送状态
     * @param data
     */
    setMsgStatus(data){
        this.pageData.clist.forEach((item,index)=>{
            if(item.clientId==data.result){
                item.msgStatus=false;
            }
        });
    }
    /**
     * 生成消息id
     */
    getMessageId(){
        //时间戳+4位随机数
        return new Date().getTime()+""+parseInt(Math.random()*10000+"")
    }


    /**
     * 发送消息给融云
     * @param event
     * @param msgType
     */

    sendMessageToRongIM( msgType, msgContent,messageId) {

        // let extraInfo = {"toUserId": this.toUser.id,clientId: messageId,"toUserNickName":this.toUser.name,"toUserHeadPic":this.toUser.avatar};
        let extraInfo = {"toUserId": this.toUser.id,clientId: messageId,"toUserNickName":this.toUser.name,
            "toUserHeadPic":this.toUser.avatar,"senderHeadPic":this.user.avatar,"senderNickName":this.user.name};
console.log("调用融云，"+this.user.id+"即将发送消息给"+this.toUser.id+"消息id:"+messageId);
        // 发送消息--使用融云api
        // var msg = new RongIMLib.TextMessage({content: msgContent,extra: JSON.stringify(extraInfo)});
        var msg = new RongIMLib.TextMessage({content: encodeURI(msgContent),extra: JSON.stringify(extraInfo)});

        var conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
        var targetId = this.toUser.id; // 目标 Id
        RongIMClient.getInstance().sendMessage(conversationtype, targetId+"", msg, {
                onSuccess: function (message) {
                    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    console.log("融云发送消息成功");``
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
                        default :
                            info = "啦啦啦";
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            }
        );
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        const userId = this.user.id,
            toUserId = this.toUser.id;
        // Verify user relationships
        if (msg.userId == userId && msg.toUserId == toUserId) {
            this.msgList.push(msg);

        } else if (msg.toUserId == userId && msg.userId == toUserId) {
            this.msgList.push(msg);
        }
        this.scrollToBottom();
    }
    addNewMsg(msg) {
        const userId = this.user.id,
            toUserId = this.toUser.id;
        // Verify user relationships
        if (msg.userId == userId && msg.toUserId == toUserId) {
            this.pageData.clist.push(msg);

        } else if (msg.toUserId == userId && msg.userId == toUserId) {
            this.pageData.clist.push(msg);
        }
        this.scrollToBottom();
    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }

    scrollToBottom() {
        setTimeout(() => {
            // if (this.content&&this.content.scrollToBottom) {
            //防止在其它页面触发该方法报错 找不到属性scrollbottom
            if (this.content&&window.localStorage.getItem("currentPage")=="chat-in") {
                this.content.scrollToBottom();
            }
        }, 400)
    }
    showBigImg(imgUrl){
          let modal=this.modalCtrl.create('ShowBigImgPage',{
              imgUrl:imgUrl
          });
          modal.present();
    }
    showBigImg2(imgUrl){
      /*  let modal=this.modalCtrl.create('ShowBigImgPage',{
            imgUrl:imgUrl
        });
        modal.present();*/
        let option={
            photos: [{
                url: imgUrl,
                type: ".png",
            }],
                closeIcon: imgUrl,
            initialSlide: 1,
        }

        let modal = this.modalCtrl.create(GalleryModal, {
            photos: option.photos,
            initialSlide: 1
        });
        modal.present();
    }

}
