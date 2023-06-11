import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, NgForm, NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactosService } from 'src/app/security/contactos.service';
import { AlertasService } from 'src/app/shared/alertas.service';
import { AccionesModal } from 'src/app/shared/enums/AccionesModal';
import { CodRetorno } from 'src/app/shared/enums/CodRetorno.enum';
import { ModalsModel } from 'src/app/shared/models/ModalsModel';
import { Contacto } from 'src/app/shared/models/contacto.model';

@Component({
  selector: 'app-ContactoModalNg',
  templateUrl: './ContactoModalNg.component.html',
  styleUrls: ['./ContactoModalNg.component.scss']
})
export class ContactoModalNgComponent implements OnInit {

  //#region Variables
  contacto: Contacto = new Contacto();
  FocosArr: Array<Array<boolean>>;
  valor: boolean = false;
  @ViewChild("contactoForm") contactoForm: NgForm;
  @ViewChild("usuario") usuario: NgModel;
  @ViewChild("correo") correo: NgModel;
  inicioFocos() {
    this.FocosArr = [
      [false, false],
      [false, false],
      [false, false],
    ];
  }
  //#endregion

  //#region Inicio
  constructor(
    public dialog: MatDialogRef<ContactoModalNgComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly entrada: ModalsModel<Contacto>,
    private service: ContactosService,
    private alertas: AlertasService,
  ) { }
  ngOnInit() {
    this.inicioFocos();
    this.validaAccionModal();
  }
  validaAccionModal() {
    if (this.entrada.accion === AccionesModal.Editar) {
      this.contacto = this.entrada.param;
    }
  }
  //#endregion

  //#region Eventos
  revisaUsuarioEvent(event) {
    if (event.target.value.length > 6) {
      /* if (event.target.value != this.entrada.param.usuario) {  */this.revisaUsuarioService(); /* }; */
    }
  }
  revisaCorreoEvent(event) {
    if (event.target.value.length > 6) {
      this.revisaCorreoService();
    }
  }
  setContactoEvent() {
    this.valor = true;
    if (this.contactoForm.invalid) {
      this.alertas.errorAlert('Faltan campos por llenar del contacto');
      return;
    }
    this.setContactoService();
  }
  CerrarEvent() {
    this.dialog.close();
  }
  //#endregion

  //#region Services
  revisaCorreoService() {
    this.service.revisaCorreo(this.contacto).subscribe(res => {
      if (res) {
        this.alertas.errorAlert("El correo ya existe en el sistema");
        this.correo.control.setErrors({ 'incorrect': true });
      };
    });
  }
  revisaUsuarioService() {
    this.service.revisaUsuario(this.contacto).subscribe(res => {
      if (res) {
        this.alertas.errorAlert("El usuario ya existe en el sistema");
        this.usuario.control.setErrors({ 'incorrect': true });
      }
    });
  }
  setContactoService() {
    this.service.setContactoPorId(this.contacto).subscribe(res => {
      res.codRetorno == CodRetorno.CEROS ?
        this.dialog.close(true) :
        this.alertas.errorAlert(res.mensaje);
    });
  }
  //#endregion

}
