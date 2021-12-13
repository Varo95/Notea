import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { IonToggle } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('mytoogle',{static: false}) mytoogle:IonToggle;

  public image:any;

  ionViewDidEnter(){
    if(this.translator.getDefaultLang()){

    }
  }

  constructor(public translator:TranslateService, private st:TranslateModule) {}


  public changeLanguage(event){
    if(event && event.detail && event.detail.checked){
      this.translator.use('en');
    }else{
      this.translator.use('es');
    }
  }
  public async capturePhoto(){
    let options:ImageOptions={
      resultType:CameraResultType.Uri,
      allowEditing:false,
      quality:90,
      source:CameraSource.Camera
    };
    try{
    let result = await Camera.getPhoto(options);
    this.image = result.webPath;
    }catch(err){
      console.error(err);
    }
  }

}
