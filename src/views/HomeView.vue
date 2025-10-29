<template>
  <div>
    <h1 class="search-title"><i class="fas fa-tv"></i> TV Shows Dashboard</h1>
    <p class="search-subtitle">Find your favorite shows quickly</p>

    <!-- Search input -->
    <SearchResultsView v-model="searchQuery" />

    <!-- Search results -->
    <div v-if="searchQuery">
      <p v-if="filteredResults.length === 0">
        No results found for "{{ searchQuery }}"
      </p>
      <div class="results" v-else>
        <div
          v-for="show in filteredResults"
          :key="show.id"
          class="show-card"
          @click="goToShowDetail(show.id)"
        >
          <ShowCard :show="show" />
        </div>
      </div>
    </div>

    <!-- Genre carousels (hide if searchQuery is not empty) -->
    <div v-if="!searchQuery">
      <GenreCarousel genre="Drama" />
      <GenreCarousel genre="Comedy" />
      <GenreCarousel genre="Action" />
      <GenreCarousel genre="Sports" />
      <GenreCarousel genre="Horror" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useShowsStore } from "@/store/showsStore";
import SearchResultsView from "@/views/SearchResultsView.vue";
import GenreCarousel from "@/components/GenreCarousel.vue";
import ShowCard from "@/components/ShowCard.vue";

const router = useRouter();
const store = useShowsStore();

// Search input
const searchQuery = ref("");

// Filter shows by searchQuery
const filteredResults = computed(() => {
  if (!searchQuery.value) return [];
  const lowerQuery = searchQuery.value.toLowerCase();
  const allShows = Object.values(store.showsByGenre).flat();
  return allShows.filter((show) =>
    show.name.toLowerCase().includes(lowerQuery)
  );
});

// Navigate to show detail
function goToShowDetail(showId) {
  router.push({ name: "ShowDetail", params: { id: showId } });
}
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.search-header {
  margin-bottom: 16px;
}

.search-title {
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px; /* space between icon and text */
  color: #004c4d;
}

.search-subtitle {
  font-size: 1rem;
  color: #555;
  margin-top: 4px;
}

.results {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.show-card {
  cursor: pointer;
  width: 150px;
}
</style>
