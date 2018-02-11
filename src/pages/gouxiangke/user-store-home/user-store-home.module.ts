import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserStoreHomePage } from './user-store-home';

import { ComponentsModule } from './../components/components.module';
import { DirectivesModule } from './../directives/directives.module';

@NgModule({
  declarations: [
    UserStoreHomePage,
  ],
  imports: [
    IonicPageModule.forChild(UserStoreHomePage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserStoreHomePageModule {}
