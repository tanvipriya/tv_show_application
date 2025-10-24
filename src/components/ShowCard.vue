<template>
  <div class="show-card">
    <img :src="show.image?.medium || placeholder" :alt="show.name" />
    <h3 class="show-name">{{ show.name }}</h3>
    <p class="show-rating">⭐ {{ show.rating?.average || "N/A" }}</p>
    <p class="show-year">{{ show.premiered?.slice(0, 4) || "N/A" }}</p>
  </div>
</template>

<script setup>
defineProps({
  show: Object,
});

const placeholder = "https://via.placeholder.com/150x225?text=No+Image";
</script>

<style scoped>
.show-card {
  min-width: 150px;
  margin: 0 8px;
  text-align: center;
  flex-shrink: 0;
}
.show-card img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}
.show-name {
  font-size: 0.9rem;
  margin: 4px 0 2px 0;
}
.show-rating,
.show-year {
  font-size: 0.8rem;
  margin: 1px 0;
}
</style>
