<template>
  <div class="editar-paciente">
    <h2>Editar Paciente</h2>
    <label for="nombre">Nombre:</label>
    <input v-model="pacienteEditado.nombre" type="text" id="nombre" />
    <label for="diagnostico">Diagnóstico:</label>
    <input v-model="pacienteEditado.diagnostico" type="text" id="diagnostico" />
    <label for="telefono">Teléfono:</label>
    <input v-model="pacienteEditado.telefono" type="number" id="telefono" />
    <label for="edad">Edad:</label>
    <input v-model="pacienteEditado.edad" type="number" id="edad" />
    <label for="medicamento">Medicamento:</label>
    <input v-model="pacienteEditado.medicamento" type="text" id="medicamento" />

    <!-- Agrega más campos según sea necesario -->
    <br />
    <h2>Editar Recomendación</h2>
    <br />
    <label for="seleccionRecomendacion"
      >Seleccionar Recomendación Existente:</label
    >
    <select v-model="selectedRecomendacion" id="seleccionRecomendacion">
      <option value="">
        Seleccione una recomendación para tratar:
        {{ pacienteEditado.diagnostico }}
      </option>
      <option
        v-for="recomendacion in recomendaciones"
        :value="recomendacion.id"
        :key="recomendacion.id"
      >
        {{ recomendacion.nombre }}
      </option>
    </select>
    <br />
    <label for="limpiadora">Limpiadora:</label>
    <input v-model="pacienteEditado.limpiadora" type="text" id="limpiadora" />
    <label for="filtro">Filtro:</label>
    <input v-model="pacienteEditado.filtro" type="text" id="filtro" />
    <label for="cremaDia">Crema de día o hidratante:</label>
    <input v-model="pacienteEditado.cremaDia" type="text" id="cremaDia" />
    <label for="contorno">Contorno:</label>
    <input v-model="pacienteEditado.contorno" type="text" id="contorno" />
    <label for="cremaNoche">Crema de noche:</label>
    <input v-model="pacienteEditado.cremaNoche" type="text" id="cremaNoche" />
    <label for="blanqueadora">Blanqueadora:</label>
    <input
      v-model="pacienteEditado.blanqueadora"
      type="text"
      id="blanqueadora"
    />
    <label for="proceso">Proceso:</label>
    <textarea
      v-model="pacienteEditado.proceso"
      type="text"
      id="proceso"
      cols="30"
      rows="5"
    ></textarea>

    <div class="buttons">
      <button style="background: var(--red)" @click="cancelarEdicion">
        Cancelar
      </button>
      <button style="background: var(--blue)" @click="guardarEdicion">
        Guardar
      </button>
    </div>
    <p>
      Editando al Paciente: <span>{{ pacienteEditado.nombre }}</span> con el ID:
      <span>{{ pacienteEditado.id }}</span>
    </p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  updateDoc,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

export default {
  props: {
    paciente: Object,
    db: Object,
  },
  data() {
    return {
      pacienteEditado: { ...this.paciente },
      selectedRecomendacion: "",
      recomendaciones: [], // Lista de recomendaciones desde la base de datos
    };
  },

  watch: {
    paciente: {
      immediate: true,
      handler(newPaciente) {
        this.pacienteEditado = { ...newPaciente };
      },
    },
    selectedRecomendacion(newVal) {
      if (newVal) {
        // Cargar datos de la recomendación seleccionada y llenar los campos
        this.cargarDatosRecomendacion(newVal);
      }
    },
  },

  methods: {
    cancelarEdicion() {
      this.$emit("cancelar");
    },
    async guardarEdicion() {
      if (this.paciente) {
        try {
          const pacienteRef = doc(
            this.db,
            "pacientes",
            this.pacienteEditado.id
          );
          await updateDoc(pacienteRef, this.pacienteEditado);
          this.$emit("edicion-completada");
          this.$emit("cancelar");
        } catch (error) {
          console.error("Error al guardar la edición:", error);
        }
      } else {
        console.error("No se ha seleccionado un paciente para editar.");
      }
    },
    async cargarDatosRecomendacion(recomendacionId) {
      try {
        const recomendacionRef = doc(this.db, "pacientes", recomendacionId);
        const recomendacionData = (await getDoc(recomendacionRef)).data();

        // Asignar los valores de la recomendación seleccionada a los campos de edición de recomendación
        this.pacienteEditado.limpiadora = recomendacionData.limpiadora || "";
        this.pacienteEditado.filtro = recomendacionData.filtro || "";
        this.pacienteEditado.cremaDia = recomendacionData.cremaDia || "";
        this.pacienteEditado.contorno = recomendacionData.contorno || "";
        this.pacienteEditado.cremaNoche = recomendacionData.cremaNoche || "";
        this.pacienteEditado.blanqueadora =
          recomendacionData.blanqueadora || "";
        this.pacienteEditado.proceso = recomendacionData.proceso || "";
      } catch (error) {
        console.error("Error al cargar los datos de la recomendación:", error);
      }
    },
  },

  async created() {
    // Cargar las recomendaciones disponibles al iniciar el componente
    try {
      const recomendacionesCollection = collection(this.db, "pacientes");
      const recomendacionesSnapshot = await getDocs(recomendacionesCollection);

      this.recomendaciones = recomendacionesSnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre, // Asegúrate de que esto coincida con la estructura de tus documentos de pacientes
      }));
    } catch (error) {
      console.error(
        "Error al cargar las recomendaciones desde Firebase:",
        error
      );
    }
  },
};
</script>

<style>
.editar-paciente {
  display: flex;
  width: 50vw;
  position: absolute;
  flex-direction: column;
  margin: 1em;
  background: #000;
  padding: 1em;
  border-radius: 0.6em;
}

.editar-paciente h2 {
  text-align: center;
}

.editar-paciente input {
  padding: 0.5em 0.8em;
  margin-top: 0.3em;
  font-size: 1em;
}

.editar-paciente textarea {
  width: 100%;
  padding: 0.5em;
  margin: 0.1em;
  font-size: 1em;
}

.editar-paciente select {
  border: solid 1px var(--white);
  border-radius: 1em;
  padding: 0.3em;
  background: var(--aqua-back);
  color: var(--white);
  font-size: 1em;
  outline: none;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1em;
}

.buttons button {
  margin: 0 1em;
  padding: 0.5em 1.3em;
  font-size: 1em;
}

p span {
  font-style: italic;
}
</style>
