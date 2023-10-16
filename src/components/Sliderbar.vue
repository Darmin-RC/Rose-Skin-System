<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="sliderbar">
    <div class="logo">
      <img src="../assets/logo.svg" alt="" />
      <h1>Rose Skin</h1>
    </div>
    <div class="links">
      <RouterLink to="/">
        <i class="fab fa-wpforms" style="color: var(--blue)"></i>
        Formulario
      </RouterLink>
      <RouterLink to="/dashboard">
        <i class="fas fa-database" style="color: var(--orange)"></i>
        Dashboard
      </RouterLink>
    </div>
  </div>
  <RouterView />
</template>

<style scoped>
.sliderbar {
  display: flex;
  position: fixed;
  flex-direction: column;
  width: 20vw;
  height: 100vh;
  background: #252525;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20%;
  padding: 1.2em 0.2em;
}

.logo img {
  height: 100%;
}

.logo h1 {
  padding: 0 0.3em;
  font-size: 1.4em;
}

.links {
  display: flex;
  flex-direction: column;
  height: 80%;
}

.links a {
  padding: 0.7em 1em;
  margin: 0.3em 1.5em;
  border-radius: 0.7em;
  font-size: 1.2em;
  background: #3f3f3f;
}

.links a i {
  font-size: 1.2em;
}
</style>
