import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content,IonicPage } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';
import { CommonData } from '../../providers/user/commonData.model';

/**
 * Generated class for the UserInfoEvaluatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-evaluate',
  templateUrl: 'user-info-evaluate.html',
})
export class UserInfoEvaluatePage {
  @ViewChild(Content) content: Content;
  //默认选中
  activeType = 'all';
  //是否启用上拉
  isSrooll = false;
  //评价列表
  evaluateList = {
    'all': {
      page: 1,
      rows: 10,
      loadEnd: false,
      scrollTop: 0
    },
    'img': {
      page: 1,
      rows: 10,
      loadEnd: false,
      scrollTop: 0
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: Api, public common: CommonProvider, public commondata: CommonData) {


  }

  getEvaluateQuery(refresher?) {
    if (this.evaluateList[this.activeType].loadEnd) {
      refresher && refresher.complete();
      return false;
    }
    this.api.get(this.api.config.host.bl + '/query/evaluate' , {
      type:this.activeType,
      page: this.evaluateList[this.activeType].page,
      rows: this.evaluateList[this.activeType].rows,
    }).subscribe(data => {
      data = {
        success: true,//成功返回数据
        result: [
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          },
          {
            nickname: '李晓飞',//用户名称
            headPic: 'http://snsall.oss-cn-qingdao.aliyuncs.com/jiuhui/headPic/10000/324ec44c-db66-4f26-a0f3-a0178814d26e.png',//用户头像
            evaluateTime: '10-18',//评价成功时日期 
            evaluateContent:'这里是用户评论内容,如果为空 就默认该用户没有留下任何评论信息',//评论内容
            good: {
              goodId:"1",//商品id
              goodsName: '商品标题名称',//商品标题名称
              shopPrice: '200',//商品价格
              goodType: '颜色分类:加粗加厚/有防风钩/20夹圆形线夹/买2送20个夹子/生锈退全款;数量选择:1个',//购买时的商品具体规格
              goodsImg:'https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg',//商品缩略图
            },
            evaluateImgs:['https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg','https://img.alicdn.com/bao/uploaded/i2/258144299/TB2Hbk1hOpnpuFjSZFIXXXh2VXa_!!258144299.jpg_200x200.jpg'],//评论图片信息 如果没有就传[]
          }
        ]
      }
      if (this.activeType == 'img') { 
        data.result.forEach(data => {
          data.evaluateImgs=[]
        });
      }


      if (data.success) {
        // result
        if (this.evaluateList[this.activeType].page == 1) {
          this.evaluateList[this.activeType].clist = data.result;
        } else {
          this.evaluateList[this.activeType].clist = this.evaluateList[this.activeType].clist.concat(data.result);
        }

        if (data.result.length >= this.evaluateList[this.activeType].rows) {
          this.evaluateList[this.activeType].loadEnd = false;
        } else {
          this.evaluateList[this.activeType].loadEnd = true;
        }
        this.evaluateList[this.activeType].page++;
        refresher && refresher.complete();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })


  }


  /**上拉加载 */
  doInfinite(InfiniteScroll) {
    this.getEvaluateQuery(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.evaluateList[this.activeType].page = 1;
    this.evaluateList[this.activeType].loadEnd = false;
    this.getEvaluateQuery(refresher);
  }


  //导航切换
  changeNav(_type) {
    //记录滚动距离 
    (this.evaluateList[this.activeType] as any).scrollTop = this.content.getContentDimensions().scrollTop;
    if (_type != this.activeType) {
      this.activeType = _type;
      if (!(this.evaluateList[_type] as any).clist) {
        this.scrollToTop(this.evaluateList[_type].scrollTop);
        this.getEvaluateQuery();
      } else {
        this.scrollToTop(this.evaluateList[_type].scrollTop);
      }
    }
  }
  //滚动到指定位置
  scrollToTop(_number) {
    this.isSrooll = true;
    this.content.scrollTo(0, _number, 0);
    setTimeout(data => {
      this.isSrooll = false;
    }, 50);
  }

  //当前页面数据重新初始化
  initAlertData() {
    this.evaluateList[this.activeType].page = 1;
    this.evaluateList[this.activeType].loadEnd = false;
    this.evaluateList[this.activeType].isSrooll = 0;
    this.scrollToTop(this.evaluateList[this.activeType].isSrooll);
    this.getEvaluateQuery();
  }


  //页面初始化
  ionViewDidEnter() {
    this.initAlertData()
  }

}
