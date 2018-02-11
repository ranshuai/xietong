import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import {EmojiPickerComponentModule} from "../../../shared/emoji-picker/emoji-picker.module";
import {PipesModule} from "../../../pipes/pipes.module";
@NgModule({
    declarations: [
        ChatPage
    ],
    imports: [
        EmojiPickerComponentModule,
        IonicPageModule.forChild(ChatPage),
        PipesModule

    ],
    exports: [
        ChatPage
    ],
    providers:[
    ]
})
export class ChatPageModule {}
