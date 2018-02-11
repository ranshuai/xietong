import { ComponentsModule } from './../components/components.module';
import { DirectivesModule } from './../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserCategoryPage } from './user-category';
import { Currency } from '../pipes/currency';


import { UserCategoryListLComponent } from './user-categor-list/user-category-list-L';
import { UserCategoryListRComponent } from './user-categor-list/user-category-list-R';

@NgModule({
  declarations: [
    UserCategoryPage,
    UserCategoryListLComponent,
    UserCategoryListRComponent
  ],
  imports: [
    IonicPageModule.forChild(UserCategoryPage),
    DirectivesModule,
    ComponentsModule,
  ]
})
export class UserCategoryPageModule { }
