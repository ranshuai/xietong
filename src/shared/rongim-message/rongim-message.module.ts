import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RongimMessageComponent } from './rongim-message';
@NgModule({
	declarations: [RongimMessageComponent],
	imports: [IonicPageModule.forChild(RongimMessageComponent),],
	exports: [RongimMessageComponent]
})
export class RongimMessageModule {}
