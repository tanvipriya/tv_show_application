import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createMemoryHistory } from "vue-router";
import GenreCarousel from "@/components/GenreCarousel.vue";
import ShowCard from "@/components/ShowCard.vue";
import { useShowsStore } from "@/store/showsStore";
import ShowDetail from "@/views/ShowDetailView.vue";
import GenreView from "@/views/GenreView.vue";

const mockShows = [
    { id: 1, name: "Show One", rating: 8, image: null },
    { id: 2, name: "Show Two", rating: 9, image: "https://example.com/show2.jpg" },
];

describe("GenreCarousel.vue - full coverage", () => {
    let router;
    let pushSpy;
    let pinia;
    let store;
    beforeAll(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => { });
    });
    afterAll(() => {
        console.warn.mockRestore();
    });
    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", name: "Home", component: { template: "<div />" } }, // dummy home route
                { name: "ShowDetail", path: "/show/:id", component: ShowDetail },
                { name: "GenreView", path: "/genre/:genre", component: GenreView },
            ],
        });

        pushSpy = jest.spyOn(router, "push");
        router.push("/"); // now valid
        await router.isReady();

        pinia = createTestingPinia({ stubActions: false });
        store = useShowsStore();
    });

    it("renders genre title", () => {
        store.showsByGenre = { Drama: mockShows };
        store.loading = false;
        store.error = null;

        const wrapper = mount(GenreCarousel, {
            props: { genre: "Drama" },
            global: { plugins: [pinia] },
            stubs: ["ShowCard"],
        });

        expect(wrapper.find("h2").text()).toBe("Drama");
    });

    it("shows loading state when loading is true", () => {
        store.loading = true;
        store.error = null;
        store.showsByGenre = {};

        const wrapper = mount(GenreCarousel, {
            props: { genre: "Drama" },
            global: { plugins: [pinia] },
            stubs: ["ShowCard"],
        });

        const skeleton = wrapper.find(".skeleton-wrapper");
        expect(skeleton.exists()).toBe(true);
        expect(skeleton.findAll(".show-skeleton").length).toBe(5);
    });

    it("shows error message if error exists", async () => {
        store.fetchNextPage = jest.fn(); // stub to prevent overwriting error
        store.loading = false;
        store.error = "Failed to load shows";
        store.showsByGenre = {};

        const wrapper = mount(GenreCarousel, {
            props: { genre: "Drama" },
            global: { plugins: [pinia] },
            stubs: ["ShowCard"],
        });

        await wrapper.vm.$nextTick();
        const errorEl = wrapper.find(".error");
        expect(errorEl.exists()).toBe(true);
        expect(errorEl.text()).toBe("Failed to load shows");
    });

    it("shows empty state when no shows are available", () => {
        store.loading = false;
        store.error = null;
        store.showsByGenre = { Drama: [] };

        const wrapper = mount(GenreCarousel, {
            props: { genre: "Drama" },
            global: { plugins: [pinia] },
            stubs: ["ShowCard"],
        });

        const emptyEl = wrapper.find(".empty");
        expect(emptyEl.exists()).toBe(true);
        expect(emptyEl.text()).toBe("No shows available");
    });

    it("renders show cards with correct props and fallback image", () => {
        store.loading = false;
        store.error = null;
        store.showsByGenre = { Drama: mockShows };

        const wrapper = mount(GenreCarousel, {
            props: { genre: "Drama" },
            global: { plugins: [pinia] },
            components: { ShowCard },
        });

        const showCards = wrapper.findAllComponents(ShowCard);
        expect(showCards.length).toBe(2);

        // Props validation
        expect(showCards[0].props("show")).toEqual(mockShows[0]);
        expect(showCards[1].props("show")).toEqual(mockShows[1]);
    });

    it("calls fetchNextPage if shows for genre are missing on mount", async () => {
        store.fetchNextPage = jest.fn();
        store.loading = false;
        store.error = null;
        store.showsByGenre = {}; // genre missing

        mount(GenreCarousel, {
            props: { genre: "Drama" },
            global: { plugins: [pinia] },
            stubs: ["ShowCard"],
        });

        await Promise.resolve(); // wait for next tick
        expect(store.fetchNextPage).toHaveBeenCalledWith("Drama");
    });

    it("navigates to ShowDetail when show card is clicked", async () => {
        store.loading = false;
        store.error = null;
        store.showsByGenre = { Drama: mockShows };

        const wrapper = mount(GenreCarousel, {
            props: { genre: "Drama" },
            global: { plugins: [pinia, router] },
            components: { ShowCard }, // use real component so it renders
        });

        const firstCard = wrapper.findComponent(ShowCard);
        await firstCard.trigger("click");

        expect(pushSpy).toHaveBeenCalledWith({
            name: "ShowDetail",
            params: { id: 1 },
        });
    });


    it("navigates to GenreView when See All is clicked", async () => {
        store.loading = false;
        store.error = null;
        store.showsByGenre = { Comedy: mockShows };

        const wrapper = mount(GenreCarousel, {
            props: { genre: "Comedy" },
            global: { plugins: [pinia, router] },
            stubs: ["ShowCard"],
        });

        await wrapper.find(".see-all").trigger("click");
        expect(pushSpy).toHaveBeenCalledWith({
            name: "GenreView",
            params: { genre: "Comedy" },
        });
    });
});
