import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactosService } from 'src/app/security/contactos.service';
import { AlertasService } from 'src/app/shared/alertas.service';
import { AccionesModal } from 'src/app/shared/enums/AccionesModal';
import { CodRetorno } from 'src/app/shared/enums/CodRetorno.enum';
import { ModalsModel } from 'src/app/shared/models/ModalsModel';
import { Contacto } from 'src/app/shared/models/contacto.model';

@Component({
  selector: 'app-ContactoModal',
  templateUrl: './ContactoModal.component.html',
  styleUrls: ['./ContactoModal.component.scss']
})
export class ContactoModalComponent implements OnInit {

  //#region Variales
  contacto: Contacto = new Contacto();
  FocosArr: Array<Array<boolean>>;
  valor = false;

  inicioFocos() {
    this.FocosArr = [
      [false, false],
      [false, false],
      [false, false]
    ];
  }

  public contactoForm: FormGroup;

  InicontactoForm() {
    this.contactoForm = new FormGroup({
      idContacto: new FormControl(''),
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      aPaterno: new FormControl(''),
      aMaterno: new FormControl(''),
      direccion: new FormControl(''),
      correo: new FormControl('', [Validators.required, Validators.email]),
      usuario: new FormControl('', [Validators.required, Validators.minLength(6)]),
      ciudad: new FormControl(''),
      pais: new FormControl(''),
      codPostal: new FormControl(''),
      notas: new FormControl(''),
    });
  }

  get getcontactoForm() {
    return this.contactoForm.controls;
  }
  //#endregion

  //#region Inicio
  constructor(
    private dialog: MatDialogRef<ContactoModalComponent>,
    @Inject(MAT_DIALOG_DATA) private Data: ModalsModel<Contacto>,
    private alertas: AlertasService,
    private service: ContactosService,
  ) { }

  ngOnInit() {
    this.inicioFocos();
    this.InicontactoForm();
    this.validaAccionModal();
  }
  validaAccionModal() {
    if (this.Data.accion === AccionesModal.Editar) {
      this.contactoForm.patchValue(this.Data.param);
    }
  }
  //#endregion

  //#region Eventos
  revisaUsuarioEvent(event) {
    console.log(event.target.value);
    if (event.target.value.length > 0) {
      let env: Contacto = new Contacto();
      env.usuario = event.target.value;
      this.revisaUsuarioService(env);
    }
  }
  revisaCorreoEvent(event) {
    console.log(event.target.value);
    if (event.target.value.length > 0) {
      let env: Contacto = new Contacto();
      env.correo = event.target.value;
      this.revisaCorreoService(env);
    }
  }
  setContactoEvent() {
    this.valor = true;
    if (this.contactoForm.invalid) {
      this.alertas.errorAlert('Faltan campos por llenar del contacto');
      return;
    }
    this.contacto = this.contactoForm.getRawValue();
    this.setContactoService();
  }
  CerrarEvent() { this.dialog.close(null); }
  //#endregion

  //#region Servicios
  revisaCorreoService(contacto: Contacto) {
    this.service.revisaCorreo(contacto).subscribe(res => {
      if (res) {
        this.alertas.errorAlert("El correo ya existe en el sistema");
        this.contactoForm.controls['usuario'].setErrors({ 'incorrect': true })
      }
    });
  }
  revisaUsuarioService(contacto: Contacto) {
    this.service.revisaUsuario(contacto).subscribe(res => {
      if (res) {
        this.alertas.errorAlert("El usuario ya existe en el sistema");
        this.contactoForm.controls['usuario'].setErrors({ 'incorrect': true });
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
