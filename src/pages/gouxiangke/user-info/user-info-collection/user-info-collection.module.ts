import { UserInfoCollectionPage } from './user-info-collection';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from './../../components/components.module';
import { DirectivesModule } from './../../directives/directives.module';

@NgModule({
  declarations: [
    UserInfoCollectionPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoCollectionPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class UserInfoCollectionPageModule {}
