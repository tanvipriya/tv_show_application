<template>
  <div class="show-detail">
    <!-- Back Button -->
    <button @click="goBack" class="back-btn">← Back to Dashboard</button>

    <!-- Loading & Error -->
    <div v-if="loading" class="loading">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-poster"></div>
      <div class="skeleton skeleton-text" v-for="n in 3" :key="n"></div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Show Details -->
    <div v-if="show" class="content">
      <h1 class="title">{{ show.name }}</h1>

      <div class="main-info">
        <!-- Poster -->
        <img :src="show.image?.original || placeholder" :alt="show.name" />

        <!-- Basic Info -->
        <div class="info">
          <p><strong>Rating:</strong> ⭐ {{ show.rating?.average || "N/A" }}</p>
          <p><strong>Genres:</strong> {{ show.genres.join(", ") || "N/A" }}</p>
          <p><strong>Runtime:</strong> {{ show.runtime || "N/A" }} min</p>
          <p><strong>Premiered:</strong> {{ show.premiered || "N/A" }}</p>
          <p v-if="show.network">
            <strong>Network:</strong> {{ show.network.name }}
          </p>
          <p v-if="show.officialSite">
            <strong>Official Site:</strong>
            <a :href="show.officialSite" target="_blank">
              {{ show.officialSite }}
            </a>
          </p>
        </div>
      </div>

      <!-- Summary (HTML-safe) -->
      <div class="summary" v-html="show.summary"></div>

      <!-- Episodes / Seasons -->
      <div v-if="episodes.length" class="episodes">
        <h2>Episodes / Seasons</h2>

        <!-- Filters -->
        <div class="filters">
          <label>
            Season:
            <select v-model="selectedSeason">
              <option value="">All</option>
              <option v-for="s in seasons" :key="s" :value="s">
                Season {{ s }}
              </option>
            </select>
          </label>

          <label>
            Min Rating:
            <input
              type="number"
              v-model.number="minRating"
              min="0"
              max="10"
              step="0.1"
            />
          </label>

          <label>
            Search:
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Filter by episode name..."
            />
          </label>
        </div>

        <!-- Episode List -->
        <ul v-if="filteredEpisodes.length" class="episode-list">
          <li v-for="ep in filteredEpisodes" :key="ep.id" class="episode-card">
            <img
              v-if="ep.image"
              :src="ep.image.medium"
              :alt="ep.name"
              class="episode-thumb"
            />
            <div class="episode-info">
              <h3>{{ ep.name }}</h3>
              <p>Season {{ ep.season }}, Episode {{ ep.number }}</p>
              <p v-if="ep.rating?.average">⭐ {{ ep.rating.average }}</p>
              <p v-html="ep.summary"></p>
            </div>
          </li>
        </ul>

        <p v-else-if="!loading && !error" class="no-results">
          No episodes match your filters.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// Get route param for show ID
const route = useRoute();
const router = useRouter();
const showId = route.params.id;

// Reactive references
const show = ref(null);
const episodes = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedSeason = ref("");
const minRating = ref(0);
const searchTerm = ref("");

// Placeholder image
const placeholder = "https://via.placeholder.com/300x450?text=No+Image";

// Derived data
const seasons = computed(() => {
  const unique = new Set(episodes.value.map((e) => e.season));
  return Array.from(unique).sort((a, b) => a - b);
});

const filteredEpisodes = computed(() =>
  episodes.value
    .filter(
      (ep) =>
        !selectedSeason.value || ep.season === Number(selectedSeason.value)
    )
    .filter((ep) => (ep.rating?.average || 0) >= minRating.value)
    .filter((ep) =>
      ep.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
);

// Fetch show details + episodes
async function fetchShowDetails() {
  loading.value = true;
  error.value = null;

  try {
    const showRes = await axios.get(`https://api.tvmaze.com/shows/${showId}`);
    show.value = showRes.data;

    const epRes = await axios.get(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    episodes.value = epRes.data;
  } catch (err) {
    error.value = err.message || "Failed to fetch show details";
  } finally {
    loading.value = false;
  }
}

// Navigate back
function goBack() {
  router.back();
}

// Mount
onMounted(fetchShowDetails);
</script>

<style scoped>
.show-detail {
  padding: 16px;
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

.loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  background: #eee;
  border-radius: 6px;
  animation: pulse 1.2s infinite ease-in-out;
}

.skeleton-title {
  width: 60%;
  height: 24px;
}

.skeleton-poster {
  width: 300px;
  height: 450px;
}

.skeleton-text {
  width: 80%;
  height: 16px;
}

@keyframes pulse {
  0% {
    background: #eee;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #eee;
  }
}

.error {
  text-align: center;
  color: red;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  margin-bottom: 16px;
}

.main-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.main-info img {
  width: 300px;
  border-radius: 8px;
  object-fit: cover;
}

.info {
  flex: 1;
  min-width: 250px;
}

.summary {
  margin-top: 16px;
  line-height: 1.5;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filters label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

input,
select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.episodes {
  margin-top: 24px;
}

.episode-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.episode-card {
  display: flex;
  gap: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
}

.episode-thumb {
  width: 120px;
  border-radius: 6px;
  object-fit: cover;
}

.episode-info h3 {
  margin: 0;
}

.no-results {
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>
