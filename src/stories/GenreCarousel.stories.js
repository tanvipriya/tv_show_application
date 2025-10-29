import GenreCarousel from '../components/GenreCarousel.vue';

export default {
    title: 'Components/GenreCarousel',
    component: GenreCarousel,
    tags: ['autodocs'],
};

const mockShows = [
    {
        id: 1,
        name: 'Breaking Bad',
        rating: { average: 9.5 },
        premiered: '2008-01-20',
        image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg' },
    },
    {
        id: 2,
        name: 'Game of Thrones',
        rating: { average: 9.3 },
        premiered: '2011-04-17',
        image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/190/476117.jpg' },
    },
];

// ✅ Default: shows rendered successfully
export const Default = () => ({
    components: { GenreCarousel },
    setup() {
        const store = {
            showsByGenre: { Drama: mockShows },
            loading: false,
            error: null,
            fetchNextPage: () => console.log('Fetching next page...'),
        };
        return { store };
    },
    template: '<GenreCarousel :genre="\'Drama\'" />',
});

// ✅ Loading: skeletons visible
export const Loading = () => ({
    components: { GenreCarousel },
    setup() {
        const store = {
            showsByGenre: { Drama: [] },
            loading: true,
            error: null,
            fetchNextPage: () => console.log('Loading shows...'),
        };
        return { store };
    },
    template: '<GenreCarousel :genre="\'Drama\'" />',
});

// ✅ Error: when API or data fetch fails
export const ErrorState = () => ({
    components: { GenreCarousel },
    setup() {
        const store = {
            showsByGenre: { Drama: [] },
            loading: false,
            error: 'Failed to fetch shows. Please try again later.',
            fetchNextPage: () => console.log('Retrying fetch...'),
        };
        return { store };
    },
    template: '<GenreCarousel :genre="\'Drama\'" />',
});
