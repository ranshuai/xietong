import { ComponentsModule } from './../../components/components.module';
import { DirectivesModule } from './../../directives/directives.module';
import { UserInfoWalletPage } from './user-info-wallet';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    UserInfoWalletPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoWalletPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoWalletPageModule {}
