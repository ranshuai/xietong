import { Component,ViewChild } from '@angular/core';
import { IonicPage, Slides, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from "../../gouxiangke/providers/common/common";
import { FormsModule }   from '@angular/forms';

import { Api } from '../../gouxiangke/providers/api/api';
import { StoreClientBenPage } from "../store-client/store-client-ben/store-client-ben";

/**
 * Generated class for the StoreClientPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-client',
  templateUrl: 'store-client.html',
})
export class StoreClientPage {
  //引入slides事件
  @ViewChild(Slides) slides: Slides;
  activeNavIndex = 0;
  searchValue : string;
  storeClientNavList: any = [
    {
      page:1,
      rows:10,
      loadEnd: false,
      clist:[]
    },
    {
      page:1,
      rows:10,
      loadEnd: false,
      clist:[]
    },
    {
      page:1,
      rows:10,
      loadEnd: false,
      clist:[]
    }
  ];

  constructor(public api: Api, public common: CommonProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreClientPage');
    //页面的初始化
    this.getDataList()
  }

  // 搜索
  search() { 
    if (this.searchValue == '') return
    console.log(this.searchValue)
    this.activeNavIndex = 2;
    this.getDataList();
  }
  //获取数据
  getDataList(refresher?) { 
    let index = this.activeNavIndex;
    if (this.storeClientNavList[index].loadEnd) {
        refresher && refresher.complete();
        return false;
    }
    let url, params;
    if (index == 0 ||index == 2) {
        url = 'rong/cloud/list';
    } else if (index == 1) {
        url = 'notice/list';
    } else { 
        return false;
    }
    if (index == 2) {
      params = {
        likeVal:this.searchValue,
        page: this.storeClientNavList[index].page,
        rows: this.storeClientNavList[index].rows,
      }
    } else { 
      params= {
        page: this.storeClientNavList[index].page,
        rows: this.storeClientNavList[index].rows,
      }
    }

     
    this.api.get(this.api.config.host.bl + url, params).subscribe(data => {
      if (data.success) {
        //判断是否 第 1 页
        if (this.storeClientNavList[index].page == 1) {
          if (index == 0 || index == 2) {
            this.storeClientNavList[index].clist = data.result;
          } else {
            this.storeClientNavList[index].clist = data.result;
          }
        } else {
          if (index == 0 || index == 2) {
            (this.storeClientNavList as any)[index].clist = (this.storeClientNavList as any)[index].clist.concat(data.result);
          } else {
            (this.storeClientNavList as any)[index].clist = (this.storeClientNavList as any)[index].clist.concat(data.result);
          }
        }
        if (data.result.length >= (this.storeClientNavList as any)[index].rows) {
          (this.storeClientNavList as any)[index].loadEnd = false;
        } else {
          (this.storeClientNavList as any)[index].loadEnd = true;
        }
        (this.storeClientNavList as any)[index].page++;
        refresher && refresher.complete();
      } else { 
        this.common.tostMsg({msg:data.msg})
      }
     })
  }






  //拉取数据
  getData(refresher?) {
    let index = this.activeNavIndex;
    if (this.storeClientNavList[index].loadEnd) {
        refresher && refresher.complete();
        return false;
    }
    let url;
    if (index == 0) {
        url = 'rong/cloud/list';
    } else if (index == 1) {
        url = 'notice/list';
    } else { 
        return false;
    }
    //私信的接口
    let params = {
      page: this.storeClientNavList[index].page,
      rows: this.storeClientNavList[index].rows,
    }
    this.api.get(this.api.config.host.bl + url, params).subscribe(data => { 
      console.log(data);
      if (data.success) {
          //判断是否 第 1 页
        if (this.storeClientNavList[index].page == 1) {
          if (index == 0) {
            this.storeClientNavList[index].clist = data.result;
            this.storeClientNavList[index].clist = [
              {
                "id": 11,
                "userId": 12,
                "userName": "李昊",
                "userImg": "www.baidu.com",
                "toUserId": 13,
                "toUserName": "冉帅",
                "toUserImg": "http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/qualification/1686/9a6b8204-2cf3-4ee1-b533-13f22d7d4ff7.png",
                "haveRead": true,
                "modifyTime": 123123123123123,
                "domainNo": "jiuhui"
              },
              {
                "id": 11,
                "userId": 12,
                "userName": "李昊",
                "userImg": "www.baidu.com",
                "toUserId": 13,
                "toUserName": "冉帅",
                "toUserImg": "http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/qualification/1686/9a6b8204-2cf3-4ee1-b533-13f22d7d4ff7.png",
                "haveRead": true,
                "modifyTime": 123123123123123,
                "domainNo": "jiuhui"
              }
            ]
          } else { 
            this.storeClientNavList[index].clist = data.result;
            this.storeClientNavList[index].clist = [
              {
                "id":11,
                "userId":12,
                "title":"标题",
                "subtitle":"副标题",
                "haveRead":true,
                "time":123123123123123,
                "misson":"misson",
                "domainNo":"jiuhui",
                "msg":"信息"
              },
              {
                "id":11,
                "userId":12,
                "title":"标题",
                "subtitle":"副标题",
                "haveRead":true,
                "time":123123123123123,
                "misson":"misson",
                "domainNo":"jiuhui",
                "msg":"信息"
              }
            ]
          }
          console.log(this.storeClientNavList[index].clist);
        } else { 
            if (index == 0) {
              (this.storeClientNavList as any)[index].clist = (this.storeClientNavList as any)[index].clist.concat(data.result);
          } else { 
              (this.storeClientNavList as any)[index].clist = (this.storeClientNavList as any)[index].clist.concat(data.result);
          }
        }
        if (index == 0) {
          if (data.result.length >= (this.storeClientNavList as any)[index].rows) {
              (this.storeClientNavList as any)[index].loadEnd = false;
          } else {
              (this.storeClientNavList as any)[index].loadEnd = true;
          }
      } else { 
          if (data.result.length >= (this.storeClientNavList as any)[index].rows) {
              (this.storeClientNavList as any)[index].loadEnd = false;
          } else {
              (this.storeClientNavList as any)[index].loadEnd = true;
          }
      }
      (this.storeClientNavList as any)[index].page++;
      refresher && refresher.complete();
      } else{
        this.common.tostMsg({msg:data.msg})
      }
    })
  }
  
  //下拉刷新
  refresh(refresher?) { 
    console.log('下拉刷新');
    this.storeClientNavList[this.activeNavIndex].page = 1;
    this.storeClientNavList[this.activeNavIndex].loadEnd = false;
    this.getDataList(refresher);
  }
  //上拉加载更多
  doInfinite(infiniteScroll) { 
    this.getDataList()
    infiniteScroll.complete();
  }

  //跳转页面
  goToPage() { 
    this.common.goToPage(StoreClientBenPage)
  }
}
