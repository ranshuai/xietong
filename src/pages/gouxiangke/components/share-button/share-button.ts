import { Config } from './../../providers/api/config.model';
import { Component, Input } from '@angular/core';
import { ThirdPartyApiProvider} from '../../providers/third-party-api/third-party-api'
/**
 * Generated class for the SearchButtonComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'share-button',
  templateUrl: './share-button.html'
})
export class ShareButtonComponent {

  @Input() shareJson: any;

  constructor(public thirdPartyApi : ThirdPartyApiProvider ,public config:Config) { 
  }

  shareEvent() {
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') {
      this.thirdPartyApi.shareWx(this.shareJson);
     }
  }

}
