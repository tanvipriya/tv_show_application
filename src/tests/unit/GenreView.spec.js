import { createRouter, createMemoryHistory } from "vue-router";
import { mount } from "@vue/test-utils";
import GenreView from "@/views/GenreView.vue";
import ShowDetail from "@/views/ShowDetailView.vue";
import ShowCard from "@/components/ShowCard.vue"; // ✅ Import ShowCard
import { createTestingPinia } from "@pinia/testing";
import { useShowsStore } from "@/store/showsStore";

const mockShows = [
    { id: 1, name: "Show One", rating: 8, image: null },
    { id: 2, name: "Show Two", rating: 9, image: "https://example.com/show2.jpg" },
];

describe("GenreView.vue - stable coverage", () => {
    let router;
    let pushSpy;
    let pinia;
    let store;

    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", name: "Home", component: { template: "<div />" } },
                { path: "/genre/:genre", name: "GenreView", component: GenreView }, // ✅ Add genre route
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
                mocks: {
                    hasMore: false, // mock the missing property
                },
            },
        });

        await wrapper.vm.$nextTick();

        const cards = wrapper.findAllComponents(ShowCard); // count real show cards
        expect(cards.length).toBe(mockShows.length);

        await cards[0].trigger("click");
        expect(pushSpy).toHaveBeenCalledWith({
            name: "ShowDetail",
            params: { id: 1 },
        });
    });
});
