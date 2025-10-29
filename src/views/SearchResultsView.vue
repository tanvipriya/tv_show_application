<template>
  <div class="search-view">
    <input
      type="text"
      v-model="query"
      placeholder="Search TV shows..."
      @input="onSearch"
      class="search-input"
    />

    <!-- Loading skeletons -->
    <div v-if="loading" class="results">
      <div class="show-card-skeleton" v-for="n in 6" :key="n"></div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Results -->
    <div v-if="results.length" class="results">
      <div
        v-for="show in results"
        :key="show.id"
        class="show-card"
        @click="goToShowDetail(show.id)"
      >
        <ShowCard :show="show" @toggle-favorite="toggleFavorite(show.id)" />
      </div>
    </div>

    <p v-else-if="query && !loading">No results found</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useShowsStore } from "@/store/showsStore";
import ShowCard from "@/components/ShowCard.vue";
import debounce from "lodash/debounce";

const store = useShowsStore();
const router = useRouter();
const query = ref("");

const results = computed(() => {
  if (!query.value) return [];
  const lowerQuery = query.value.toLowerCase();
  if (store.searchResults.length) {
    return store.searchResults.filter((show) =>
      show.name.toLowerCase().includes(lowerQuery)
    );
  }
  const allShows = Object.values(store.showsByGenre).flat();
  return allShows.filter((show) =>
    show.name.toLowerCase().includes(lowerQuery)
  );
});

const loading = computed(() => store.loading);
const error = computed(() => store.error);

function goToShowDetail(showId) {
  router.push({ name: "ShowDetail", params: { id: showId } });
}

function toggleFavorite(showId) {
  store.toggleFavorite(showId);
}

const onSearch = debounce(async () => {
  if (!query.value) return;
  await store.fetchShowsByName(query.value);
}, 300);
</script>

<style scoped>
.search-view {
  padding: 16px;
}
.search-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 1rem;
  margin-bottom: 16px;
}
.results {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.show-card {
  cursor: pointer;
  width: 150px;
}
.show-card-skeleton {
  width: 150px;
  height: 220px;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.error {
  color: red;
  margin-top: 8px;
}
</style>
