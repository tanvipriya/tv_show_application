import ShowDetail from '../views/ShowDetailView.vue';
import { ref } from 'vue';

// Mock data
const mockShow = {
    id: 1,
    name: 'Breaking Bad',
    rating: { average: 9.5 },
    genres: ['Crime', 'Drama', 'Thriller'],
    runtime: 47,
    premiered: '2008-01-20',
    network: { name: 'AMC' },
    officialSite: '[https://www.amc.com/shows/breaking-bad](https://www.amc.com/shows/breaking-bad)',
    image: {
        original:
            '[https://static.tvmaze.com/uploads/images/original_untouched/81/202627.jpg](https://static.tvmaze.com/uploads/images/original_untouched/81/202627.jpg)',
    },
    summary:
        '<p>A high school chemistry teacher turned methamphetamine producer partners with a former student.</p>',
};

const mockEpisodes = [
    { id: 101, season: 1, number: 1, name: 'Pilot', airdate: '2008-01-20' },
    { id: 102, season: 1, number: 2, name: 'Cat’s in the Bag...', airdate: '2008-01-27' },
    { id: 103, season: 1, number: 3, name: '...And the Bag’s in the River', airdate: '2008-02-10' },
];

// Default export
export default {
    title: 'Pages/ShowDetail',
    component: ShowDetail,
    parameters: { layout: 'fullscreen' },
};

// Template

const Template = (args) => ({
    components: { ShowDetail },
    setup() {
        // Create reactive refs from args
        const show = ref(args.show);
        const episodes = ref(args.episodes);
        const loading = ref(args.loading);
        const error = ref(args.error);
        const placeholder = ref('https://via.placeholder.com/300x450?text=No+Image');

        // Mock goBack function
        const goBack = () => alert('Back clicked!');

        return { show, episodes, loading, error, placeholder, goBack };
    },
    template: `
      <ShowDetail 
        :show="show"
        :episodes="episodes"
        :loading="loading"
        :error="error"
        :placeholder="placeholder"
        :goBack="goBack"
      />
    `,
});


// Story variants
export const Default = Template.bind({});
Default.args = { show: mockShow, episodes: mockEpisodes, loading: false, error: null };

export const Loading = Template.bind({});
Loading.args = { show: null, episodes: [], loading: true, error: null };

export const ErrorState = Template.bind({});
ErrorState.args = { show: null, episodes: [], loading: false, error: 'Failed to load show details' };

export const NoEpisodes = Template.bind({});
NoEpisodes.args = { show: mockShow, episodes: [], loading: false, error: null };
