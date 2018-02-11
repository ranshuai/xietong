import { Injectable, Pipe } from '@angular/core';
@Pipe({
  name: 'number'
})
@Injectable()
export class Number {
  /**
    * 小数转换
    * @returns {string}
    */
  
  transform(number, float) {
    return  this.toDecimal2(number,float)
  }


  toDecimal2(number,float) {
    var f = parseFloat(number); 
    if (isNaN(f)) { 
      f = 0;
    } 
    if (isNaN(float)||float<1) { 
      float=1
    }

    var flotNum = 10 * float;
    var f = Math.round(number*flotNum)/flotNum; 
    var s = f.toString(); 
    var rs = s.indexOf('.'); 
    if (rs < 0) { 
      rs = s.length; 
      s += '.'; 
    } 
    while (s.length <= rs + float) { 
      s += '0'; 
    } 
    return s; 
  } 

}