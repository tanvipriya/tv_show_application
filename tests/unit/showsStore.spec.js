import { setActivePinia, createPinia } from 'pinia';
import { useShowsStore } from '@/store/showsStore';
import axios from 'axios';

jest.mock('axios');

describe('useShowsStore', () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useShowsStore();
        localStorage.clear();
        jest.clearAllMocks();
    });

    /* -------------------------
     * Fetch Shows By Genre
     * ------------------------ */
    it('fetches shows by genre and updates state', async () => {
        const mockData = [
            { id: 1, name: 'Show A', genres: ['Drama'], rating: { average: 8 }, image: {} },
            { id: 2, name: 'Show B', genres: ['Comedy'], rating: { average: 6 }, image: null },
        ];
        axios.get.mockResolvedValue({ data: mockData });

        await store.fetchShowsByGenrePage('Drama', 0);

        expect(store.loading).toBe(false);
        expect(store.error).toBeNull();
        expect(store.showsByGenre['Drama']).toHaveLength(1);
        expect(store.pagesLoaded['Drama']).toBe(0);

        // Snapshot of showsByGenre
        expect(store.showsByGenre).toMatchSnapshot();
        expect(store.pagesLoaded).toMatchSnapshot();
    });

    it('handles fetch error', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        await store.fetchShowsByGenrePage('Drama', 0);

        expect(store.error).toBe('Network error');
        expect(store.loading).toBe(false);

        // Snapshot of error state
        expect(store.error).toMatchSnapshot();
    });

    /* -------------------------
     * Favorites
     * ------------------------ */
    it('toggles favorite correctly', () => {
        store.toggleFavorite(1);
        expect(store.favorites).toContain(1);

        store.toggleFavorite(1);
        expect(store.favorites).not.toContain(1);

        // Snapshot of favorites
        expect(store.favorites).toMatchSnapshot();
    });

    it('checks if a show is favorite', () => {
        store.favorites = [1, 2];
        expect(store.isFavorite(1)).toBe(true);
        expect(store.isFavorite(3)).toBe(false);

        expect(store.favorites).toMatchSnapshot();
    });

    /* -------------------------
     * Search Shows
     * ------------------------ */
    it('fetches shows by name', async () => {
        const mockSearchData = [
            { show: { id: 10, name: 'Search Show' } },
        ];
        axios.get.mockResolvedValue({ data: mockSearchData });

        await store.fetchShowsByName('Search Show');

        expect(store.loading).toBe(false);
        expect(store.searchResults).toHaveLength(1);
        expect(store.searchResults[0].name).toBe('Search Show');

        // Snapshot of search results
        expect(store.searchResults).toMatchSnapshot();
    });

    it('handles empty search', async () => {
        await store.fetchShowsByName('');
        expect(store.loading).toBe(false);
        expect(store.searchResults).toEqual([]);

        expect(store.searchResults).toMatchSnapshot();
    });

    /* -------------------------
     * Filters & Sorting
     * ------------------------ */
    it('sorts and filters shows correctly', () => {
        store.showsByGenre = {
            Drama: [
                { id: 1, name: 'Show A', rating: { average: 7 }, image: {} },
                { id: 2, name: 'Show B', rating: { average: 9 }, image: null },
                { id: 3, name: 'Show C', rating: { average: 10 }, image: { medium: 'img.jpg' } },
            ],
        };

        store.setFilters({ hasImage: true, minRating: 8 });
        const result1 = store.sortedFilteredShows('Drama');
        expect(result1).toHaveLength(1);
        expect(result1[0].name).toBe('Show C');

        store.setFilters({ hasImage: false, minRating: 8 });
        const result2 = store.sortedFilteredShows('Drama');
        expect(result2).toHaveLength(2);
        expect(result2[0].name).toBe('Show C');
        expect(result2[1].name).toBe('Show B');

        // Snapshot of sorted & filtered results
        expect(result1).toMatchSnapshot();
        expect(result2).toMatchSnapshot();
    });

    /* -------------------------
     * Episodes
     * ------------------------ */
    it('fetches episodes for a show', async () => {
        const mockEpisodes = [{ id: 1, name: 'Episode 1' }];
        axios.get.mockResolvedValue({ data: mockEpisodes });

        await store.fetchEpisodes(1);
        expect(store.episodesByShow[1]).toHaveLength(1);
        expect(store.episodesByShow[1][0].name).toBe('Episode 1');

        // Snapshot of episodes
        expect(store.episodesByShow).toMatchSnapshot();

        await store.fetchEpisodes(1);
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    /* -------------------------
     * Fetch Next Page
     * ------------------------ */
    it('fetchNextPage increments page correctly', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Show A', genres: ['Drama'], rating: { average: 8 }, image: {} },
            ]
        });

        await store.fetchNextPage('Drama');
        await store.fetchNextPage('Drama');

        expect(store.pagesLoaded['Drama']).toBe(1);
        expect(store.showsByGenre['Drama']).toHaveLength(2);

        // Snapshot of showsByGenre and pagesLoaded
        expect(store.showsByGenre).toMatchSnapshot();
        expect(store.pagesLoaded).toMatchSnapshot();
    });
});
