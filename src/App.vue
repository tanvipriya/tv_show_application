<template>
  <div id="app" class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1 class="app-title">TV Shows Dashboard</h1>
      <router-link to="/" class="home-link">Home</router-link>
      <router-link to="/search" class="search-link">Search</router-link>
    </header>

    <!-- Main content -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2025 TV Shows Dashboard. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// Nothing needed here yet
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #1e1e2f;
  color: #fff;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.app-header a {
  color: #fff;
  text-decoration: none;
  margin-left: 16px;
}

.app-main {
  flex: 1;
  padding: 24px;
  background-color: #f5f5f5;
}

.app-footer {
  text-align: center;
  padding: 16px;
  background-color: #1e1e2f;
  color: #fff;
  font-size: 0.9rem;
}
</style>
