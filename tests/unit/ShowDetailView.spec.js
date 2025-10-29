import { mount, flushPromises } from "@vue/test-utils";
import ShowDetail from "@/views/ShowDetailView.vue";
import { createRouter, createMemoryHistory } from "vue-router";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("ShowDetail.vue", () => {
    let router;

    const mockShow = {
        id: 1,
        name: "Breaking Bad",
        image: { original: "poster.jpg" },
        rating: { average: 9.5 },
        genres: ["Drama", "Crime"],
        runtime: 60,
        premiered: "2008-01-20",
        network: { name: "AMC" },
        officialSite: "https://breakingbad.com",
        summary: "<p>Show summary</p>",
    };

    const mockEpisodes = [
        {
            id: 101,
            name: "Pilot",
            season: 1,
            number: 1,
            rating: { average: 9 },
            image: { medium: "ep1.jpg" },
            summary: "<p>Episode 1 summary</p>",
        },
        {
            id: 102,
            name: "Cat's in the Bag...",
            season: 1,
            number: 2,
            rating: { average: 8.5 },
            image: { medium: "ep2.jpg" },
            summary: "<p>Episode 2 summary</p>",
        },
    ];

    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [{ name: "ShowDetail", path: "/show/:id", component: ShowDetail }],
        });

        await router.push("/show/1");
        await router.isReady();
    });

    it("renders loading state", async () => {
        // Mock axios to never resolve, forcing loading state
        axios.get.mockImplementation(() => new Promise(() => { }));

        const wrapper = mount(ShowDetail, {
            global: { plugins: [router] },
        });

        // Wait for Vue to process the first onMounted
        await wrapper.vm.$nextTick();

        expect(wrapper.find(".skeleton-title").exists()).toBe(true);
        expect(wrapper.find(".skeleton-poster").exists()).toBe(true);
        expect(wrapper.findAll(".skeleton-text").length).toBe(3);
    });


    it("renders error state", async () => {
        axios.get.mockRejectedValue(new Error("Network Error"));
        const wrapper = mount(ShowDetail, { global: { plugins: [router] } });
        await flushPromises();

        expect(wrapper.find(".error").text()).toBe("Network Error");
    });

    it("renders show details and episodes correctly", async () => {
        axios.get
            .mockResolvedValueOnce({ data: mockShow })
            .mockResolvedValueOnce({ data: mockEpisodes });

        const wrapper = mount(ShowDetail, { global: { plugins: [router] } });
        await flushPromises();

        // Show main info
        expect(wrapper.find(".title").text()).toBe("Breaking Bad");
        expect(wrapper.find("img").attributes("src")).toBe("poster.jpg");
        expect(wrapper.find(".info").text()).toContain("⭐ 9.5");
        expect(wrapper.find(".info").text()).toContain("Drama, Crime");
        expect(wrapper.find(".info").text()).toContain("60 min");
        expect(wrapper.find(".info").text()).toContain("2008-01-20");
        expect(wrapper.find(".info").text()).toContain("AMC");
        expect(wrapper.find("a").attributes("href")).toBe("https://breakingbad.com");

        // Episodes
        expect(wrapper.findAll(".episode-card").length).toBe(2);
        expect(wrapper.find(".episode-card h3").text()).toBe("Pilot");

        // Snapshot
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("filters episodes by season", async () => {
        axios.get
            .mockResolvedValueOnce({ data: mockShow })
            .mockResolvedValueOnce({ data: mockEpisodes });

        const wrapper = mount(ShowDetail, { global: { plugins: [router] } });
        await flushPromises();

        wrapper.find("select").setValue("1");
        await flushPromises();

        expect(wrapper.findAll(".episode-card").length).toBe(2); // all season 1
    });

    it("filters episodes by min rating", async () => {
        axios.get
            .mockResolvedValueOnce({ data: mockShow })
            .mockResolvedValueOnce({ data: mockEpisodes });

        const wrapper = mount(ShowDetail, { global: { plugins: [router] } });
        await flushPromises();

        const input = wrapper.find('input[type="number"]');
        input.setValue(9);
        await flushPromises();

        expect(wrapper.findAll(".episode-card").length).toBe(1);
        expect(wrapper.find(".episode-card h3").text()).toBe("Pilot");
    });

    it("filters episodes by search term", async () => {
        axios.get
            .mockResolvedValueOnce({ data: mockShow })
            .mockResolvedValueOnce({ data: mockEpisodes });

        const wrapper = mount(ShowDetail, { global: { plugins: [router] } });
        await flushPromises();

        const input = wrapper.find('input[type="text"]');
        input.setValue("Cat");
        await flushPromises();

        expect(wrapper.findAll(".episode-card").length).toBe(1);
        expect(wrapper.find(".episode-card h3").text()).toBe("Cat's in the Bag...");
    });

    it("shows 'No episodes match' if filters exclude all", async () => {
        axios.get
            .mockResolvedValueOnce({ data: mockShow })
            .mockResolvedValueOnce({ data: mockEpisodes });

        const wrapper = mount(ShowDetail, { global: { plugins: [router] } });
        await flushPromises();

        wrapper.find('input[type="text"]').setValue("Nonexistent");
        await flushPromises();

        expect(wrapper.find(".no-results").text()).toBe("No episodes match your filters.");
    });

    it("navigates back on back button click", async () => {
        axios.get
            .mockResolvedValueOnce({ data: mockShow })
            .mockResolvedValueOnce({ data: mockEpisodes });

        const mockBack = jest.fn();
        router.back = mockBack;

        const wrapper = mount(ShowDetail, { global: { plugins: [router] } });
        await flushPromises();

        await wrapper.find(".back-btn").trigger("click");
        expect(mockBack).toHaveBeenCalled();
    });
});
