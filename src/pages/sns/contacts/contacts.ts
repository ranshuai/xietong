import {Component, ViewChild, ElementRef} from '@angular/core';
import {
    NavController, NavParams, Content, ToastController, IonicPage, LoadingController,
    AlertController, Events
} from 'ionic-angular';
import {Http} from "@angular/http";
// import {TransactService} from "../../../../services/transact.service";
import {pinyin} from "./pinyin";
import {HttpService} from "../../../providers/HttpService";
import {HttpConfig} from "../../../providers/HttpConfig";
import {CommonModel} from "../../../providers/CommonModel";
import {NativeService} from "../../../providers/NativeService";
import {ContactFindOptions, Contacts, ContactFieldType} from "@ionic-native/contacts";

@IonicPage()
@Component({
    selector: 'contacts',
    templateUrl: 'contacts.html'
})


export class ContactsPage {
    // contactsUrl = 'assets/json/sns/contacts.json';
    contactsUrl = 'assets/json/sns/contacts_mwh.json';
    formatContacts: any = [];  //按首字母顺序格式化后的数组
    allSearchContacts = [];  //未排序供搜索的数组
    searchingItems = []; //搜索显示的数组
    loader;
    searchInput;
    searchQuery: string = '';
    items: string[];
    isSearching = false;
    toast: any;
    userId;
    @ViewChild(Content) content: Content;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public contacts: Contacts,
                // private transactService:TransactService,
                public toastCtrl: ToastController,
                public elementRef: ElementRef, public http: Http,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController, public httpService: HttpService, public httpConfig: HttpConfig,
                public commonModel: CommonModel, public nativeService: NativeService) {

        /*this.transactService.remitBanks().subscribe((res:any) => {
          this.remitBanks = res;
          this.aLetters.forEach((res, index) => {
            if(this.remitBanks[res] && this.remitBanks[res].lenght != 0) {
              this.formatContacts.push(this.remitBanks[res]);
              this.letters.push(res);
            }
          })
        });*/
        this.userId = this.commonModel._userId;
//    查找手机联系人
        let fields: ContactFieldType[] = ["displayName", "phoneNumbers"];
        let options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        options.hasPhoneNumber = true;
        /*//获取手机系统联系人
		this.contacts.find(fields,options).then((data)=>{
			console.log(JSON.stringify(data));
			alert(JSON.stringify(data));
			alert(data.length);
		});*/
        /*this.http.get(this.contactsUrl).subscribe((res:any) => {
            this.remitBanks = JSON.parse(res["_body"]);
            this.aLetters.forEach((res, index) => {
                if(this.remitBanks[res] && this.remitBanks[res].lenght != 0) {
                    this.formatContacts.push(this.remitBanks[res]);
                    this.letters.push(res);
                }
            })
        });
        console.log("数组内容：",this.formatContacts,this.letters);*/

        // this.location = location;
        this.searchInput = "";
        console.log('constructor+ContactPage');
        this.presentLoading();
        //查找手机通讯录
        this.getAllContacts();

    }


    initializeItems() {
        this.searchingItems = this.allSearchContacts;
    }

    getItems(ev: any) {
        console.log('搜索通讯录联系人');
        this.isSearching = true;
        this.initializeItems();

        let val = ev.target.value;
        if (val && val.trim() != '') {
            /*this.searchingItems = this.searchingItems.filter((item) => {
                val==item}).map(item=>{
                console.log('filteritem==' + JSON.stringify(item));
                return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })*/
            this.searchingItems = this.searchingItems.filter(item => item.contactName.toLowerCase().indexOf(val.toLowerCase()) > -1
                || item.pinyinName.toLowerCase().indexOf(val.toLowerCase()) > -1);
            // return (searchingItems.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
            console.log(this.searchingItems);
        } else {
            this.isSearching = false;

        }
    }

    onCancelSearch(event) {
        this.isSearching = false;
        this.searchingItems = [];
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: "正在读取通讯录...",
        });
        this.loader.present();
    }

    goWhere(loc) {
        /*console.log('loc==' + loc);
        this.location.go(loc);
        // $location.hash(loc);
        // $anchorScroll();*/
    }

    searchByKeyword(event) {
        console.log('input value=' + this.searchInput);
        let camel = pinyin.getCamelChars(this.searchInput).substring(0, 1);
        console.log("camel==" + camel);
        this.goWhere('contact-' + camel);
        console.log('contacts objs sort==' + JSON.stringify(this.formatContacts));
    }

    /**
     * 拨打电话
     * @param item
     */
    calling(item) {
        let alert = this.alertCtrl.create({
            title: '呼叫  ' + item.displayName,
            subTitle: item.phoneNumber,
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                    }
                }
            ]
        })
        alert.present();
    }


    /*
    * 获取联系人
    */
    getAllContacts() {
        console.log('getAllContacts');

        if (this.formatContacts.length === 0) {
            // let contact: Contact = this.contacts.create();
            let options = new ContactFindOptions();
            let fields: ContactFieldType[];
            fields = ["displayName", "phoneNumbers"];
            options.filter = "";
            options.multiple = true;
            options.hasPhoneNumber = true;
            if (this.nativeService.isMobile()) {
                this.contacts.find(fields, options).then((result) => {
                    this.loader.dismiss();
                    this.onSuccess(result, this);
                });
            } else {//模拟
                /*this.http.get(this.contactsUrl).subscribe((res: any) => {
                    let result = JSON.parse(res["_body"]);
                    this.onSuccess(result, this);
                    this.loader.dismiss();
                });*/
                this.loader.dismiss();
            }


        }


    }


    //读取通讯录成功
    onSuccess = function (contacts, context) {
        console.log("上传通讯录到服务器匹配");
        //   上传通讯录到服务器匹配
        this.macthContacts(contacts);
    }

    /**
     * 匹配通讯录好友
     */
    macthContacts(contacts) {

        let isAndroid = true;
        //拼装数据
        let reqData = [];
        for (let i = 0; i < contacts.length; i++) {
            if (contacts[i]._objectInstance.phoneNumbers == null) {
                // console.log('非正常联系人信息 电话为空！==' + JSON.stringify(contacts[i]));
                continue;
            }

            let obj = {
                "contactName": '',
                "crudeMobile": ''
            };
            if (isAndroid) {
                if (contacts[i]._objectInstance.displayName != null) {
                    obj.contactName = contacts[i]._objectInstance.displayName;
                } else if (contacts[i]._objectInstance.name != null && contacts[i]._objectInstance.name.formatted != null) {
                    obj.contactName = contacts[i]._objectInstance.name.formatted;
                }
            } else {
                //ios 取一个不为空的name
                // if (contacts[i]._objectInstance.name.formatted != null) {
                //   obj.displayName = contacts[i]._objectInstance.name.formatted;
                // } else if (contacts[i]._objectInstance.name.familyName != null) {
                //   obj.displayName = contacts[i]._objectInstance.name.familyName;
                // } else {
                //   obj.displayName = contacts[i]._objectInstance.name.givenName;
                // }
                if (contacts[i]._objectInstance.name != null && contacts[i]._objectInstance.name.formatted != null) {
                    obj.contactName = contacts[i]._objectInstance.name.formatted;
                }
            }
            //存储手机号
            contacts[i]._objectInstance.phoneNumbers.forEach((item, index) => {
                if (item.value) {
                    // obj.phoneNumber.push(this.stringTrim(item.value,"g"));
                    reqData.push({
                        contactName: obj.contactName,
                        crudeMobile: this.stringTrim(item.value, "g")
                    });
                }
            });
            // obj.phoneNumber=contacts[i]._objectInstance.phoneNumbers;
            // reqData.push(obj);
            obj = null;
        };
        //上传通讯录到服务器匹配

        console.log("要上传的通讯录数据：", JSON.stringify(reqData));
        // let url = "assets/json/sns/matchContacts.json";
        // let url = "assets/json/sns/sns/getContactList.json";
        let url = this.httpConfig.host.org + "sns/user/relation/queryUserContactsList";
        // let url = "http://192.168.1.241:8502/" + "sns/user/relation/queryUserContactsList";
        this.httpService.post(url, reqData)
            .subscribe((data) => {
                if (data.success) {
                    console.log("上传通讯录成功", data);
                    //   界面上展示好友列表数据
                    this.getSortContact(data.result);
                }
            })
    }

    stringTrim(str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    }

    /**
     * 排序
     * @param contacts
     * @param context
     */
    getSortContact = function (contacts, context?) {
        let contactsLength = contacts.length;

        for (let i = 0; i < contactsLength; i++) {
            // if (contacts[i].nickName == null) {
            if (contacts[i].contactName == null) {
                continue;
            }
            let obj = {
                nickName: contacts[i].nickName,
                // nickName: contacts[i].contactName,
                pinyinName: "",
                "headPic": contacts[i].headPic,
                "userId": contacts[i].userId,
                "wayType": contacts[i].wayType,
                "crudeMobile": contacts[i].crudeMobile,
                "contactName": contacts[i].contactName
            };

            //去掉名称非汉字，英文的
            let reg = /^[A-Za-z]+$/;
            //过滤非法字符。1.25修改为按照通讯录名称排序，因为可能不存在用户昵称
            let validNickName = this.filterInvalidWord(obj.contactName);
            console.log("过滤之后的昵称是：", validNickName);
            obj.pinyinName = pinyin.getFullChars(validNickName);
            console.log("昵称转化为拼音是：", obj.pinyinName);
            // console.log('one contact getFullChars ' + i);

            if (!reg.test(obj.pinyinName) || obj.contactName == '') {
                // console.log('非正常联系人信息 名字不对==' + JSON.stringify(obj));

                let len = this.formatContacts.length;
                for (let j = 0; j <= len; j++) {
                    // console.log("ffff");
                    if ((this.formatContacts[j] as any).key == 'Z') {
                        (this.formatContacts[j] as any).value.push(obj);
                        break;
                    }
                }
            } else {
                //不排序，供搜索使用的数组
                this.allSearchContacts.push(obj);
                let camelChar = pinyin.getCamelChars(obj.contactName).substring(0, 1);
                if (reg.test(camelChar)) {
                    let j = 0;
                    let len = this.formatContacts.length;
                    for (j; j < len; j++) {
                        // console.log("ffff");
                        if ((this.formatContacts[j] as any).key == camelChar) {
                            (this.formatContacts[j] as any).value.push(obj);
                            break;
                        }
                    }
                    if (j == len) {
                        // console.log('新增key');
                        let arr = new Array();
                        arr.push(obj);
                        this.formatContacts[len] = {
                            key: camelChar,
                            value: arr
                        };
                    }
                }
            }
            // console.log('obj format==' + JSON.stringify(obj));
            obj = null;
        }

        this.formatContacts = this.sortContacts(this.formatContacts);
        // context.loader.dismiss();
        // 通讯录数组
        console.log('格式化后的好友数组：', this.formatContacts,
            this.allSearchContacts);

    }

    /**
     * 过滤非法字符
     * @param s
     * @returns {any}
     */
    filterInvalidWord(s) {
        var pattern = new RegExp("[`~~~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }

    /**
     * 查看个人资料
     * @param userId
     */
    seeUserInfo(userId, nickName,headPic) {
        //如果该用户在系统中不存在则提示
        if(userId){
        this.navCtrl.push("SnsUserInfoPage", {
            userId: userId,
            nickName: nickName,headPic:headPic
            })
        }else{
            this.nativeService.showToast("用户未注册");
        }
    }

    /**
     * 关注
     */
    attention(letterPos, subItemIndex, userId) {
        let url = this.httpConfig.host.org + this.httpConfig.version + "sns/user/relation/collectUser";
        // let url="assets/json/sns/attention.json";
        this.httpService.get(url, {beUserId: userId})
            .subscribe((data) => {
                if (data.success) {this.nativeService.showToast("关注成功");
                    console.log("关注成功");
                    this.nativeService.showToast("关注成功");
                    //    更新该对该用户的关注状态
                    this.formatContacts[letterPos].value[subItemIndex].wayType = 1;
                }
            });

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
    scrollToTop(letter) {
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
