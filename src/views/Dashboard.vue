<template>
  <div class="dashboard">
    <div class="table">
      <div class="menu">
        <div class="total">
          <h4>Pacientes totales: {{ pacientes.length }}</h4>
        </div>
        <div class="buscar">
          <input
            type="search"
            v-model="filtroNombre"
            placeholder="Buscar pacientes por nombre o Teléfono..."
          />
          <button @click="buscarPacientes">
            <i class="fa fa-search" style="font-size: 1.3em"></i>
          </button>
        </div>
        <div class="seleccionar-todo">
          <input
            type="checkbox"
            id="seleccionarTodo"
            v-model="selectAll"
            @change="seleccionarTodos"
          />
          <h4><label for="seleccionarTodo">Seleccionar todo</label></h4>
          <button
            v-if="selectAll && selectedPacientes.length > 0"
            @click="eliminarPacientesSeleccionados"
          >
            Eliminar Todos
          </button>
        </div>
      </div>
      <br />
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>Nombre y Apellido:</th>
              <th>Diagnóstico:</th>
              <th>Teléfono</th>
              <th>Edad</th>
              <th>Medicamento</th>
              <th>Recomendación</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tfoot>
            <tr v-for="paciente in pacientes" :key="paciente.id">
              <td>{{ paciente.nombre }}</td>
              <td>{{ paciente.diagnostico }}</td>
              <td>{{ paciente.telefono }}</td>
              <td>{{ paciente.edad }}</td>
              <td>{{ paciente.medicamento }}</td>
              <td>
                {{ paciente.proceso ? "Tiene" : "No Tiene" }}
              </td>
              <td>
                <button
                  style="color: var(--green)"
                  @click="editarPaciente(paciente)"
                >
                  <i class="fa fa-edit"> </i>
                </button>
              </td>
              <td>
                <button
                  style="color: var(--red)"
                  @click="eliminarPaciente(paciente)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        <table v-if="cargando" class="tabla-carga">
          <tr v-for="index in 10" :key="index">
            <td class="esqueleto"></td>
            <td class="esqueleto"></td>
            <td class="esqueleto"></td>
            <td class="esqueleto"></td>
            <td class="esqueleto"></td>
            <td class="esqueleto"></td>
            <td class="esqueleto"></td>
            <td class="esqueleto"></td>
          </tr>
        </table>
        <br />

        <span v-if="!cargando && sinResultados">¡Sin resultados!</span>

        <EditarPaciente
          v-if="mostrarFormularioEditar && pacienteSeleccionado"
          :paciente="pacienteSeleccionado"
          :db="db"
          @cancelar="cancelarEdicion"
          @edicion-completada="actualizarListaPacientes"
        ></EditarPaciente>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import EditarPaciente from "@/components/EditarPaciente.vue";
import { db } from "../firebase.js";

export default {
  data() {
    return {
      pacientes: [],
      mostrarFormularioEditar: false,
      pacienteSeleccionado: null,
      pacienteEditado: { ...this.paciente },
      db: db,
      selectAll: false,
      selectedPacientes: [],
      filtroNombre: "",
      sinResultados: false,
      cargando: true,
    };
  },
  components: {
    EditarPaciente,
  },
  async mounted() {
    const pacientesCollection = collection(db, "pacientes");
    const pacientesSnapshot = await getDocs(pacientesCollection);
    this.pacientes = pacientesSnapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
      edad: doc.data().edad,
      diagnostico: doc.data().diagnostico,
      medicamento: doc.data().medicamento,
      telefono: doc.data().telefono,
      limpiadora: doc.data().limpiadora,
      filtro: doc.data().filtro,
      cremaDia: doc.data().cremaDia,
      contorno: doc.data().contorno,
      cremaNoche: doc.data().cremaNoche,
      blanqueadora: doc.data().blanqueadora,
      proceso: doc.data().proceso,
    }));

    // Indicar que la carga ha terminado
    this.cargando = false;
  },
  methods: {
    async eliminarPaciente(paciente) {
      try {
        const pacienteRef = doc(db, "pacientes", paciente.id);
        await deleteDoc(pacienteRef);
        this.pacientes = this.pacientes.filter((p) => p.id !== paciente.id);
      } catch (error) {
        console.error("Error al eliminar el paciente:", error);
      }
    },
    editarPaciente(paciente) {
      this.mostrarFormularioEditar = true;
      this.pacienteSeleccionado = paciente;
    },
    cancelarEdicion() {
      this.mostrarFormularioEditar = false;
      this.pacienteSeleccionado = null;
    },
    async actualizarListaPacientes() {
      const pacientesCollection = collection(this.db, "pacientes");
      const pacientesSnapshot = await getDocs(pacientesCollection);
      this.pacientes = pacientesSnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
        edad: doc.data().edad,
        diagnostico: doc.data().diagnostico,
        medicamento: doc.data().medicamento,
        telefono: doc.data().telefono,
        limpiadora: doc.data().limpiadora,
        filtro: doc.data().filtro,
        cremaDia: doc.data().cremaDia,
        contorno: doc.data().contorno,
        cremaNoche: doc.data().cremaNoche,
        blanqueadora: doc.data().blanqueadora,
        proceso: doc.data().proceso,
      }));
    },
    seleccionarTodos() {
      if (this.selectAll) {
        this.selectedPacientes = this.pacientes.map((paciente) => paciente.id);
      } else {
        this.selectedPacientes = [];
      }
    },
    eliminarPacientesSeleccionados() {
      if (this.selectedPacientes.length === 0) {
        return; // No hay pacientes seleccionados para eliminar
      }

      const pacientesAEliminar = [...this.selectedPacientes];
      this.selectedPacientes = [];

      pacientesAEliminar.forEach(async (pacienteId) => {
        try {
          const pacienteRef = doc(this.db, "pacientes", pacienteId);
          await deleteDoc(pacienteRef);
          this.pacientes = this.pacientes.filter((p) => p.id !== pacienteId);
        } catch (error) {
          console.error("Error al eliminar el paciente:", error);
        }
      });
    },
    buscarPacientes() {
      if (this.filtroNombre.trim() === "") {
        // Restaurar la lista completa de pacientes si no hay filtro
        this.actualizarListaPacientes();
        this.sinResultados = false; // Reiniciar el estado de sinResultados
        return;
      }

      // Filtrar pacientes por nombre o número de teléfono
      this.pacientes = this.pacientes.filter((paciente) => {
        const nombreEnMinusculas = paciente.nombre.toLowerCase();
        const telefonoEnTexto = paciente.telefono
          ? paciente.telefono.toString()
          : ""; // Convertir a texto si existe el número de teléfono
        const telefonoEnMinusculas = telefonoEnTexto.toLowerCase();
        const filtroEnMinusculas = this.filtroNombre.toLowerCase();

        return (
          nombreEnMinusculas.includes(filtroEnMinusculas) ||
          telefonoEnMinusculas.includes(filtroEnMinusculas)
        );
      });

      this.sinResultados = this.pacientes.length === 0;
    },
  },
};
</script>

<style>
.dashboard {
  display: flex;
  flex-direction: column;
  margin-left: 20vw;
  height: 100%;
  padding: 0.5em 2em;
}

.menu {
  display: flex;
  width: 100%;
  background: var(--aqua-input);
  padding: 0.6em;
  border-radius: 1.5em;
}

.buscar {
  display: flex;
  width: 70%;
  height: 100%;
}

.buscar input {
  width: 90%;
  color: var(--white);
  padding: 0.5em;
  margin: 0.1em;
  font-size: 1em;
  background: var(--aqua-back);
}

.buscar button {
  width: 10%;
}

.buscar input::placeholder {
  color: #ddd;
}

.total,
.seleccionar-todo {
  width: 30%;
  align-items: center;
  display: flex;
}

.seleccionar-todo {
  justify-content: end;
}

.seleccionar-todo h4 {
  padding: 0 0.5em;
}

.seleccionar-todo button {
  background: var(--red);
  padding: 0.5em 1em;
}

.table {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 95vh;
  overflow-y: auto;
}

.table::-webkit-scrollbar {
  width: 0.8em;
  padding-left: 2em;
}

.table::-webkit-scrollbar-thumb {
  background-color: var(--white);
  border-radius: 0.4em;
}

.table::-webkit-scrollbar-thumb:hover {
  background-color: #ddd;
}

.table table {
  border-collapse: collapse;
  background: var(--aqua-input);
  border: solid 2px var(--white);
  text-align: center;
  font-size: 1em;
}

.table table td,
th {
  border: solid 2px var(--white);
  padding: 0.7em;
}

.table thead th {
  background: var(--aqua-back);
}

.tabla-carga {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--white);
}

.tabla-carga table td,
th {
  padding: 0.7em;
}

.esqueleto {
  height: 20px; /* Altura de fila de esqueleto */
  background-color: var(--aqua-back); /* Color de fondo gris para esqueleto */
  border-top: 1px solid var(--aqua-input);
}
</style>
