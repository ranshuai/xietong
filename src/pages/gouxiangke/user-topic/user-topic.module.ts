import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserTopicPage } from './user-topic';
import { UserTopicDetailsPage } from "./user-topic-details/user-topic-details";
import { UserTopicListComponent } from './user-topic-list/user-topic-list';
import { ComponentsModule } from "../components/components.module";
import { DirectivesModule } from "../directives/directives.module";
@NgModule({
  //声明IonicPage
  declarations: [
    UserTopicPage,
    UserTopicDetailsPage,
    UserTopicListComponent,
  ],
  imports: [
    IonicPageModule.forChild(UserTopicPage),
    ComponentsModule,
    DirectivesModule
  ],
  entryComponents: [
    UserTopicDetailsPage
  ],
  exports: [
    UserTopicListComponent,
  ]
})
export class UserTopicPageModule { }