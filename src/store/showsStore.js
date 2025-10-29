import { defineStore } from 'pinia';
import axios from 'axios';

export const useShowsStore = defineStore('shows', {
    state: () => ({
        showsByGenre: {},          // { genreName: [shows] }
        pagesLoaded: {},           // { genreName: number of pages loaded }
        searchResults: [],         // array of shows for search
        loading: false,
        error: null,
        filters: {
            hasImage: false,
            minRating: 0,
        },
        favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
        episodesByShow: {},        // episodes for each show
    }),

    actions: {
        /* -----------------------------------
         * Genre Fetching & Infinite Scroll
         * ----------------------------------- */
        async fetchShowsByGenrePage(genre, page = 0) {
            this.loading = true;
            this.error = null;

            try {
                const res = await axios.get(`https://api.tvmaze.com/shows?page=${page}`);
                const shows = res.data;

                // Filter shows by genre
                const filtered = shows.filter((show) => show.genres.includes(genre));

                // Initialize arrays if not exist
                if (!this.showsByGenre[genre]) {
                    this.showsByGenre[genre] = [];
                    this.pagesLoaded[genre] = 0;
                }

                // Append new shows
                this.showsByGenre[genre].push(...filtered);
                this.pagesLoaded[genre] = page;
            } catch (err) {
                this.error = err.message || 'Failed to fetch shows';
            } finally {
                this.loading = false;
            }
        },

        async fetchNextPage(genre) {
            const nextPage = this.pagesLoaded[genre] !== undefined ? this.pagesLoaded[genre] + 1 : 0;
            await this.fetchShowsByGenrePage(genre, nextPage);
        },

        /* -----------------------------------
         * Favorites / Bookmark
         * ----------------------------------- */
        toggleFavorite(showId) {
            if (this.favorites.includes(showId)) {
                this.favorites = this.favorites.filter((id) => id !== showId);
            } else {
                this.favorites.push(showId);
            }
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        },

        isFavorite(showId) {
            return this.favorites.includes(showId);
        },

        /* -----------------------------------
         * Search Shows
         * ----------------------------------- */
        async fetchShowsByName(name) {
            this.loading = true;
            this.error = null;
            this.searchResults = [];

            if (!name) {
                this.loading = false;
                return;
            }

            try {
                const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${name}`);
                this.searchResults = res.data.map((r) => r.show);
            } catch (err) {
                this.error = err.message || 'Failed to search shows';
            } finally {
                this.loading = false;
            }
        },

        /* -----------------------------------
         * Sorting & Filtering
         * ----------------------------------- */
        setFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters };
        },

        sortedFilteredShows(genre) {
            const shows = this.showsByGenre[genre] || [];
            return [...shows]
                .filter(show => !this.filters.hasImage || show.image)
                .filter(show => !this.filters.minRating || (show.rating?.average ?? 0) >= this.filters.minRating)
                .sort((a, b) => (b.rating?.average ?? -1) - (a.rating?.average ?? -1));
        },

        /* -----------------------------------
         * Episode Listing
         * ----------------------------------- */
        async fetchEpisodes(showId) {
            if (this.episodesByShow[showId]) return;
            try {
                const res = await axios.get(`https://api.tvmaze.com/shows/${showId}/episodes`);
                this.episodesByShow[showId] = res.data;
            } catch (err) {
                console.error(err);
            }
        },
    },
});