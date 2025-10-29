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
        expect(store.showsByGenre['Drama'][0].name).toBe('Show A');
    });

    it('handles fetch error', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        await store.fetchShowsByGenrePage('Drama', 0);

        expect(store.error).toBe('Network error');
        expect(store.loading).toBe(false);
    });

    /* -------------------------
     * Favorites
     * ------------------------ */
    it('toggles favorite correctly', () => {
        store.toggleFavorite(1);
        expect(store.favorites).toContain(1);
        expect(JSON.parse(localStorage.getItem('favorites'))).toContain(1);

        store.toggleFavorite(1);
        expect(store.favorites).not.toContain(1);
    });

    it('checks if a show is favorite', () => {
        store.favorites = [1, 2];
        expect(store.isFavorite(1)).toBe(true);
        expect(store.isFavorite(3)).toBe(false);
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
    });

    it('handles empty search', async () => {
        await store.fetchShowsByName('');
        expect(store.loading).toBe(false);
        expect(store.searchResults).toEqual([]);
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

        // Case 1: filter shows with hasImage = true and minRating = 8
        store.setFilters({ hasImage: true, minRating: 8 });
        const result1 = store.sortedFilteredShows('Drama');
        expect(result1).toHaveLength(1);
        expect(result1[0].name).toBe('Show C');

        // Case 2: filter shows with hasImage = false and minRating = 8
        store.setFilters({ hasImage: false, minRating: 8 });
        const result2 = store.sortedFilteredShows('Drama');
        expect(result2).toHaveLength(2);
        expect(result2[0].name).toBe('Show C'); // sorted by rating descending
        expect(result2[1].name).toBe('Show B');
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

        // Should not fetch again if already loaded
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

        // first page
        await store.fetchNextPage('Drama');
        expect(store.pagesLoaded['Drama']).toBe(0);
        expect(store.showsByGenre['Drama']).toHaveLength(1);

        // next page
        await store.fetchNextPage('Drama');
        expect(store.pagesLoaded['Drama']).toBe(1);
        expect(store.showsByGenre['Drama']).toHaveLength(2);
    });
});
