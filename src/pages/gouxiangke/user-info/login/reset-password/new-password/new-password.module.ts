import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPasswordPage } from "./new-password";
import { DirectivesModule } from '../../../../../../directives/directives.module';

 
@NgModule({
  declarations: [
    NewPasswordPage,
   ],
  imports: [
    IonicPageModule.forChild(NewPasswordPage),
    DirectivesModule
  ],
  entryComponents: [
    NewPasswordPage
  ],
})
export class NewPasswordPageModule { 

  
}