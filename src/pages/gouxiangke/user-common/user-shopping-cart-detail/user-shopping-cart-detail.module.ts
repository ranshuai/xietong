import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UserShoppingCartDetailPage } from "./user-shopping-cart-detail";

import { UserShoppingCartListComponent } from "./user-shopping-cart-list/user-shopping-cart-list";

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    UserShoppingCartDetailPage,
    UserShoppingCartListComponent,
  ],
  imports: [
    IonicPageModule.forChild(UserShoppingCartDetailPage),
    ComponentsModule,
    DirectivesModule,
  ],
})
export class UserShoppingCartDetailPageModule { }