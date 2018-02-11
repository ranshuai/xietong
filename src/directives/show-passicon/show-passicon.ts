import { Directive, ElementRef, Input } from '@angular/core';


@Directive({
  selector: '[showPassicon]', // Attribute selector
  host: {
    '(click)': 'showPassIcon($event)'
  }
})
export class ShowPassiconDirective {

  @Input() showPassicon;

   element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }
  
  showPassIcon() { 
    // this.element.nativeElement.setAttribute('class','icon icon-ios ion-ios-eye-outline lixiaofie');
    let inputItem = this.element.nativeElement.parentNode.getElementsByTagName('input')[0];
    let iconClass = this.element.nativeElement.getAttribute('class');
    if (inputItem.getAttribute('type') == 'password') {
      inputItem.setAttribute('type', 'text');
      iconClass = iconClass.replace('ion-ios-icon-gxk-75', 'ion-ios-icon-gxk-74')
      
    } else { 
      inputItem.setAttribute('type', 'password');
      iconClass = iconClass.replace('ion-ios-icon-gxk-74', 'ion-ios-icon-gxk-75');
      
    }
      this.element.nativeElement.setAttribute('class', iconClass);
    
  }

}
