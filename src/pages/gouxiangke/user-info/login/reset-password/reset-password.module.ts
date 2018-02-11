import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPasswordPage } from "./reset-password";
import { DirectivesModule } from '../../../../../directives/directives.module';

 
@NgModule({
  declarations: [
    ResetPasswordPage,
   ],
  imports: [
    IonicPageModule.forChild(ResetPasswordPage),
    DirectivesModule
  ],
  entryComponents: [
    ResetPasswordPage
  ],
})
export class ResetPasswordPageModule { 

  
}