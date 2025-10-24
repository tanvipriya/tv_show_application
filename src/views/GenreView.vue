<template>
  <div class="genre-view">
    <h1>{{ genre }} Shows</h1>

    <div class="shows-grid">
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </div>

    <p v-if="loading" class="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <button v-if="!loading && hasMore" @click="loadMore" class="load-more">
      Load More
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useShowsStore } from "@/store/showsStore";
import ShowCard from "@/components/ShowCard.vue";

const route = useRoute();
const genre = route.params.genre; // from route params
console.log("genre", genre);

const store = useShowsStore();
const page = ref(0);
const pageSize = 20; // number of shows per page
const hasMore = ref(true);

const shows = computed(() => {
  return store.showsByGenre[genre]?.slice(0, (page.value + 1) * pageSize) || [];
});
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// Load initial shows
onMounted(async () => {
  if (!store.showsByGenre[genre]) {
    await store.fetchShowsByGenre(genre);
  }
});

// Load more shows (infinite scroll or "Load More" button)
function loadMore() {
  if (!store.showsByGenre[genre]) return;
  page.value += 1;

  // Check if we reached the end
  if ((page.value + 1) * pageSize >= store.showsByGenre[genre].length) {
    hasMore.value = false;
  }
}
</script>

<style scoped>
.genre-view {
  padding: 16px;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.shows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.loading {
  text-align: center;
  margin: 16px 0;
}

.error {
  color: red;
  text-align: center;
  margin: 16px 0;
}

.load-more {
  display: block;
  margin: 24px auto;
  padding: 8px 16px;
  background-color: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.load-more:hover {
  background-color: #187bcd;
}
</style>
