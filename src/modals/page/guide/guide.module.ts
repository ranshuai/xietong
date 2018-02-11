import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuidePage } from './guide';
import { DirectivesModule} from "../../../directives/directives.module"
@NgModule({
  declarations: [
    GuidePage,
  ],
  imports: [
    DirectivesModule,
    IonicPageModule.forChild(GuidePage),
  ],
})
export class GuidePageModule {}
