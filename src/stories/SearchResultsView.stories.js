// src/stories/SearchResultsView.stories.js
import SearchResultsView from '@/views/SearchResultsView.vue';
import { reactive } from 'vue';
import { useShowsStore } from '@/store/showsStore';

export default {
    title: 'Views/SearchResultsView',
    component: SearchResultsView,
    parameters: {
        layout: 'fullscreen',
    },
};

const mockShows = [
    {
        id: 1,
        name: 'Mock Drama Show',
        rating: { average: 8.5 },
        premiered: '2024-01-01',
        image: { medium: 'https://via.placeholder.com/150x225?text=Drama' },
    },
    {
        id: 2,
        name: 'Mock Comedy Show',
        rating: { average: 7.9 },
        premiered: '2023-06-15',
        image: { medium: 'https://via.placeholder.com/150x225?text=Comedy' },
    },
    {
        id: 3,
        name: 'Mock Sports Show',
        rating: { average: 8.2 },
        premiered: '2022-09-10',
        image: { medium: 'https://via.placeholder.com/150x225?text=Sports' },
    },
];

export const Default = () => ({
    components: { SearchResultsView },
    setup() {
        // Inject the store and mock its state
        const store = useShowsStore();
        store.showsByGenre = reactive({ Drama: mockShows, Comedy: mockShows, Sports: mockShows });
        store.pagesLoaded = reactive({ Drama: 1, Comedy: 1, Sports: 1 });
        store.loading = false;
        store.error = null;

        // You can pass a mock search query as a prop if needed
        const searchQuery = 'Mock';

        return { searchQuery };
    },
    template: `<SearchResultsView v-model:query="searchQuery" />`,
});
