import { defineStore } from 'pinia';
import axios from 'axios';

export const useShowsStore = defineStore('shows', {
    state: () => ({
        showsByGenre: {},         // { genreName: [shows] }
        pagesLoaded: {},          // { genreName: number of pages loaded }
        loading: false,
        error: null
    }),
    actions: {
        /**
         * Fetch shows by genre dynamically using API pages.
         * @param {string} genre
         * @param {number} page - TVMaze API page number
         */
        async fetchShowsByGenrePage(genre, page = 0) {
            this.loading = true;
            this.error = null;

            try {
                const res = await axios.get(`https://api.tvmaze.com/shows?page=${page}`);
                const shows = res.data;

                // Filter shows by genre
                const filtered = shows.filter((show) => show.genres.includes(genre));

                // Initialize array if not exists
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

        /**
         * Load next batch for infinite scroll.
         */
        async fetchNextPage(genre) {
            const nextPage = this.pagesLoaded[genre] !== undefined ? this.pagesLoaded[genre] + 1 : 0;
            await this.fetchShowsByGenrePage(genre, nextPage);
        }
    }
});
