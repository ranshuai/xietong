import { Injectable, Pipe } from '@angular/core';
@Pipe({
  name: 'parseSencond'
})
@Injectable()
export class ParseSencondPipe {
  /**
    * 时间转换 40 转换 00 ：00 ：45
    * @returns {string}
    */
  transform(number) {
    return this.parseSencond(number)
  }


  
    /**
     * 秒转化为时分秒
     * @param second
     */
    parseSencond(second) {
      let hour: any = 0;
      let minute: any = 0;
      let sec: any = 0;
      if (second >= 3600) {//最大单位小时
          hour = parseInt(second / 3600 + "");
          minute = parseInt((second - hour * 3600) / 60 + "");
          sec = second - minute * 60;
      } else if (second >= 60) {//最大单位分
          minute = parseInt(second / 60 + "");
          sec = second - minute * 60;
      } else {//最大单位秒
          minute = parseInt(second / 60 + "");
          sec = second;
      }
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      sec = sec < 10 ? "0" + sec : sec;
      return hour + ":" + minute + ":" + sec;
  }



}