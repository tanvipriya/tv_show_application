<template>
  <div class="genre-view">
    <h1>{{ genre }} Shows</h1>

    <div class="shows-grid" ref="scrollContainer">
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </div>

    <p v-if="loading" class="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useShowsStore } from "@/store/showsStore";
import ShowCard from "@/components/ShowCard.vue";

const route = useRoute();
const genre = route.params.genre;

const store = useShowsStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const shows = computed(() => store.showsByGenre[genre] || []);

// Infinite scroll logic
const scrollContainer = ref(null);

async function loadNextBatch() {
  if (!loading.value) {
    await store.fetchNextPage(genre);
  }
}

function handleScroll() {
  const container = scrollContainer.value;
  if (!container || loading.value) return;

  if (
    container.scrollTop + container.clientHeight >=
    container.scrollHeight - 50
  ) {
    loadNextBatch();
  }
}

onMounted(async () => {
  if (!store.showsByGenre[genre]) {
    await store.fetchNextPage(genre); // load first batch
  }
  scrollContainer.value?.addEventListener("scroll", handleScroll);
});
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
  max-height: 80vh; /* optional to make container scrollable */
  overflow-y: auto;
}

.loading,
.error {
  text-align: center;
  margin: 16px 0;
}
</style>
