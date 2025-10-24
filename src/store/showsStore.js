import { defineStore } from 'pinia';
import axios from 'axios';

export const useShowsStore = defineStore('shows', {
    state: () => ({
        showsByGenre: {}, // { drama: [...], comedy: [...] }
        loading: false,
        error: null
    }),
    actions: {
        async fetchShowsByGenre(genre) {
            this.loading = true;
            this.error = null;
            try {
                // Fetch first 2 pages (TVMaze has 250 shows per page)
                const pages = [0, 1];
                let allShows = [];

                for (const page of pages) {
                    const res = await axios.get(`https://api.tvmaze.com/shows?page=${page}`);
                    allShows = allShows.concat(res.data);
                }

                // Filter by genre
                const filtered = allShows.filter((show) => show.genres.includes(genre));

                // Sort by rating descending (null rating goes last)
                filtered.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0));

                this.showsByGenre[genre] = filtered;
            } catch (err) {
                this.error = err.message || 'Failed to fetch shows';
            } finally {
                this.loading = false;
            }
        }
    }
});
