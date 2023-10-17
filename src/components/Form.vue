<template>
  <div class="form">
    <h2>Datos del Paciente</h2>
    <form @submit.prevent="guardarDatos">
      <label for="nombre">Nombre y Apellido:</label>
      <input v-model="formData.nombre" type="text" id="nombre" required />
      <label for="edad">Edad:</label>
      <input v-model="formData.edad" type="number" id="edad" required />
      <label for="telefono">Teléfono:</label>
      <input v-model="formData.telefono" type="tel" id="telefono" required />
      <label for="medicamento">Medicamento que utiliza actualmente:</label>
      <input
        v-model="formData.medicamento"
        type="text"
        id="medicamento"
        required
      />
      <label for="recomendado">Recomendado por:</label>
      <input
        v-model="formData.recomendado"
        type="text"
        id="recomendado"
        required
      />
      <label for="anticonceptivo">¿Algún anticonceptivo?</label>
      <input
        v-model="formData.anticonceptivo"
        type="text"
        id="anticonceptivo"
        required
      />
      <label for="alergias">¿Alergias?</label>
      <input v-model="formData.alergias" type="text" id="alergias" required />
      <label for="diagnostico">Enfermedad diagnosticada:</label>
      <input
        v-model="formData.diagnostico"
        type="text"
        id="diagnostico"
        required
      />
      <label for="piel">Tipo de piel:</label>
      <input v-model="formData.piel" type="text" id="piel" required />
      <label for="sensibilidad">Sensibilidad y Fototipo:</label>
      <input
        v-model="formData.sensibilidad"
        type="text"
        id="sensibilidad"
        required
      />
      <label for="afeccion">Afección diagnosticada:</label>
      <input v-model="formData.afeccion" type="text" id="afeccion" required />
      <label for="tratamiento">Plan de tratamiento:</label>
      <textarea
        v-model="formData.tratamiento"
        id="tratamiento"
        cols="30"
        rows="5"
        required
      />
      <br />

      <h2>Recomendación</h2>
      <label for="limpiadora">Limpiadora:</label>
      <input v-model="limpiadora" type="text" id="limpiadora" />
      <label for="filtro">Filtro:</label>
      <input v-model="filtro" type="text" id="filtro" />
      <label for="cremaDia">Crema de día o hidratante:</label>
      <input v-model="cremaDia" type="text" id="cremaDia" />
      <label for="contorno">Contorno:</label>
      <input v-model="contorno" type="text" id="contorno" />
      <label for="cremaNoche">Crema de noche:</label>
      <input v-model="cremaNoche" type="text" id="cremaNoche" />
      <label for="blanqueadora">Blanqueadora:</label>
      <input v-model="blanqueadora" type="text" id="blanqueadora" />
      <label for="proceso">Proceso:</label>
      <textarea v-model="proceso" id="proceso" cols="30" rows="5" />

      <div class="buttons">
        <button type="button" style="background: var(--red)" @click="cancelar">
          Cancelar
        </button>
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
    });

    const limpiadora = ref("");
    const filtro = ref("");
    const cremaDia = ref("");
    const contorno = ref("");
    const cremaNoche = ref("");
    const blanqueadora = ref("");
    const proceso = ref("");

    const guardarDatos = async () => {
      try {
        const pacienteData = {
          ...formData.value,
          limpiadora: limpiadora.value,
          filtro: filtro.value,
          cremaDia: cremaDia.value,
          contorno: contorno.value,
          cremaNoche: cremaNoche.value,
          blanqueadora: blanqueadora.value,
          proceso: proceso.value,
        };

        const docRef = await addDoc(collection(db, "pacientes"), pacienteData);
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
        };

        // Limpia los campos de recomendación
        limpiadora.value = "";
        filtro.value = "";
        cremaDia.value = "";
        contorno.value = "";
        cremaNoche.value = "";
        blanqueadora.value = "";
        proceso.value = "";
      } catch (error) {
        console.error("Error al guardar en Firebase:", error);
      }
    };

    const cancelar = () => {
      // Limpia los campos de datos del paciente y recomendación
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
      };

      limpiadora.value = "";
      filtro.value = "";
      cremaDia.value = "";
      contorno.value = "";
      cremaNoche.value = "";
      blanqueadora.value = "";
      proceso.value = "";
    };

    return {
      formData,
      limpiadora,
      filtro,
      cremaDia,
      contorno,
      cremaNoche,
      blanqueadora,
      proceso,
      guardarDatos,
      cancelar,
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
