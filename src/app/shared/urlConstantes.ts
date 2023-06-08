import { environment } from "../../environments/environment";

const apiRuta: string = environment.apiUrlJava;

export const UrlConstantes = {
  ActualizaContactoPorId: apiRuta + 'contacto/actualizaContacto.do',
  ConsultaContactos: apiRuta + 'contacto/leerContactos.do',
  ConsultaContactoPorId: apiRuta + 'contacto/leerContactoPorId.do',
  crearContacto: apiRuta + 'contacto/crearContacto.do',
}