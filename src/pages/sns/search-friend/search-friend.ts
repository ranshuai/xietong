import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http} from "@angular/http";
import {HttpConfig} from "../../../providers/HttpConfig";
import {HttpService} from "../../../providers/HttpService";
import {CommonModel} from "../../../providers/CommonModel";
import {MainCtrl} from "../../../providers/MainCtrl";
import {NativeService} from "../../../providers/NativeService";

/**
 * Generated class for the SearchFriendPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-friend',
  templateUrl: 'search-friend.html',
})
export class SearchFriendPage {
    keyword="";//搜索关键字
    // userList=[];
    isScrolling=false;
    userId;
    pageData: any = {
        userList: []
    };
    //页面刷新配置
    doInfiniteConfig = {
        pageNo: 1,
        loadEnd: false
    }

  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public httpConfig:HttpConfig,
              public httpService:HttpService,public commonModel:CommonModel,public mainCtrl:MainCtrl,public nativeService:NativeService) {
      this.userId=commonModel._userId;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchFriendPage');
  }
    ionViewWillEnter(){
      console.log("页面keyword值：",this.keyword);
      if(this.keyword){
            this.searchUsers();
      }
    }
    /**
     * 根据关键字搜索用户
     * @param event
     */
    inputChage(event){
    console.log("输入改变了inputChage",event.target.value);
    this.keyword=event.target.value;
    //查询好友
      if(this.isEmpty()){
          this.mainCtrl.nativeService.showToast("输入关键字不能为空！");
          console.log("请勿输入非空字符串");
          return;

      }
      //清空列表
        this.pageData.userList =[];
        this.doInfiniteConfig.pageNo=1;
        this.doInfiniteConfig.loadEnd=false;
        this.initPageConfig(true, false);
      this.searchUsers();

    //     let url="assets/json/sns/searchUser.json";
    //   let  url="assets/json/sns/searchUser.json";
    // this.httpService.get(url,{keyWord:keyWord},(data)=>{
    /*this.http.get(url,(data)=>{
      if(data.success){
        this.userList=data.result;
      }
    });*/



    }

    searchUsers(refresher?){
        let pageNo = this.doInfiniteConfig.pageNo;
        //   初始化加载相关配置
        this.initPageConfig(true, false);//加载中
        if (this.doInfiniteConfig.loadEnd) {//如果服务器没数据了
            refresher && refresher.complete();
            return;
        }

        let url=this.httpConfig.host.org+"/sns/user/searchUserInfo";
        this.httpService.get(url,{keyword:this.keyword,pageNo: pageNo, rows:10 })
            .subscribe((data)=>{
                if (data.success) {
                    console.log("搜索到的用户列表：",data.result);
                    if (this.doInfiniteConfig.pageNo == 1) {
                        this.pageData.userList = data.result;
                    } else {//添加到集合
                        this.pageData.userList = this.pageData.userList.concat(data.result);
                    }
                    //  服务器是否还有数据
                    if (data.result && data.result.length >= 10) {
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

    onInput(event){
    console.log("输入改变了onInput",event.target.value);
    this.keyword=event.target.value;
    //查询好友
    //     this.http.get();
    }
    isEmpty(){
        if ( this.keyword == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(this.keyword);
    }

    /**
     * 查看个人资料
     * @param userId
     */
    seeUserInfo(userId,nickName,headPic){
        this.navCtrl.push("SnsUserInfoPage",{
            userId:userId,
            nickName:nickName,headPic:headPic
        })
    }
    /*/!**
     * 关注
     * @param userId
     *!/
    attention(userId){
       let url=this.httpConfig.host.org+this.httpConfig.version+"/v2/CustomerRelation/attentionOrCancel";
       // let url="assets/json/sns/attention.json";
        this.httpService.get(url,{BeAttentionUserId:userId})
            .subscribe((data)=>{
                if(data.success) {
                    console.log("关注成功");
                //    更新该对该用户的关注状态
                    this.userList.forEach((user,index)=>{
                      if(user.userId==userId){
                        user.wayType=1;
                      }
                    });
                }
            });

    }*/


    /**
     * 关注
     */
    attention(index,userId){
        let url=this.httpConfig.host.org+this.httpConfig.version+"sns/user/relation/collectUser";
        // let url="assets/json/sns/attention.json";
        this.httpService.get(url,{beUserId:userId})
            .subscribe((data)=>{
                if(data.success) {
                    console.log("关注成功");
                    this.nativeService.showToast("关注成功");
                    //    更新该对该用户的关注状态
                    // this.userList[index].wayType=1; ???咋不是改该字段么？
                    this.pageData.userList[index].type=1;
                }
            });

    }
}
