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
import { ref } from "vue";
import { updateDoc, doc } from "firebase/firestore";

export default {
  props: {
    paciente: Object,
    db: Object,
  },
  data() {
    return {
      pacienteEditado: { ...this.paciente },
    };
  },
  watch: {
    paciente: {
      immediate: true,
      handler(newPaciente) {
        this.pacienteEditado = { ...newPaciente };
      },
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
