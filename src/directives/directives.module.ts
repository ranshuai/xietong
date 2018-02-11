/***公共自定义指令文件 */
import { NgModule } from '@angular/core';

import { NgShowDirective } from "./ng-show/ng-show.directive";
import { BackImgDirective } from "./ng-backImg/ng-backImg";
import {ImgCodeDirective } from "./ng-ImgCode/ng-imgCode";
import { ShowPassiconDirective } from './show-passicon/show-passicon';

import { ngFocusDirective } from "./ng-focus/ng-focus";
import { SafeHtmlDirective } from './safe-html/safe-html';
import {AutosizeDirective } from "./autosize/autosize"
@NgModule({
  declarations: [
    NgShowDirective,
    BackImgDirective,
    ImgCodeDirective,
    ngFocusDirective,
    SafeHtmlDirective,
    ShowPassiconDirective,
    AutosizeDirective
  ],
  exports: [
    NgShowDirective,
    BackImgDirective,
    ImgCodeDirective,
    ngFocusDirective,
    SafeHtmlDirective,
    ShowPassiconDirective,
    AutosizeDirective
  ]
})
export class DirectivesModule { }