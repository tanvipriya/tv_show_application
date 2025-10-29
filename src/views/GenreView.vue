<template>
  <div class="genre-view">
    <!-- Back Button -->
    <button @click="goBack" class="back-btn">← Back to Dashboard</button>

    <h1>{{ genre }} Shows</h1>

    <div class="shows-grid" ref="scrollContainer">
      <router-link
        v-for="show in shows"
        :key="show.id"
        :to="{ name: 'ShowDetail', params: { id: show.id } }"
        class="show-link"
      >
        <ShowCard :show="show" />
      </router-link>
    </div>

    <p v-if="loading" class="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useShowsStore } from "@/store/showsStore";
import ShowCard from "@/components/ShowCard.vue";

const route = useRoute();
const router = useRouter();
const genre = route.params.genre;

const store = useShowsStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// Navigate back
function goBack() {
  router.back();
}

// Compute shows for this genre, sorted by rating descending
const shows = computed(() => {
  const genreShows = store.showsByGenre[genre] || [];
  return [...genreShows].sort(
    (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)
  );
});

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

.show-link {
  text-decoration: none;
  color: inherit;
}

.loading,
.error {
  text-align: center;
  margin: 16px 0;
}

.back-btn {
  margin-bottom: 16px;
  padding: 6px 12px;
  background-color: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #187bcd;
}
</style>
