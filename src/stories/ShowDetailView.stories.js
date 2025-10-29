// src/stories/ShowDetailView.stories.js
import ShowDetailView from "@/views/ShowDetailView.vue";
import { ref, nextTick } from "vue";
import { createRouter, createMemoryHistory, RouterView } from "vue-router";

// Mock show data
const mockShow = {
    id: 1,
    name: "Sample Show",
    image: { original: "https://via.placeholder.com/300x450" },
    rating: { average: 8.5 },
    genres: ["Drama", "Thriller"],
    runtime: 45,
    premiered: "2023-01-01",
    network: { name: "Sample Network" },
    officialSite: "https://www.example.com",
    summary: "<p>This is a <strong>sample</strong> summary of the show.</p>",
};

// Mock episodes
const mockEpisodes = [
    {
        id: 101,
        name: "Pilot",
        season: 1,
        number: 1,
        rating: { average: 8.3 },
        summary: "<p>Episode summary goes here.</p>",
        image: { medium: "https://via.placeholder.com/120x80" },
    },
    {
        id: 102,
        name: "Second Episode",
        season: 1,
        number: 2,
        rating: { average: 8.7 },
        summary: "<p>Another episode summary.</p>",
        image: { medium: "https://via.placeholder.com/120x80" },
    },
];

export default {
    title: "Views/ShowDetailView",
    component: ShowDetailView,
};

// Create a minimal memory router
const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        {
            path: "/show/:id",
            name: "ShowDetail",
            component: ShowDetailView,
        },
    ],
});

// Template for all stories
const Template = (args) => ({
    components: { ShowDetailView, RouterView },
    setup() {
        const show = ref(null);
        const episodes = ref([]);
        const loading = ref(true);
        const error = ref(null);

        // Simulate API fetch
        nextTick(() => {
            setTimeout(() => {
                if (args.error) {
                    error.value = args.error;
                } else {
                    show.value = mockShow;
                    episodes.value = mockEpisodes;
                }
                loading.value = false;
            }, 500);
        });

        return { show, episodes, loading, error };
    },
    router,
    template: `
    <router-view>
      <ShowDetailView 
        :show="show" 
        :episodes="episodes" 
        :loading="loading" 
        :error="error" />
    </router-view>
  `,
});

// Default story
export const Default = Template.bind({});
Default.args = { error: null };

// Loading state
export const Loading = Template.bind({});
Loading.args = { error: null };

// Error state
export const ErrorState = Template.bind({});
ErrorState.args = { error: "Failed to fetch show details" };
