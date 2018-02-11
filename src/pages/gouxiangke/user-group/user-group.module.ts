import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserGroupPage } from './user-group';

import { ComponentsModule } from './../components/components.module';
@NgModule({
  declarations: [
    UserGroupPage,
    
  ],
  imports: [
    IonicPageModule.forChild(UserGroupPage),
    ComponentsModule,
  ],
  entryComponents: [
  ]
})
export class UserGroupPageModule {}
