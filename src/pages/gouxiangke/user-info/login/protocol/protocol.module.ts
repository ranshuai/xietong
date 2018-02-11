import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProtocolPage } from "./protocol";
import { DirectivesModule } from '../../../../../directives/directives.module';

 
@NgModule({
  declarations: [
    ProtocolPage,
   ],
  imports: [
    IonicPageModule.forChild(ProtocolPage),
    DirectivesModule
  ],
  entryComponents: [
  
  ],
})
export class RegisterPageModule { 

  
}