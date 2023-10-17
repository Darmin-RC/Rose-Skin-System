<template>
  <div class="dashboard">
    <div class="table">
      <h2>Dashboard</h2>
      <div class="menu">
        <div class="total">
          <h4>Pacientes totales: {{ pacientes.length }}</h4>
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
        </table>

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

.total,
.seleccionar-todo {
  width: 50%;
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
}
.table table {
  border-collapse: collapse;
  background: var(--aqua-back);
  border: solid 2px var(--white);
  text-align: center;
  font-size: 1em;
}

.table table td,
th {
  border: solid 2px var(--white);
  padding: 0.7em;
}
</style>
