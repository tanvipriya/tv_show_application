<template>
  <div class="show-detail">
    <!-- Back Button -->
    <button @click="goBack" class="back-btn">← Back to Dashboard</button>

    <!-- Loading & Error -->
    <div v-if="loading" class="loading">Loading show details...</div>
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
            <a :href="show.officialSite" target="_blank">{{
              show.officialSite
            }}</a>
          </p>
        </div>
      </div>

      <!-- Summary (HTML-safe) -->
      <div class="summary" v-html="show.summary"></div>

      <!-- Episodes / Seasons -->
      <div v-if="episodes.length" class="episodes">
        <h2>Episodes / Seasons</h2>
        <ul>
          <li v-for="ep in episodes" :key="ep.id">
            S{{ ep.season }}E{{ ep.number }} - {{ ep.name }} ({{ ep.airdate }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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

// Placeholder image
const placeholder = "https://via.placeholder.com/300x450?text=No+Image";

// Fetch show details
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

// Navigate back to previous page
function goBack() {
  router.back(); // preserves scroll position if returning to Home/Genre
}

// Fetch data on mount
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

.loading,
.error {
  text-align: center;
  margin: 16px 0;
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

.episodes {
  margin-top: 24px;
}

.episodes ul {
  list-style-type: none;
  padding: 0;
}

.episodes li {
  padding: 4px 0;
}
</style>
