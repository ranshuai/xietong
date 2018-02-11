import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {HttpConfig} from "../../../providers/HttpConfig";
import {HttpService} from "../../../providers/HttpService";
import {SnsPage} from "../sns";
import {MainCtrl} from "../../../providers/MainCtrl";
import {CommonModel} from "../../../providers/CommonModel";
import {Api} from "../../gouxiangke/providers/api/api";
import {Config} from "../../gouxiangke/providers/api/config.model";
import {GlobalDataProvider} from "../../gouxiangke/providers/global-data/global-data.model";

declare var RongIMLib: any;
declare var RongIMClient: any;

/**
 * Generated class for the RecentMessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-recent-message',
    templateUrl: 'recent-message.html',
})
export class RecentMessagePage {
    isSimulateData = false;
    totalUnreadCount=0;
    pageData: any = {
        recentChatList: []
    };
    //页面刷新配置
    doInfiniteConfig = {
        pageNo: 1,
        loadEnd: false
    }

    constructor(public navCtrl: NavController, public app: App, public navParams: NavParams,
                public httpConfig: HttpConfig, public httpService: HttpService, private events: Events,
                private  snsPage: SnsPage, public mainCtrl: MainCtrl, public commonModel: CommonModel,
                public api: Api, public config: Config, public globalDataProvider: GlobalDataProvider,) {
        //订阅新消息事件
        this.events.subscribe('recMsg', (msg) => {
            console.log("会话列表界面接收到消息事件：", msg);
        //    刷新会话列表页面
            this.preInit();
        });
    }

    //判断是否登录

    ionViewDidEnter(){
        //标记当前路由为recentMessage
        window.localStorage.setItem("currentPage","recentChat-in");

        console.log("已经进入最近会话页面");
        this.preInit();
    }
    ionViewWillLeave(){
        console.log("已经离开最近会话页面");
        window.localStorage.setItem("currentPage","recentChat-out");
    }
    preInit(){
        this.doInfiniteConfig.pageNo=1;
        window.document.title = this.globalDataProvider.domainNameWX;
        if (this.config.PLATFORM == 'WX') {

            // 页面初始化
            this.pageInit();
            //    获取会话列表
            //     this.getConversationList();
            return;
        }
        if (this.config.PLATFORM == 'APP') {
            /*this.api.getUserId().subscribe(userId => {
                if (!userId) {
                    //如果没有userID跳转登陆页面
                    this.navCtrl.push('PublicLoginPage');
                } else {
                    console.log('个人');
                    // 页面初始化
                    this.pageInit();
                    //    获取会话列表
                    //     this.getConversationList();
                }
            });*/
            if (!this.commonModel.userId) {
                //如果没有userID跳转登陆页面
                this.navCtrl.push('PublicLoginPage');
            } else {
                console.log('个人');
                // 页面初始化
                this.pageInit();
                //    获取会话列表
                //     this.getConversationList();
            }


            return;
        }

    }
    getConversationList() {
        let self = this;
        //请确保单群聊消息云存储服务开通，且开通后有过收发消息记录
        RongIMClient.getInstance().getConversationList({
            onSuccess: function (list) {
                self.pageData["recentChatList"] = list;
                console.log("打印数组长度", self.pageData["recentChatList"].length);
                list.forEach((item, index) => {
                    // item.latestMessage.sentTime= Math.round(new Date(item.latestMessage.sentTime/ 1000).getTime() )
                    item.latestMessage.sentTime = new Date(item.latestMessage.sentTime).toLocaleString().replace(/:\d{1,2}$/, ' ');
                    ;
                })
                /* for(var i=0;i<list.length;i++){
                     list[i].receivedTime= Math.round(new Date(list[i].receivedTime) / 1000)
                 }*/
                console.log(list);
            },
            onError: function (error) {
                // do something...
            }
        }, null);

    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter RecentMessagePage');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecentMessagePage');
    }

    goToBack() {
        // 从首页移除
        console.log("goToBack已经离开最近会话页面");
        window.localStorage.setItem("currentPage","recentChat-out");
        this.snsPage.navCtrl.pop();
        // this.app.getRootNav().push("CirclePage");
    }

    /**
     * 页面初始化
     */
    pageInit(refresher?) {
        //获取总未读消息数
        this.getTotalUnreadCount();
        this.doInfiniteConfig.loadEnd=false;
        this.loadData(refresher);
    }

    /**
     * 获取总未读消息数
     */
    getTotalUnreadCount() {
        this.httpService.get(this.httpService.config.host.org+"sns/history/unread/all")
            .subscribe((data) => {
                if (data.success) {
                    console.log("从服务器获取总未读消息数：", data.result);
                    this.totalUnreadCount=data.result;
                    if(data.result!=null&&data.result!=undefined&&data.result>0){
                        window.localStorage.setItem("hasUnread",'true');
                    }else{
                        window.localStorage.setItem("hasUnread",'false');
                    }
                }
            });
    }

    chat(beUserId, userName, headPic) {
        this.navCtrl.push("ChatPage", {
            "toUserId": beUserId,
            "toUserName": userName,
            "headPic": headPic
        })
    }

    /**
     * 加载数据
     */
    loadData(refresher?) {
        let pageNo = this.doInfiniteConfig.pageNo;
        //   初始化加载相关配置
        this.initPageConfig(true, false);//加载中
        if (this.doInfiniteConfig.loadEnd) {//如果服务器没数据了
            refresher && refresher.complete();
            return;
        }
        //    请求最近聊天列表
        let url = this.httpConfig.host.org + "sns/history/recently";
        if (this.isSimulateData) {
            url = "assets/json/sns/recentChatList.json";
        }
        this.httpService.get(url, {pageNo: pageNo, rows: 100})
            .subscribe((data) => {
                if (data.success) {
                    console.log("最近消息接口,服务器返回数据：", data);
                    if (this.doInfiniteConfig.pageNo == 1) {
                        this.pageData.recentChatList = data.result;
                    } else {//添加到集合
                        this.pageData.recentChatList = this.pageData.recentChatList.concat(data.result);
                    }
                    //  服务器是否还有数据
                    if (data.result && data.result.length >= 100) {
                        this.doInfiniteConfig.loadEnd = false;
                    } else {
                        this.doInfiniteConfig.loadEnd = true;
                    }
                    //   加载完毕,没有错误,页码+1
                    this.doInfiniteConfig.pageNo++;
                    this.initPageConfig(false, false);
                    refresher && refresher.complete();
                } else {//接口失败
                    this.initPageConfig(false, true);
                    refresher && refresher.complete();
                }
            });

    }

    /**
     * 侧滑删除item
     * @param position
     */
    deleteItem(position) {
        for (let i = 0; i < this.pageData.recentChatList.length; i++)
            if (i == position) {
                this.pageData.recentChatList.splice(i, 1);
                break;
            }
    }

    /**
     * 初始化加载相关配置
     */
    initPageConfig(_loading, _error) {
        if (this.pageData) {
            this.pageData.config = {
                loading: _loading,
                error: _error
            }
        } else {
            this.pageData = {
                config: {
                    loading: _loading,
                    error: _error
                }
            }
        }


    }

    /**
     * 下拉刷新
     * @param refresher
     */
    doRefresh(refresher) {
        this.doInfiniteConfig.pageNo = 1;
        this.doInfiniteConfig.loadEnd = false;
        this.loadData(refresher);
    }

    /**
     * 滚动加载
     * @param infiniteScroll
     */
    doInfinite(infiniteScroll) {
        this.loadData(infiniteScroll)
    }
}
