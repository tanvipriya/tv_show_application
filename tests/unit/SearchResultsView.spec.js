import { mount } from "@vue/test-utils";
import SearchView from "@/views/SearchResultsView.vue"; // adjust path if needed

describe("SearchView.vue", () => {
    it("renders input with placeholder", () => {
        const wrapper = mount(SearchView);
        const input = wrapper.find("input");
        expect(input.exists()).toBe(true);
        expect(input.attributes("placeholder")).toBe("Search TV shows...");
    });

    it("emits update:modelValue when input value changes", async () => {
        const wrapper = mount(SearchView, {
            props: { modelValue: "" },
        });

        const input = wrapper.find("input");
        await input.setValue("Friends");

        // Assert emitted event
        const emitted = wrapper.emitted("update:modelValue");
        expect(emitted).toBeTruthy();
        expect(emitted[0]).toEqual(["Friends"]);
    });

    it("updates input value when modelValue prop changes", async () => {
        const wrapper = mount(SearchView, {
            props: { modelValue: "Breaking Bad" },
        });

        const input = wrapper.find("input");
        expect(input.element.value).toBe("Breaking Bad");

        // Update prop
        await wrapper.setProps({ modelValue: "Suits" });
        expect(input.element.value).toBe("Suits");
    });

    // ✅ Snapshot Test
    it("matches snapshot", () => {
        const wrapper = mount(SearchView, {
            props: { modelValue: "Stranger Things" },
        });
        expect(wrapper.html()).toMatchSnapshot();
    });
});
