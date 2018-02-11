import {Component, ElementRef, forwardRef, ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {MainCtrl} from "../../providers/MainCtrl";
import {Events} from "ionic-angular";
declare var RongIMLib: any;
declare var RongIMClient: any;
/** 表情选择器
 * Generated class for the EmojiPickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

export const EMOJI_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmojiPickerComponent),
    multi: true
};

@Component({
    selector: 'emoji-picker',
    providers: [EMOJI_PICKER_VALUE_ACCESSOR],
    templateUrl: './emoji-picker.html'
})
export class EmojiPickerComponent implements ControlValueAccessor {
@ViewChild('emojiPanelSlides')
emojiPanelSlidesEle:ElementRef;

    emojiArr = [];

    _content: string;
    _onChanged: Function;
    _onTouched: Function;

    constructor(public mainCtrl: MainCtrl,public elementRef:ElementRef,public events:Events) {

        // var emojis = this.getEmojiDetailList();
        // this.bindClickEmoji(emojis);
        //
        // this.emojiArr = mainCtrl.getEmojis(emojis);
        this.emojiArr = mainCtrl.getEmojis();
        // this.emojiArr = this.mainCtrl.getRongIMEmojis(emojis);
    }
    /*ngAfterViewInit(){
        console.log("当前面板组：",this.emojiPanelSlidesEle,this.emojiPanelSlidesEle["_elementRef"].nativeElement);
        let emojiPanels=this.emojiPanelSlidesEle["_elementRef"].nativeElement;
        let panels=emojiPanels.querySelectorAll("ion-slide");
        let panelList=emojiPanels.querySelector(".emoji");
        let panelList2=emojiPanels.querySelector("ion-slide.emoji");
        console.log("面板对象：",panels,panels[0],panelList,panelList2);
        let self=this;
        //  屏幕宽度
        let screenWidth=screen.width;
        let marginSpace=((screenWidth-20)/8-24)/2-1;
        this.emojiArr.forEach((arrObj,index)=>{
            let divEle=document.createElement("div");
            let spanEle=document.createElement("span");

            arrObj.forEach((ele,pos)=>{
                panels[index].appendChild(ele);
                // spanEle.appendChild(ele);

                ele.style.margin=marginSpace+"px";
                // ele.onclick = this.clickEmoji;
                ele.onclick =function(event){
                var e = event || window.event;
                var target = e.target || e.srcElement;
                if (document.all && !document.addEventListener === false) {
                    console.log(target);
                }
                // chatbox.value = chatbox.value + target.getAttribute("name");
                console.log("选择的表情是：",target.getAttribute("name"));
                // self.setValue(target.innerHTML);
                // let emo=RongIMLib.RongIMEmoji.symbolToHTML(target.innerHTML);
                // let emo=RongIMLib.RongIMEmoji.symbolToHTML(target.getAttribute("name"));
                //     self.setValue(emo);
                    self.setValue(target.getAttribute("name"));
                }
            })
            /!*divEle.appendChild(spanEle);
            panels[index].appendChild(divEle);*!/
        });


    }
*/
    clickEmoji(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        if (document.all && !document.addEventListener === false) {
            console.log(target);
        }

        // chatbox.value = chatbox.value + target.getAttribute("name");
        console.log("选择的表情是：",target.getAttribute("name"));
        this.setValue(target.innerHTML);
    }
    getEmojiDetailList() {
        var shadowDomList = [];
        for (var i = 0; i < RongIMLib.RongIMEmoji.list.length; i++) {
            var value = RongIMLib.RongIMEmoji.list[i];
            shadowDomList.push(value.node);
        }
        return shadowDomList;
    }

    writeValue(obj: any): void {
        this._content = obj;
    }

    registerOnChange(fn: any): void {
        this._onChanged = fn;
        this.setValue(this._content);
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

     setValue(val){
        this._content += val;
        if (this._content) {
            this._onChanged(this._content)
        }
    }
   /* setValue(val: any): any {
        this._content += val;
        if (this._content) {
            this._onChanged(this._content)
        }
    }*/
    delete(){
        this.events.publish("emoji-delete");
    }
}
