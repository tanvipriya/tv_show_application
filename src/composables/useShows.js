import { ref } from 'vue';
import axios from 'axios';

export function useShows() {
    const shows = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchShows = async (page = 0) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await axios.get(`https://api.tvmaze.com/shows?page=${page}`);
            shows.value = res.data;
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    return { shows, loading, error, fetchShows };
}
