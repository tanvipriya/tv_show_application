import { ref } from 'vue';
import axios from 'axios';

export function useShows() {
    const shows = ref([]);
    const loading = ref(false);
    const error = ref(null);

    /**
     * Fetch TV shows from the API
     * @param {number} page - Page number to fetch (default: 0)
     */
    const fetchShows = async (page = 0) => {
        loading.value = true;
        error.value = null;

        try {
            const { data } = await axios.get(`https://api.tvmaze.com/shows`, {
                params: { page }
            });
            shows.value = data;
        } catch (err) {
            error.value = err?.response?.data || err.message || 'Unknown error';
            console.error('Error fetching shows:', error.value);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Clear the shows list
     */
    const clearShows = () => {
        shows.value = [];
    };

    return {
        shows,
        loading,
        error,
        fetchShows,
        clearShows
    };
}
