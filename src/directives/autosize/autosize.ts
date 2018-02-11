import { Directive, ElementRef, HostListener } from "@angular/core";

/**
 * Generated class for the AutosizeDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[autosize]' // Attribute selector
})
export class AutosizeDirective {

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust();
    console.log('输入了值改变了')
  }





  constructor(public element: ElementRef) {
    console.log('Hello AutosizeDirective Directive');
  }

  ngOnInit(): void {
    setTimeout(() => this.adjust(), 0);
    setTimeout(() => this.focus(), 100);
  }


  focus(): void {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.focus();
  }

  adjust(): void {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    var a = textArea.value.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
    document.getElementById('shadow').innerHTML = a;
    switch (document.getElementById('shadow').clientHeight) {
      case 32:
        textArea.style.lineHeight = 32 + 'px'
        textArea.style.height = 32 + 'px';
        document.getElementById('textareaModal').style.height='62px'
        break;
      case 64:
        textArea.style.lineHeight = '20px';
        textArea.style.height = 42 + 'px';  
        document.getElementById('textareaModal').style.height='100px'
        break;
      case 96:
        textArea.style.lineHeight = '20px';
        textArea.style.height = 63 + 'px'; 
        document.getElementById('textareaModal').style.height='121px'
        break;
      default:
        textArea.style.lineHeight = '20px';
        textArea.style.height = 63 + 'px';  
        document.getElementById('textareaModal').style.height='121px'
        break;
    }
  }




}
