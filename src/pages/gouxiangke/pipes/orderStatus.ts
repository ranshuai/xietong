import { Injectable, Pipe } from '@angular/core';
@Pipe({
  name: 'orderStatus'
})
@Injectable()
export class OrderStatusPipe {
  /**
    * 订单状态数据字典
    * @returns {string}
  */

  statusCode = {
    "logistics": {//配送状态
      0:"配送未开始",
      2:"配送中", 
      3:"配送完成",
      4:"配送异常"   
    }
  }
  


  transform(value, args) {
    return this.statusCode[args][value] || value
  }



  




}