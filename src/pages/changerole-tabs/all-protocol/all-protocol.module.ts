import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllProtocolPage } from './all-protocol';
import {DirectivesModule} from "../../../directives/directives.module";

@NgModule({
  declarations: [
    AllProtocolPage,
  ],
  imports: [
    IonicPageModule.forChild(AllProtocolPage),
    DirectivesModule
  ],
})
export class AllProtocolPageModule {}
