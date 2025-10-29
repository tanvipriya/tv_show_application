import { mount, flushPromises } from "@vue/test-utils";
import SearchResultsView from "@/views/SearchResultsView.vue";
import ShowCard from "@/components/ShowCard.vue";
import { createTestingPinia } from "@pinia/testing";
import { useShowsStore } from "@/store/showsStore";
import debounce from "lodash/debounce";

// Mock debounce to run instantly
jest.mock("lodash/debounce", () => jest.fn((fn) => fn));

// --- Fully safe vue-router mock ---
const mockedRouter = {
    push: jest.fn(),
};
jest.mock("vue-router", () => ({
    useRouter: () => mockedRouter,
}));

describe("SearchResultsView.vue", () => {
    let wrapper;
    let store;

    beforeEach(() => {
        mockedRouter.push.mockClear(); // reset before each test

        wrapper = mount(SearchResultsView, {
            global: {
                plugins: [createTestingPinia({ stubActions: false })],
                components: { ShowCard },
            },
        });

        store = useShowsStore();
        store.searchResults = [];
        store.showsByGenre = {};
        store.loading = false;
        store.error = null;
    });



    it("renders search input", () => {
        const input = wrapper.find("input.search-input");
        expect(input.exists()).toBe(true);
        expect(input.attributes("placeholder")).toBe("Search TV shows...");
    });

    it("shows loading skeletons when loading", async () => {
        store.loading = true;
        await wrapper.vm.$nextTick();
        const skeletons = wrapper.findAll(".show-card-skeleton");
        expect(skeletons.length).toBe(6);
    });

    it("displays error message when store.error is set", async () => {
        store.error = "Something went wrong";
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".error").text()).toBe("Something went wrong");
    });

    it("displays 'No results found' when query is present but no results", async () => {
        wrapper.vm.query = "NonExistingShow";
        await wrapper.vm.$nextTick();
        expect(wrapper.find("p").text()).toBe("No results found");
    });

    it("renders show cards based on searchResults", async () => {
        store.searchResults = [
            { id: 1, name: "Breaking Bad" },
            { id: 2, name: "Better Call Saul" },
        ];
        wrapper.vm.query = "b";
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        const cards = wrapper.findAllComponents(ShowCard);
        expect(cards.length).toBe(2);
    });

    it("calls fetchShowsByName when typing in input", async () => {
        const input = wrapper.find("input.search-input");
        await input.setValue("Friends"); // triggers v-model + onSearch
        await flushPromises();           // wait for any pending promises

        expect(store.fetchShowsByName).toHaveBeenCalledWith("Friends");
    });


    it("navigates to show detail on card click", async () => {
        // Prepare search results
        store.searchResults = [{ id: 1, name: "Breaking Bad" }];
        wrapper.vm.query = "Breaking Bad";
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        // Trigger card click
        const card = wrapper.find(".show-card");
        await card.trigger("click");

        // Assert router.push was called
        expect(mockedRouter.push).toHaveBeenCalledWith({
            name: "ShowDetail",
            params: { id: 1 },
        });
    });

    it("calls toggleFavorite when ShowCard emits toggle-favorite", async () => {
        store.searchResults = [{ id: 1, name: "Breaking Bad" }];
        wrapper.vm.query = "Breaking Bad";
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const showCard = wrapper.findComponent(ShowCard);
        await showCard.vm.$emit("toggle-favorite");
        expect(store.toggleFavorite).toHaveBeenCalledWith(1);
    });

    it("filters results from showsByGenre if searchResults is empty", async () => {
        store.showsByGenre = {
            Drama: [
                { id: 1, name: "Breaking Bad" },
                { id: 2, name: "Better Call Saul" },
            ],
        };
        wrapper.vm.query = "better";
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const results = wrapper.vm.results;
        expect(results.length).toBe(1);
        expect(results[0].name).toBe("Better Call Saul");
    });

    it("search is case-insensitive", async () => {
        store.searchResults = [{ id: 1, name: "Breaking Bad" }];
        wrapper.vm.query = "breaking";
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const results = wrapper.vm.results;
        expect(results.length).toBe(1);
        expect(results[0].name).toBe("Breaking Bad");
    });

    it("clears results when query is empty", async () => {
        store.searchResults = [{ id: 1, name: "Breaking Bad" }];
        wrapper.vm.query = "";
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.results.length).toBe(0);
    });
});
