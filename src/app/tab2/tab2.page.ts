import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Note } from '../model/Note';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public formNote:FormGroup;
  public myLoading:HTMLIonLoadingElement;
  public myToast:HTMLIonToastElement;

  constructor(private fgb:FormBuilder,private noteS:NoteService,private loading:LoadingController,private toast:ToastController) {
    this.formNote=this.fgb.group({
      title:["",Validators.required],
      description:[""]
    })
  }

  ionViewDidEnter(){
    
  }

  async presentLoading(){
    this.myLoading = await this.loading.create({
      message:''
    });
    await this.myLoading.present();
  }

  async presentToast(msg:string,clr:string){
    this.myToast = await this.toast.create({
      message: msg,
      duration:2000,
      color:clr
    });
    this.myToast.present();
  }

  public async addNote(){
    let newNote:Note={
      title:this.formNote.get("title").value,
      description:this.formNote.get("description").value
    }
    await this.presentLoading();
    try{
      let id:string = await this.noteS.addNote(newNote);
      this.myLoading && this.myLoading.dismiss();
      await this.presentToast("Nota agregada correctamente","success");
      this.formNote.reset();
    }catch(err){
      console.log(err); //<--no en produccion
      this.myLoading && this.myLoading.dismiss();
      await this.presentToast("Error al agregar nota","danger");
    }
  }
}
