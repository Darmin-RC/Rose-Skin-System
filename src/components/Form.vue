<template>
  <div class="form">
    <h2>Datos del Paciente</h2>
    <form @submit.prevent="submitForm">
      <label for="nombre">Nombre y Apellido:</label>
      <input v-model="formData.nombre" type="text" id="nombre" />
      <label for="edad">Edad:</label>
      <input v-model="formData.edad" type="number" id="edad" />
      <label for="telefono">Teléfono:</label>
      <input v-model="formData.telefono" type="tel" id="telefono" />
      <label for="medicamento">Medicamento que utiliza actualmente:</label>
      <input v-model="formData.medicamento" type="text" id="medicamento" />
      <label for="recomendado">Recomendado por:</label>
      <input v-model="formData.recomendado" type="text" id="recomendado" />
      <label for="anticonceptivo">¿Algún anticonceptivo?</label>
      <input
        v-model="formData.anticonceptivo"
        type="text"
        id="anticonceptivo"
      />
      <label for="alergias">¿Alergias?</label>
      <input v-model="formData.alergias" type="text" id="alergias" />
      <label for="diagnostico">Enfermedad diagnosticada:</label>
      <input v-model="formData.diagnostico" type="text" id="diagnostico" />
      <label for="piel">Tipo de piel:</label>
      <input v-model="formData.piel" type="text" id="piel" />
      <label for="sensibilidad">Sensibilidad y Fotoripo:</label>
      <input v-model="formData.sensibilidad" type="text" id="sensibilidad" />
      <label for="afeccion">Afección diagnosticada:</label>
      <input v-model="formData.afeccion" type="text" id="afeccion" />
      <label for="tratamiento">Plan de tratamiento:</label>
      <textarea
        v-model="formData.tratamiento"
        id="tratamiento"
        cols="30"
        rows="5"
      ></textarea>

      <div class="buttons">
        <button type="button" style="background: var(--red)">Cancelar</button>
        <button type="submit" style="background: var(--blue)">Guardar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { db } from "../firebase.js";
import { addDoc, collection } from "firebase/firestore";
import { ref } from "vue";

export default {
  setup() {
    const formData = ref({
      afeccion: "",
      alergias: "",
      anticonceptivo: "",
      diagnostico: "",
      edad: null,
      medicamento: "",
      nombre: "",
      piel: "",
      recomendado: "",
      sensibilidad: "",
      telefono: null,
      tratamiento: "",
      // Agrega más campos según tus necesidades
    });

    const submitForm = async () => {
      try {
        const docRef = await addDoc(
          collection(db, "pacientes"),
          formData.value
        );
        console.log("Documento ID:", docRef.id);
        // Limpia el formulario después de enviar los datos
        formData.value = {
          afeccion: "",
          alergias: "",
          anticonceptivo: "",
          diagnostico: "",
          edad: null,
          medicamento: "",
          nombre: "",
          piel: "",
          recomendado: "",
          sensibilidad: "",
          telefono: null,
          tratamiento: "",
          // Agrega más campos según tus necesidades
        };
      } catch (error) {
        console.error("Error al guardar en Firebase:", error);
      }
    };

    return {
      formData,
      submitForm,
    };
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  margin-left: 20vw;
  height: 100%;
  padding: 0.5em 2em;
}

.form h2 {
  padding: 0.2em 0;
  text-align: center;
}

.form form {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 90%;
  background: var(--aqua-back);
  padding: 1em;
  border-radius: 0.5em;
}

.form form label {
  padding: 0.3em;
  font-size: 1em;
}
.form form input {
  padding: 0.5em;
  margin: 0.1em;
  font-size: 1em;
}

.form textarea {
  width: 100%;
  padding: 0.5em;
  margin: 0.1em;
  font-size: 1em;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttons button {
  width: 20%;
  padding: 0.2em;
  margin: 1em;
  font-size: 1.5em;
}
</style>
