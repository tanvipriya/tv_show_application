<template>
  <div>
    <h1>TV Shows Dashboard</h1>
    <GenreCarousel genre="Drama" />
    <GenreCarousel genre="Comedy" />
    <GenreCarousel genre="Action" />
    <GenreCarousel genre="Sports" />
    <GenreCarousel genre="Horror" />
  </div>
</template>

<script setup>
import GenreCarousel from "@/components/GenreCarousel.vue";
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 16px;
}
</style>
