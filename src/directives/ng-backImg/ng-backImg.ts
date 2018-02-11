import { Directive, ElementRef, Input } from '@angular/core';
/**
 * Generated class for the NgShowDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[ngBackImg]' // Attribute selector
})
export class BackImgDirective {


  @Input() ngBackImg: any;

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  ngOnChanges(changes) {
    //type 0 bas64 不带头 需要拼接
    let imgData = changes.ngBackImg.currentValue;
    this.element.nativeElement.style.backgroundPosition = "center";
    this.element.nativeElement.style.backgroundRepeat = "no-repeat";
    this.element.nativeElement.style.backgroundSize = "cover";
    this.element.nativeElement.style.backgroundImage = "url('" + imgData.img + "')";
  }
}
