import { Injectable, Pipe } from '@angular/core';
@Pipe({
  name: 'dateFormat'
})
@Injectable()
export class DateFormatPipe {
  /**
    * 金额转换
    * @returns {string}
    */
  transform(number) {
    return this.getFormatDate(number)
  }


  
  getFormatDate(date, pattern?) {  
    date = new Date(date);  
    if (pattern == undefined) {  
        pattern = "yyyy-MM-dd hh:mm:ss";  
    }  
    var o = {  
            "M+": date.getMonth() + 1,  
            "d+": date.getDate(),  
            "h+": date.getHours(),  
            "m+": date.getMinutes(),  
            "s+": date.getSeconds(),  
            "q+": Math.floor((date.getMonth() + 3) / 3),  
            "S":  date.getMilliseconds()  
        };  
    if (/(y+)/.test(pattern)) {  
        pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));  
    }  

    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(pattern)) {  
            pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
        }  
    }  

    console.log(pattern)

    return pattern;  
};  



}