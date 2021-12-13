import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, PartialObserver } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../model/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private myCollection: AngularFirestoreCollection;
  private last: any = null;

  constructor(private db: AngularFirestore) {
    this.myCollection = db.collection<any>(environment.firebaseConfig.notesCollection);
  }
  /**
   * This method on the service add a Note to FireStore Database
   * @param note note to insert
   * @returns the id of the inserted value, otherwise error
   */
  public addNote(note: Note): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let response: DocumentReference<firebase.default.firestore.DocumentData> = await this.myCollection.add({ title: note.title, description: note.description });
        resolve(response.id);
      } catch (err) {
        reject(err);
      }
    });
  }

  public editNote(note : Note): Promise<void>{
    return new Promise(async (resolve, reject)=>{
      try{
      let response:void = await this.myCollection.doc(note.key).set({ title: note.title, description: note.description });
      resolve(response);
      }catch(err){
        reject(err);
      }
    })
  }
  /**
   * 
   * @param isFirstTime true if is FirstTime
   */
  public getNotesByPage(isFirstTime?: boolean): Observable<Note[]> {
    if (isFirstTime) {
      this.last = null;
    }
    return new Observable((observer) => {
      let query:AngularFirestoreCollection = null;
      if (this.last) {
        query = this.db.collection<any>(environment.firebaseConfig.notesCollection,
          ref => ref.orderBy("title").limit(10).startAfter(this.last));
      } else {
        query = this.db.collection<any>(environment.firebaseConfig.notesCollection,
          ref => ref.orderBy("title").limit(10));
      }
      query.valueChanges<string>({ idField: 'key' }).subscribe(data => {
        let notes: Note[] = [];
        data.forEach(element => {
          this.last = element;
          //notes.push({key:element.key,...element});
          notes.push({ key: element.key, title: element.title, description: element.description });
        });
        observer.next(notes);
        observer.complete();
      });;
    });
  }

  public getNotes(): Observable<Note[]> {
    let notes: Note[];
    return new Observable((observer) => {
      this.myCollection.valueChanges<string>({ idField: 'key' }).subscribe(data => {
        notes = [];
        data.forEach(element => {
          //notes.push({key:element.key,...element});
          notes.push({ key: element.key, title: element.title, description: element.description });
        });
        observer.next(notes);
        observer.complete();
      });
    });
  }

  public getNote(id: string): Promise<Note> {
    return new Promise(async (resolve, rejects) => {
      let note: Note = null;
      try {
        let result: firebase.default.firestore.DocumentData = await this.myCollection.doc(id).get().toPromise();
        note = {
          key: result.id,
          ...result.data()
        }
        resolve(note);
      } catch (err) {
        rejects(err);
      }
    });
  }

  public removeNote(id: string): Promise<void> {
    return this.myCollection.doc(id).delete();
  }
}
