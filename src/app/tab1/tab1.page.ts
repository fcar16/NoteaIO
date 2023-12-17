import { Component,inject } from '@angular/core';
import {AlertController, IonicModule, LoadingController, ModalController} from '@ionic/angular'
  import {FormBuilder,FormGroup,FormsModule,
  ReactiveFormsModule,Validators} from '@angular/forms';
import { Note } from '../model/note';

import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { NoteService } from '../services/note.service';
import { image } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule,
  FormsModule,ReactiveFormsModule],
})
export class Tab1Page {
  public form!:FormGroup;
  private formB = inject(FormBuilder);
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!:HTMLIonLoadingElement;
  constructor(public modalController: ModalController, 
    private alertController: AlertController) {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:[''],
      img: [''],
    });
  }


  public async saveNote():Promise<void>{
    if(!this.form.valid) return;
    let note:Note={
      title:this.form.get("title")?.value,
      description:this.form.get("description")?.value,
      date:Date.now().toLocaleString(),
      img:this.form.get("img")?.value,
    }
  
    
    await this.UIS.showLoading();
    try{
      await this.noteS.addNote(note);
      this.form.reset();
      await this.UIS.showToast("Nota introducida correctamente","success");
    }catch(error){
      await this.UIS.showToast("Error al insertar la nota","danger");
    }finally{
      await this.UIS.hideLoading();
    }
  }
  async prox() {
    const confirmAlert = await this.alertController.create({
      header: 'Proximamente',
      message: 'Esta funcionalidad estará disponible en próximas versiones.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Aceptar',
        }
      ]
    });

    await confirmAlert.present();
  }

  public async takePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    (image as any).webPath = image.webPath;

    const base64Image = await this.convertToBase64((image as any).webPath);
    this.form.get("img")?.setValue(base64Image);
  }

  private convertToBase64(webPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        const base64Image = fileReader.result as string;
        resolve(base64Image);
      };

      fileReader.onerror = () => {
        reject(fileReader.error);
      };

      xhr.open('GET', webPath);
      xhr.responseType = 'blob';

      xhr.onload = () => {
        const blob = xhr.response;
        fileReader.readAsDataURL(blob);
      };

      xhr.onerror = () => {
        reject(xhr.statusText);
      };

      xhr.send();
    });
  }
}