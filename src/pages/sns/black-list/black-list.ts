import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpConfig} from "../../../providers/HttpConfig";
import {HttpService} from "../../../providers/HttpService";
import {pinyin} from "../../../shared/ping";

/**
 * Generated class for the BlackListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-black-list',
    templateUrl: 'black-list.html',
})
export class BlackListPage {
blackList;
    searchingItems=[];
    isSearching=false;
    pageData: any = {
        userList: []
    };
    //页面刷新配置
    doInfiniteConfig = {
        pageNo: 1,
        loadEnd: false
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService,
                public httpConfig: HttpConfig) {
        this.queryBlackList();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BlackListPage');
    }

    queryBlackList() {
        let url = this.httpConfig.host.org + this.httpConfig.version + "sns/user/relation/getUserRelationList";
        // let url="assets/json/sns/attention.json";
        this.httpService.get(url,
            {
                // "clientType":this.httpConfig.platform,
                "clientType": 10,
                "state": 2,//黑名单
                type: 1,//所有黑名单用户
                pageNo: 1, rows: 10
            }
        )
            .subscribe((data) => {
                if (data.success) {
                    console.log("查询黑名单", data);
                    //     列表展示和 操作黑名单 待完成
                    this.blackList=data.result;
                //    增加拼音
                    this.blackList.forEach((item,index)=>{
                        item.pinyinName = pinyin.getFullChars(item.nickName);
                    });
                }
            })
    }
    seeUserInfo(userId,nickName,headPic){
        this.navCtrl.push("SnsUserInfoPage",{
            userId:userId,
            nickName:nickName,headPic:headPic
        })
    }
    getItems(ev: any) {
        console.log('搜索黑名单');
        this.isSearching = true;
        this.initializeItems();

        let val = ev.target.value;
        if (val && val.trim() != '') {
            /*this.searchingItems = this.searchingItems.filter((item) => {
                val==item}).map(item=>{
                console.log('filteritem==' + JSON.stringify(item));
                return (item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })*/
            this.searchingItems = this.searchingItems.filter(item => item.nickName.toLowerCase().indexOf(val.toLowerCase()) > -1
                ||item.pinyinName.toLowerCase().indexOf(val.toLowerCase()) > -1);
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

    initializeItems() {
        this.searchingItems = this.blackList;
    }
}
