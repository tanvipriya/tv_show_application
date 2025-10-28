<template>
  <div class="show-card">
    <img
      v-if="show.image?.medium"
      :src="show.image.medium"
      :alt="show.name"
      class="poster"
    />
    <div class="details">
      <h3>{{ show.name }}</h3>
      <p>⭐ {{ show.rating?.average || "N/A" }}</p>
      <p>{{ show.premiered ? show.premiered.split("-")[0] : "—" }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Object,
});
</script>

<style scoped>
.show-card {
  width: 150px;
  margin-right: 12px;
  flex-shrink: 0;
}
.poster {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
}
.details {
  text-align: center;
  margin-top: 6px;
}
</style>
