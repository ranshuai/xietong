import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { ComponentsModule } from '../../../gouxiangke/components/components.module';
import { DirectivesModule } from '../../../gouxiangke/directives/directives.module';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    ComponentsModule,
    DirectivesModule,
  ],
})
export class SearchPageModule { }