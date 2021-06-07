import axios from "axios";
import Swal from "sweetalert2";
import { actualizarAvance } from "../funciones/avance";

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url, {
                idTarea
            }).then((respuesta) => {
                if (respuesta.status === 200) {
                    icono.classList.toggle('completo');
                    actualizarAvance();
                }
            })
        }
        if (e.target.classList.contains('fa-trash')) {
            const tareaHtml = e.target.parentElement.parentElement,
                idTarea = tareaHtml.dataset.tarea;

            Swal.fire({
                title: 'Deseas borrar esta Tarea?',
                text: "Una tarea eliminada no se puede recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    //enviar delete por axios
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, {
                        params: {
                            idTarea
                        }
                    }).then((respuesta) => {
                        if (respuesta.status == 200) {
                            tareaHtml.parentElement.removeChild(tareaHtml);
                            actualizarAvance();
                            Swal.fire(
                                'Tarea Eliminada!',
                                respuesta.data,
                                'success'
                            );
                        }

                    })
                }
            });

        }
    });
}

export default tareas;