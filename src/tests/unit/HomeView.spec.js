import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createMemoryHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import GenreCarousel from "@/components/GenreCarousel.vue";

describe("HomeView.vue", () => {
    let router;

    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", name: "Home", component: { template: "<div />" } },
                { path: "/show/:id", name: "ShowDetail", component: { template: "<div />" } },
                { path: "/genre/:genre", name: "GenreView", component: { template: "<div />" } },
            ],
        });

        // Push a valid route first
        router.push("/");
        await router.isReady(); // now it resolves correctly
    });

    it("renders multiple GenreCarousel components", () => {
        const pinia = createTestingPinia({ stubActions: true });

        const wrapper = mount(HomeView, {
            global: {
                plugins: [pinia, router],
                components: { GenreCarousel },
            },
        });

        const carousels = wrapper.findAllComponents(GenreCarousel);
        expect(carousels.length).toBe(5);
    });
});
