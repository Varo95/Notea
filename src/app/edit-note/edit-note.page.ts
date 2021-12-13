import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/Note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.page.html',
  styleUrls: ['./edit-note.page.scss'],
})
export class EditNotePage implements OnInit {

  @Input() note: Note;

  public formNote: FormGroup;

  constructor(public modalController: ModalController,
    public ns: NoteService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formNote = this.fb.group({
      title: ["", Validators.required],
      description: [""]
    });
  }

  public close() {
    this.modalController.dismiss();
  }

  public async editNote() {
    let newNote: Note = {
      key: this.note.key,
      title: this.formNote.get("title").value,
      description: this.formNote.get("description").value
    }
    try {
      await this.ns.editNote(newNote);
      //await this.utils.presentToast("Nota agregada correctamente", "success");
      await this.ns.getNotes();
      this.formNote.reset();
      this.close();
    } catch (err) {
      console.log(err);
      //await this.utils.presentToast("Error al agregar nota", "failed");
    }

  }

}