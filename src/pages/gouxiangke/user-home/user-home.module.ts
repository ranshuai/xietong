import { SharedsModule } from './../../../shared/shareds.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UserHomePage } from './user-home';
import { UserHomeHomePage } from './user-home-home/user-home-home';
import { UserHomeSharePage } from './user-home-share/user-home-share';

import { ComponentsModule } from "../components/components.module";
import { DirectivesModule } from "../directives/directives.module";

import { UserHomeTopComponent } from './user-home-top/user-home-top';

@NgModule({
  declarations: [
    UserHomePage,
    UserHomeHomePage,
    UserHomeSharePage,
    UserHomeTopComponent,
  ],
  imports: [
    IonicPageModule.forChild(UserHomePage),
    ComponentsModule,
    DirectivesModule,
    SharedsModule
  ],
  entryComponents: [
    UserHomeHomePage,
    UserHomeSharePage,
  ],
})
export class UserHomePageModule { }