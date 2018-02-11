import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {SexSelectModal} from "./sex-select-modal";

@NgModule({
    declarations: [
        SexSelectModal,
    ],
    imports: [
        IonicPageModule.forChild(SexSelectModal),
    ],
    exports: [
        SexSelectModal
    ]
})
export class SexSelectModule {}
