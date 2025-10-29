import { mount, flushPromises } from "@vue/test-utils";
import ShowDetailView from "@/views/ShowDetailView.vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

jest.mock("axios");
jest.mock("vue-router", () => ({
    useRoute: jest.fn(),
    useRouter: jest.fn(),
}));

// Sample show and episodes
const mockShow = {
    id: 1,
    name: "Mock Show",
    rating: { average: 8.5 },
    genres: ["Drama", "Comedy"],
    runtime: 45,
    premiered: "2023-01-01",
    network: { name: "Mock Network" },
    officialSite: "https://mockshow.com",
    summary: "<p>Mock summary</p>",
    image: { original: "https://mockimage.com/show.jpg" },
};

const mockEpisodes = [
    {
        id: 101,
        name: "Episode 1",
        season: 1,
        number: 1,
        rating: { average: 9 },
        summary: "<p>Episode 1 summary</p>",
        image: { medium: "https://mockimage.com/ep1.jpg" },
    },
    {
        id: 102,
        name: "Episode 2",
        season: 1,
        number: 2,
        rating: { average: 7.5 },
        summary: "<p>Episode 2 summary</p>",
        image: { medium: "https://mockimage.com/ep2.jpg" },
    },
    {
        id: 201,
        name: "Episode 3",
        season: 2,
        number: 1,
        rating: { average: 8 },
        summary: "<p>Episode 3 summary</p>",
        image: { medium: "https://mockimage.com/ep3.jpg" },
    },
];

describe("ShowDetailView.vue", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useRoute.mockReturnValue({ params: { id: 1 } });
        useRouter.mockReturnValue({ back: jest.fn() });
    });

    it("displays loading skeleton while fetching", async () => {
        // Mock axios promises that resolve later
        let resolveShow, resolveEpisodes;
        axios.get
            .mockReturnValueOnce(new Promise((resolve) => (resolveShow = resolve)))
            .mockReturnValueOnce(new Promise((resolve) => (resolveEpisodes = resolve)));

        const wrapper = mount(ShowDetailView);

        // Loading should appear AFTER fetchShowDetails sets loading = true
        // Wait a tick for onMounted to run
        await wrapper.vm.$nextTick();

        expect(wrapper.find(".loading").exists()).toBe(true);

        // Resolve the API calls
        resolveShow({ data: mockShow });
        resolveEpisodes({ data: mockEpisodes });

        await flushPromises();
        await wrapper.vm.$nextTick();
    });

    it("renders show details and episodes", async () => {
        axios.get
            .mockResolvedValueOnce({ data: mockShow })
            .mockResolvedValueOnce({ data: mockEpisodes });

        const wrapper = mount(ShowDetailView);

        // Wait for async fetch + DOM update
        await flushPromises();
        await wrapper.vm.$nextTick();

        // Now .title and .info exist
        expect(wrapper.find(".title").exists()).toBe(true);
        expect(wrapper.find(".title").text()).toBe("Mock Show");

        expect(wrapper.find(".info").exists()).toBe(true);
        expect(wrapper.find(".info").text()).toContain("⭐ 8.5");
        expect(wrapper.find(".info").text()).toContain("Drama, Comedy");

        // Episodes
        const episodes = wrapper.findAll(".episode-card");
        expect(episodes.length).toBe(mockEpisodes.length);
    });

    it("displays error message if fetch fails", async () => {
        axios.get.mockRejectedValue(new Error("Network Error"));

        const wrapper = mount(ShowDetailView);

        await flushPromises();
        await wrapper.vm.$nextTick();

        const errorEl = wrapper.find(".error");
        expect(errorEl.exists()).toBe(true);
        expect(errorEl.text()).toBe("Network Error");
    });
});
