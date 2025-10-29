// tests/unit/HomeView.spec.js
import { mount, flushPromises } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createMemoryHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import GenreCarousel from "@/components/GenreCarousel.vue";
import ShowCard from "@/components/ShowCard.vue";
import SearchResultsView from "@/views/SearchResultsView.vue";
import { useShowsStore } from "@/store/showsStore";

describe("HomeView.vue", () => {
    let router;

    beforeEach(async () => {
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { name: "Home", path: "/", component: { template: "<div>Home</div>" } },
                { name: "ShowDetail", path: "/show/:id", component: { template: "<div>Show Detail</div>" } },
            ],
        });

        await router.push("/"); // now this matches
        await router.isReady();
    });


    it("renders correctly and matches snapshot", () => {
        const wrapper = mount(HomeView, {
            global: {
                plugins: [router, createTestingPinia({ stubActions: false })],
                stubs: {
                    GenreCarousel: true,
                    ShowCard: true,
                    SearchResultsView: true,
                },
            },
        });

        // Static content
        expect(wrapper.find(".search-title").text()).toContain("TV Shows Dashboard");
        expect(wrapper.find(".search-subtitle").text()).toBe("Find your favorite shows quickly");

        // Snapshot
        expect(wrapper.html()).toMatchSnapshot();
    });

    it("renders genre carousels when searchQuery is empty", () => {
        const wrapper = mount(HomeView, {
            global: {
                plugins: [router, createTestingPinia()],
                stubs: {
                    GenreCarousel: true,
                    ShowCard: true,
                    SearchResultsView: true,
                },
            },
        });

        expect(wrapper.findAllComponents(GenreCarousel).length).toBe(5);
    });

    it("filters shows when searchQuery is set and shows results", async () => {
        const pinia = createTestingPinia({ stubActions: false });
        const store = useShowsStore();
        store.showsByGenre = {
            Drama: [{ id: 1, name: "Breaking Bad" }],
            Comedy: [{ id: 2, name: "Friends" }],
        };

        const wrapper = mount(HomeView, {
            global: {
                plugins: [router, pinia],
                stubs: {
                    GenreCarousel: true,
                    // ShowCard stub renders the show name for test assertions
                    ShowCard: {
                        props: ["show"],
                        template: `<div class="stub-show-card">{{ show.name }}</div>`,
                    },
                    // SearchResultsView stub with v-model emit
                    SearchResultsView: {
                        template:
                            '<input v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
                        props: ["modelValue"],
                    },
                },
            },
        });

        // Simulate user typing in SearchResultsView
        const searchInput = wrapper.findComponent(SearchResultsView);
        await searchInput.vm.$emit("update:modelValue", "Breaking");
        await flushPromises();

        // Filtered results should appear
        expect(wrapper.findAllComponents(ShowCard).length).toBe(1);
        expect(wrapper.text()).toContain("Breaking Bad");

        // Clicking show card triggers navigation
        const goToShowDetailSpy = jest.spyOn(wrapper.vm, "goToShowDetail");
        await wrapper.find(".stub-show-card").trigger("click");
        expect(goToShowDetailSpy).toHaveBeenCalledWith(1);
    });

    it("shows 'No results found' if searchQuery has no matches", async () => {
        const pinia = createTestingPinia({ stubActions: false });
        const store = useShowsStore();
        store.showsByGenre = {
            Drama: [{ id: 1, name: "Breaking Bad" }],
        };

        const wrapper = mount(HomeView, {
            global: {
                plugins: [router, pinia],
                stubs: {
                    GenreCarousel: true,
                    ShowCard: {
                        props: ["show"],
                        template: `<div class="stub-show-card">{{ show.name }}</div>`,
                    },
                    SearchResultsView: {
                        template:
                            '<input v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
                        props: ["modelValue"],
                    },
                },
            },
        });

        const searchInput = wrapper.findComponent(SearchResultsView);
        await searchInput.vm.$emit("update:modelValue", "Friends");
        await flushPromises();

        expect(wrapper.text()).toContain('No results found for "Friends"');
        // Genre carousels should be hidden
        expect(wrapper.findAllComponents(GenreCarousel).length).toBe(0);
    });
});
