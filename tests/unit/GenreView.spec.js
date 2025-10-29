import { createRouter, createMemoryHistory } from "vue-router";
import { mount } from "@vue/test-utils";
import GenreView from "@/views/GenreView.vue";
import ShowDetail from "@/views/ShowDetailView.vue";
import ShowCard from "@/components/ShowCard.vue";
import { createTestingPinia } from "@pinia/testing";
import { useShowsStore } from "@/store/showsStore";

const mockShows = [
    { id: 1, name: "Show One", rating: 8, image: null },
    { id: 2, name: "Show Two", rating: 9, image: "https://example.com/show2.jpg" },
];

describe("GenreView.vue - stable coverage with snapshot", () => {
    let router;
    let pushSpy;
    let pinia;
    let store;

    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", name: "Home", component: { template: "<div />" } },
                { path: "/genre/:genre", name: "GenreView", component: GenreView },
                { name: "ShowDetail", path: "/show/:id", component: ShowDetail },
            ],
        });

        pushSpy = jest.spyOn(router, "push");
        pinia = createTestingPinia({ stubActions: false });
        store = useShowsStore();

        store.loading = false;
        store.error = null;
        store.showsByGenre = { Drama: mockShows };

        await router.push("/genre/Drama");
        await router.isReady();
    });

    it("renders show cards and navigates to ShowDetail on click", async () => {
        const wrapper = mount(GenreView, {
            global: {
                plugins: [pinia, router],
                components: { ShowCard },
                mocks: { hasMore: false },
            },
        });

        await wrapper.vm.$nextTick();

        // Check correct number of show cards
        const cards = wrapper.findAllComponents(ShowCard);
        expect(cards.length).toBe(mockShows.length);

        // Trigger navigation on first card click
        await cards[0].trigger("click");
        expect(pushSpy).toHaveBeenCalledWith({
            name: "ShowDetail",
            params: { id: 1 },
        });

        // --- Snapshot Test ---
        expect(wrapper.html()).toMatchSnapshot();
    });
});
