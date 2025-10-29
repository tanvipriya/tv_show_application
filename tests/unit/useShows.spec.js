import { ref } from 'vue';
import axios from 'axios';
import { useShows } from '@/composables/useShows'; // adjust the import path as needed

jest.mock('axios');

describe('useShows composable with snapshots', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('initializes with default values', () => {
        const { shows, loading, error } = useShows();

        // Snapshot of initial state
        expect({ shows: shows.value, loading: loading.value, error: error.value }).toMatchSnapshot();
    });

    it('fetches shows successfully', async () => {
        const mockData = [
            { id: 1, name: 'Breaking Bad' },
            { id: 2, name: 'Friends' },
        ];
        axios.get.mockResolvedValueOnce({ data: mockData });

        const { shows, loading, error, fetchShows } = useShows();

        // Trigger fetch
        const promise = fetchShows(0);

        // Snapshot immediately after calling fetchShows (loading should be true)
        expect({ shows: shows.value, loading: loading.value, error: error.value }).toMatchSnapshot('loading state');

        await promise; // wait for fetch to resolve

        // Snapshot after successful fetch
        expect({ shows: shows.value, loading: loading.value, error: error.value }).toMatchSnapshot('after successful fetch');
    });

    it('handles API errors correctly', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const mockError = { response: { data: 'API Error Message' } };
        axios.get.mockRejectedValueOnce(mockError);

        const { shows, loading, error, fetchShows } = useShows();
        await fetchShows(1);

        expect({ shows: shows.value, loading: loading.value, error: error.value }).toMatchSnapshot();

        consoleSpy.mockRestore();
    });

    it('handles unknown errors gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        axios.get.mockRejectedValueOnce(new Error('Network issue'));

        const { error, fetchShows } = useShows();
        await fetchShows();

        expect({ error: error.value }).toMatchSnapshot();

        consoleSpy.mockRestore();
    });


    it('clears shows list', () => {
        const { shows, clearShows } = useShows();
        shows.value = [{ id: 1, name: 'Test Show' }];

        clearShows();

        // Snapshot after clearing shows
        expect({ shows: shows.value }).toMatchSnapshot('after clearing shows');
    });
});
