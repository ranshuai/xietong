import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserTopicDetailsPage } from './user-topic-details';
import { ComponentsModule } from "../../components/components.module";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [
    UserTopicDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserTopicDetailsPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class UserTopicDetailsPageModule {}
