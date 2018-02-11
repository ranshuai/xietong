export class GlobalDataProvider {
  //购物车的角标是否显示
  isShopTabBadge = false;
  //购物车的数量
  shopCarNum: any;
  //第三方授权信息
  thirdPartyAuthorization: any = {};
  source: String;
  //开启启动页
  isGuide: Boolean = true;                                     
  LINK: string = this.isGuide ? 'GuidePage' : 'UserPage';
  //此参数用来判断，进入订单时，是立即购买的订单还是购物车订单
  isNowBuy: Boolean = false;
  //此参数用来判断，进入订单时，是是否拼团
  isGroupBuy: Boolean = false;

  //此参数用来控制是否隐藏用户界面的tabs
  hideUserTabs: Boolean = false;

  //此参数用来判断，点击地址列表的时候，是否需要选择地址，并返回订单详情
  needSelectAddress: Boolean = true;

  //tab的颜色:1是红色2是蓝色
  tabColor: number;

  //用来传递店铺订单中几个切换的搜索单号
  orderSn: string;

  //用来传递添加店铺商品时的数据
  storeGoodsForm: any;

  //用来传递编辑店铺商品时的数据
  editStoreGoods: any;

  //用来锁定确认下单的字段
  lockOrderBtn: Boolean = false;

  //pc后台的配置信息
  platformsetSelectConfigInfo: any=1;

  //wxtitle 
  domainNameWX: any;
  
  //店铺管理
  storeGoodsNavIndex: any;

}
