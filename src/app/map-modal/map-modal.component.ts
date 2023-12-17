import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import * as L from "leaflet";



@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.css']
})
export class MapModalComponent {

 
  constructor(private modalController: ModalController) {}


}

