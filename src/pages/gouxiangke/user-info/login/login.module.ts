import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from "./login";
import { DirectivesModule } from '../../../../directives/directives.module';

 
@NgModule({
  declarations: [
    LoginPage,
   ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    DirectivesModule
  ],
  entryComponents: [
  ],
})
export class LoginPageModule { 

  
}