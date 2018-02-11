import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ChatTimePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'chatTime',
})
export class ChatTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   * 小于10分钟不展示时间
   */
  transform(time: number, ...args) {
    // let currentTime=(new Date().getTime()-Math.ceil(time/1000))<=10*60*1000?"":args[0];
    let currentTime=(new Date().getTime()-time)<=10*60*1000?"":args[0];
    return currentTime;
  }
}
