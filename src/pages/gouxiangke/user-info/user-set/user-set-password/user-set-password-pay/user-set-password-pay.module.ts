import { ComponentsModule } from './../../../../components/components.module';
import { DirectivesModule } from './../../../../directives/directives.module';
import { UserSetPasswordPayPage } from './user-set-password-pay';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserSetPasswordPayPage
  ],
  imports: [
    IonicPageModule.forChild(UserSetPasswordPayPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserSetPasswordPayPageModule {}
