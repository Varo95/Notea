import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EditNotePage } from '../edit-note/edit-note.page';
import { Note } from '../model/Note';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public notes: Note[];
  public myLoading: HTMLIonLoadingElement;
  public myToast: HTMLIonToastElement;
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(private noteS: NoteService, private loading: LoadingController,
    private toast: ToastController, private translator: TranslateService,
    private authS: AuthService, private router: Router,
    public modalController: ModalController,
    public alertController: AlertController) {
  }

  async presentLoading() {
    this.myLoading = await this.loading.create({
      message: ''
    });
    await this.myLoading.present();
  }

  async presentToast(msg: string, clr: string) {
    this.myToast = await this.toast.create({
      message: msg,
      duration: 2000,
      color: clr
    });
    this.myToast.present();
  }

  async ionViewDidEnter() {
    await this.loadNotes();
  }

  public async infinityLoad($event) {
    let newNotes = await this.noteS.getNotesByPage().toPromise();
    if (newNotes.length < 10) {
      $event.target.disabled = true;
    }
    this.notes = this.notes.concat(newNotes);
    $event.target.complete();
  }

  public async searchNote(event?) {
    let notes: Note[] = [];
    if (event) {
      const filter: string = event.detail.value;
      if (filter.length > 1) {
        for (let note of this.notes) {
          if (note.title.toLowerCase().includes(filter.toLowerCase())) {
            notes.push(note);
          }
        };
        this.notes = notes;
        event.target.complete;
      } else if (filter.length == 0) {
        await this.loadNotes();
      }
    }
  }

  public async loadNotes(event?) {
    if (this.infinite) {
      this.infinite.disabled = false;
    }
    if (!event) {
      await this.presentLoading();
    }
    this.notes = [];
    try {
      this.notes = await this.noteS.getNotesByPage(true).toPromise();
    } catch (err) {
      console.error(err);
      await this.presentToast("Error al cargar datos", "danger");
    } finally {
      if (event) {
        event.target.complete();
      } else {
        await this.myLoading.dismiss();
      }
    }
  }

  public async infiniteLoad($event) {
    let nuevasNotas = await this.noteS.getNotesByPage(false).toPromise();
    if (nuevasNotas.length < 10) {
      $event.target.disabled = true;
    }
    this.notes = this.notes.concat(nuevasNotas);
    $event.target.complete();
  }

  public async delete(note: Note) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '<strong>Estas seguro de que quieres eliminar</strong>',
      buttons: [
        {
          text: 'CANCELAR',
          handler: (blah) => {
          }
        }, {
          text: 'ELIMINAR',
          handler: async () => {
            await this.presentLoading();
            await this.noteS.removeNote(note.key);
            let i = this.notes.indexOf(note, 0);
            if (i > -1) {
              this.notes.splice(i, 1);
            }
            await this.myLoading.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  public showId(key: string): void {
    console.log(key);
  }

  public async edit(note: Note) {
    const modal = await this.modalController.create({
      component: EditNotePage,
      componentProps: { note }
    });
    await modal.present();
    await modal.onDidDismiss();
    await this.loadNotes();
  }

  public async logout() {
    await this.authS.logout();
    this.router.navigate(['']);
  }

}
