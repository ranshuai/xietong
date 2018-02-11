import {Component, ElementRef, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {SnsPage} from "../sns";
import {HttpService} from "../../../providers/HttpService";
import {HttpConfig} from "../../../providers/HttpConfig";
import {pinyin} from "./pinyin";
import {NativeService} from "../../../providers/NativeService";
/**
 * Generated class for the FriendListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-list',
  templateUrl: 'friend-list.html',
})
export class FriendListPage {
    @ViewChild(Content) content: Content;
    alertData: any;//浏览器返回消失
    toast;
    //是否启用上拉
    isSrooll = false;
    isScrolling=false;
    // selectedIndex=0;
    friendsCountInfo={};
    //默认选中
    activeType = 'friends';
    //好友列表
    contactList = {
        'friends': {
            page: 1,
            rows: 10,
            loadEnd: false,
            isLoading:true,
            clist: undefined,
            scrollTop: 0,
            formatContacts:[],
            allSearchContacts:[]
        },
        'fans': {
            page: 1,
            rows: 10,
            loadEnd: false,
            isLoading:true,
            scrollTop: 0,
            formatContacts:[],
            allSearchContacts:[]
        },
        'strangers': {
            page: 1,
            rows: 10,
            loadEnd: false,
            isLoading:true,
            scrollTop: 0,
            formatContacts:[],
            allSearchContacts:[]
        }
    };

    // formatContacts: any = [];  //按首字母顺序格式化后的数组
    // allSearchContacts = [];  //未排序供搜索的数组
  constructor(public navCtrl: NavController, public navParams: NavParams,private events:Events,
              public httpConfig:HttpConfig, private  snsPage:SnsPage,public httpService:HttpService,
              public toastCtrl:ToastController,public nativeService:NativeService,
              public elementRef: ElementRef) {
  }
    //页面初始化
  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendListPage');

  }
  getTotalFriends(){
      this.httpService.get(this.httpConfig.host.org+"sns/user/relation/getUserRelationCount").subscribe((res)=>{
          if(res&&res.success){
              console.log("查询好友列表总数获取到的数据：",res.result);
              this.friendsCountInfo=res.result;
          }
      });
  }
    addFriend(){
        console.log("即将进入添加好友页面");
        this.navCtrl.push("AddFriendPage");
    }
    goToBack() {
        // 从首页移除
        this.snsPage.navCtrl.pop();
        // this.app.getRootNav().push("CirclePage");
    }

    /**
     * 删除好友再进入需要更新好友数
     */
    ionViewWillEnter(){
        //清空数组数据
        this.contactList[this.activeType].formatContacts=[],
            this.contactList[this.activeType].allSearchContacts=[];
        //获取好友总数
        this.getTotalFriends();
        this.initData()
}
    /**视图离开 */
    ionViewWillLeave() {
        //视图离开如果弹框还在就消失
        if (this.alertData) {
            this.alertData.dismiss();
        }
    }

   /* labelClick(selectedIndex){
        this.selectedIndex=selectedIndex;
    }*/
    //当前页面数据重新初始化
    initData() {
        this.contactList[this.activeType].isLoading=true;//请求网络完毕
        let type = this.activeType;
        this.contactList[type].page = 1;
        this.contactList[type].loadEnd = false;
        this.contactList[type].isSrooll = 0;
        this.scrollToTop(this.contactList[type].isSrooll);
        this.getContactList();
    }

    /**
     *  导航切换
     */

    changeNav(_type) {
        //记录滚动距离
        (this.contactList[this.activeType] as any).scrollTop = this.content.getContentDimensions().scrollTop;
        if (_type != this.activeType) {
            this.activeType = _type;
            if (!(this.contactList[_type] as any).clist) {
                setTimeout(() => {
                    this.scrollToTop(this.contactList[_type].scrollTop);
                    this.getContactList();
                }, 50);
            } else {
                this.scrollToTop(this.contactList[_type].scrollTop);
            }
        }
    }

    //查询好友
    getContactList(refresher?) {
        let type = this.activeType;
        if (this.contactList[type].loadEnd) {
            refresher && refresher.complete();
            return false;
        }
        if(this.isScrolling){//正在加载中
            return;
        }
        this.isScrolling=true;
        // let url="assets/json/sns/getContactList.json";
        let shipType=this.activeType=="friends"?1:(this.activeType=="fans"?2:3);
        let reqData;
        reqData={
            // "clientType":this.httpConfig.platform,
            "clientType":10,
            "state":1,
            type:shipType,
            page: this.contactList[type].page,
            rows: this.contactList[type].rows,
        };
        let url=this.httpConfig.host.org+"sns/user/relation/getUserRelationList";
        //查询陌生人接口
        if(this.activeType=="strangers"){
            url=this.httpConfig.host.org+this.httpConfig.version+"/sns/user/relation/getUserBlackList";
            reqData={
                "clientType":10,
                page: this.contactList[type].page,
                rows: this.contactList[type].rows,
            };
        }
        this.httpService.get(url ,
            reqData

        // this.httpService.get(url ,reqData

    ).subscribe(data => {
            this.contactList[type].isLoading=false;//请求网络完毕
            // data=JSON.parse(data["_body"]);
            if (data.success) {
                if(data.result){//result 不为空
                if (data.result.length >= this.contactList[type].rows) {
                    this.contactList[type].loadEnd = false;
                } else {
                    this.contactList[type].loadEnd = true;
                }
                if (this.contactList[type].page == 1) {
                    this.contactList[type].clist = data.result;
                } else {
                    // this.contactList[type].clist = this.contactList[type].clist.concat(data.result);
                }
                this.contactList[type].page++;
                refresher && refresher.complete();
                // this.getSortContact(this.contactList[type]);
                this.getSortContact(data.result);
                }else{
                    this.contactList[type].loadEnd = true;
                    this.contactList[type].page++;
                    refresher && refresher.complete();
                }
            } else {
                this.showToast({ msg: data.msg })
            }
            this.isScrolling=false;
        })
    }

    /**
     * 查看个人资料
     * @param userId
     */
    seeUserInfo(userId,nickName,headPic){
        this.navCtrl.push("SnsUserInfoPage",{
            userId:userId,
            nickName:nickName,
            headPic:headPic
        })
}

    /**
     * 关注
     */
    attention(letterPos,subItemIndex,userId){
        let url=this.httpConfig.host.org+this.httpConfig.version+"sns/user/relation/collectUser";
        // let url="assets/json/sns/attention.json";
        this.httpService.get(url,{beUserId:userId})
            .subscribe((data)=>{
                if(data.success) {
                    console.log("关注成功");
                    this.nativeService.showToast("关注成功");
                    //    更新该对该用户的关注状态
                    if(this.activeType=='friends') {
                        this.contactList[this.activeType].formatContacts[letterPos].value[subItemIndex].wayType = 1;
                    }else{ //    如果是粉丝或者陌生人，关注后删除该item
                        this.contactList[this.activeType].formatContacts.splice(letterPos, 1);
                    }
                //    更新好友总数
                    this.getTotalFriends();
                }
            });

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

    /**上拉加载 */
    doInfinite(InfiniteScroll) {
        console.log("加载更多数据");
        this.contactList[this.activeType].loadEnd = false;
        this.getContactList(InfiniteScroll);
    }
    /**下拉刷新 */
    refresh(refresher?) {
        this.contactList[this.activeType].isLoading=true;
        this.contactList[this.activeType].page = 1;
        this.contactList[this.activeType].loadEnd = false;
        this.contactList[this.activeType].clist=[];
        this.contactList[this.activeType].formatContacts=[];
        this.contactList[this.activeType].allSearchContacts=[];
        this.getContactList(refresher);
    }


    //滚动到指定位置
    scrollToTop(_number) {
        this.isSrooll = true;
        setTimeout(data => {
            this.content.scrollTo(0, _number,0);
            this.isSrooll = false;
        }, 50);
    }

    /**
     * 排序
     * @param contacts
     * @param context
     */
    getSortContact = function (contactList, context?) {
        // let contacts=contactList.clist;
        let contacts=contactList;
        let contactsLength = contacts.length;

        for (let i = 0; i < contactsLength; i++) {
            if (contacts[i].nickName == null) {
                continue;
            }
            let obj = {
                nickName: contacts[i].nickName,
                pinyinName:"",
                "headPic": contacts[i].headPic,
                "userId":contacts[i].userId,
                "wayType":contacts[i].wayType
            };

            //去掉名称非汉字，英文的
            let reg = /^[A-Za-z]+$/;

            obj.pinyinName = pinyin.getFullChars(obj.nickName);
            // console.log('one contact getFullChars ' + i);

            if (!reg.test(obj.pinyinName) || obj.nickName == '') {
                // console.log('非正常联系人信息 名字不对==' + JSON.stringify(obj));

                /*let len = this.contactList[this.activeType].formatContacts.length;
                for (let j = 0; j < len; j++) {
                    // console.log("ffff");
                    if ((this.contactList[this.activeType].formatContacts[j] as any).key == 'Z') {
                        (this.contactList[this.activeType].formatContacts[j] as any).value.push(obj);
                        break;
                    }
                }*/
            //    拼音名非法,直接添加
                let len = this.contactList[this.activeType].formatContacts.length;
                 if(len==0){
                     let arr=new Array();
                     arr.push(obj)
                     // this.contactList[this.activeType].formatContacts[len]={};
                     this.contactList[this.activeType].formatContacts[0] = {
                         key: "*",
                         value: arr
                     };
                 }else{
                     this.contactList[this.activeType].formatContacts[0].value.push(obj);
                 }

                this.contactList[this.activeType].allSearchContacts.push(obj);
            } else {
                //不排序，供搜索使用的数组
                this.contactList[this.activeType].allSearchContacts.push(obj);
                let camelChar = pinyin.getCamelChars(obj.nickName).substring(0, 1);
                if (reg.test(camelChar)) {
                    let j = 0;
                    let len = this.contactList[this.activeType].formatContacts.length;
                    for (j; j < len; j++) {
                        // console.log("ffff");
                        if ((this.contactList[this.activeType].formatContacts[j] as any).key == camelChar) {
                            (this.contactList[this.activeType].formatContacts[j] as any).value.push(obj);
                            break;
                        }
                    }
                    if (j == len) {
                        // console.log('新增key');
                        let arr = new Array();
                        arr.push(obj);
                        this.contactList[this.activeType].formatContacts[len] = {
                            key: camelChar,
                            value: arr
                        };
                    }
                }
            }
            // console.log('obj format==' + JSON.stringify(obj));
            obj = null;
        }

        this.formatContacts = this.sortContacts(this.contactList[this.activeType].formatContacts);
        // context.loader.dismiss();
        // 通讯录数组
        console.log('格式化后的通讯录数组：',this.contactList[this.activeType].formatContacts,
            this.contactList[this.activeType].allSearchContacts);

    }

    sortContacts(formatContacts) {
        // let arr = [{ key: 'S', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }
        //   , { key: 'Z', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }
        //   , { key: 'N', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }
        //   , { key: 'D', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }
        //   , { key: 'B', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }
        //   , { key: 'A', value: "[{displayName: 'hhh',phoneNumber: '1231414',pinyinName: 'hhh'}]" }];

        //首字母排序
        formatContacts.sort(function (a, b) {
            if (a.key < b.key) {
                return -1;
            } else if (a.key > b.key) {
                return 1;
            } else {
                return 0;
            }
        });

        //每组内部排序
        for (let i = 0; i < formatContacts.length; i++) {
            formatContacts[i].value.sort(function (a, b) {
                if (a.key < b.key) {
                    return -1;
                } else if (a.key > b.key) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        return formatContacts;

    }

    /**
     *定位查找首字母对应的通讯录
     */
    letterScrollToTop(letter) {
        this.show(letter.key, 1000);
        if (this.elementRef.nativeElement.querySelector("ion-item-divider#contact-" + letter.key)) {
            let scrollTop = this.elementRef.nativeElement.querySelector("ion-item-divider#contact-" + letter.key).offsetTop;
            this.content.scrollTo(0, scrollTop, 300);
        }
    }

    show = (message: string = '操作完成', duration: number = 2500) => {
        this.toast = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: 'middle',
            cssClass: 'hj-toast'
        });
        this.toast.present();
    };
}
