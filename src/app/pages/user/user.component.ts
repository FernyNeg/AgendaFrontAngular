import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ContactoModalComponent } from "src/app/modals/ContactoModal/ContactoModal.component";
import { ContactoModalNgComponent } from "src/app/modals/ContactoModalNg/ContactoModalNg.component";
import { ContactosService } from "src/app/security/contactos.service";
import { AlertasService } from "src/app/shared/alertas.service";
import { AccionesModal } from "src/app/shared/enums/AccionesModal";
import { ModalsModel } from "src/app/shared/models/ModalsModel";
import { ConsultaList } from "src/app/shared/models/consultaList.model";
import { Contacto } from "src/app/shared/models/contacto.model";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  //#region variables
  busqueda: ConsultaList<Contacto> = new ConsultaList<Contacto>();
  //#endregion

  //#region Inicios
  constructor(
    private dialog: MatDialog,
    private alertas: AlertasService,
    private service: ContactosService
  ) { }

  ngOnInit() {
    this.busqueda.list = [];
    this.busqueda.param = "";
    this.getContactosService();
  }
  //#endregion

  //#region Eventos
  getContactoEvent(contacto: Contacto) {
    this.getContactoPorIdService(contacto);
    // this.abreContactoModal(null);
  }
  //#endregion

  //#region Metodos
  abreContactoModal(contacto: Contacto) {
    let env: ModalsModel<Contacto> = new ModalsModel<Contacto>();
    env.accion = AccionesModal.Editar;
    env.param = contacto;
    let modal = this.dialog.open(ContactoModalNgComponent, {
      // backdropClass: '',
      panelClass: 'custom-modalbox',
      // disableClose: true,
      maxHeight: '80vh',
      maxWidth: '50vw',
      data: env
    });
    modal.afterClosed().subscribe(res => {
      if (res != null) {
        this.alertas.successAlert('El contacto se ha guardado correctamente');
        this.getContactosService();
      }
    })
  }
  //#endregion

  //#region Servicios
  getContactosService() {
    this.service.getContactos(this.busqueda).subscribe(res => {
      this.busqueda.list = res.list;
    });
  }

  getContactoPorIdService(contacto: Contacto) {
    this.service.getContactoPorId(contacto).subscribe(res => {
      this.abreContactoModal(res);
    });
  }
  //#endregion

}
