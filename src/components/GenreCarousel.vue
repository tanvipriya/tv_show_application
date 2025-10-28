<template>
  <div class="genre-carousel">
    <div class="carousel-header">
      <h2>{{ genre }}</h2>
      <router-link
        :to="{ name: 'GenreView', params: { genre } }"
        class="see-all"
      >
        See All
      </router-link>
    </div>

    <div class="carousel-container">
      <router-link
        v-for="show in shows"
        :key="show.id"
        :to="{ name: 'ShowDetail', params: { id: show.id } }"
        class="show-link"
      >
        <ShowCard :show="show" />
      </router-link>
    </div>

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useShowsStore } from "@/store/showsStore";
import ShowCard from "./ShowCard.vue";

const props = defineProps({
  genre: String,
});

const store = useShowsStore();

// Compute shows for this genre
const shows = computed(() => store.showsByGenre[props.genre] || []);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

onMounted(async () => {
  // Load first batch if not loaded yet
  if (!store.showsByGenre[props.genre]) {
    await store.fetchNextPage(props.genre); // <--- updated function
  }
});
</script>

<style scoped>
.genre-carousel {
  margin-bottom: 24px;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.carousel-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 12px;
  padding-bottom: 8px;
}

.carousel-container::-webkit-scrollbar {
  height: 8px;
}

.carousel-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.show-link {
  text-decoration: none;
  color: inherit;
}

.see-all {
  font-size: 0.85rem;
  color: #004c4d;
  text-decoration: none;
}

.error {
  color: red;
}
</style>
