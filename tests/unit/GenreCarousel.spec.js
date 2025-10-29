import { createPinia, setActivePinia } from 'pinia';
import { useShowsStore } from '@/store/showsStore';
import { mount } from '@vue/test-utils';
import GenreCarousel from '@/components/GenreCarousel.vue';
import ShowCard from '@/components/ShowCard.vue';

describe('GenreCarousel Component', () => {
    let pinia;
    let store;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        store = useShowsStore();

        // Default store state
        store.showsByGenre = {
            Drama: [
                { id: 1, name: 'Breaking Bad', rating: { average: 9.5 }, image: { medium: '' } },
                { id: 2, name: 'Game of Thrones', rating: { average: 9.3 }, image: { medium: '' } },
            ],
        };
        store.loading = false;
        store.error = null;
        store.fetchNextPage = jest.fn();
    });

    // Helper to mount component with proper RouterLink stub
    const mountCarousel = (props) => {
        return mount(GenreCarousel, {
            global: {
                plugins: [pinia],
                stubs: {
                    RouterLink: {
                        template: '<div><slot /></div>', // render children to allow ShowCard to mount
                    },
                },
            },
            props,
        });
    };

    it('renders shows correctly and matches snapshot', () => {
        const wrapper = mountCarousel({ genre: 'Drama' });

        const showLinks = wrapper.findAll('.show-link');
        expect(showLinks.length).toBe(2);

        expect(wrapper.html()).toMatchSnapshot('GenreCarousel - normal shows');
    });

    it('renders loading state correctly', () => {
        store.loading = true;

        const wrapper = mountCarousel({ genre: 'Drama' });

        const skeleton = wrapper.find('.skeleton-wrapper');
        expect(skeleton.exists()).toBe(true);
        expect(skeleton.findAll('.show-skeleton').length).toBe(5);

        expect(wrapper.html()).toMatchSnapshot('GenreCarousel - loading state');
    });

    it('renders empty state correctly when no shows are available', () => {
        store.showsByGenre = { Drama: [] };
        store.loading = false;
        store.error = null;

        const wrapper = mountCarousel({ genre: 'Drama' });

        const emptyEl = wrapper.find('.empty');
        expect(emptyEl.exists()).toBe(true);
        expect(emptyEl.text()).toBe('No shows available');

        expect(wrapper.html()).toMatchSnapshot('GenreCarousel - empty state');
    });

    it('renders error state correctly', () => {
        store.error = 'Failed to fetch shows';

        const wrapper = mountCarousel({ genre: 'Drama' });

        const errorEl = wrapper.find('.error');
        expect(errorEl.exists()).toBe(true);
        expect(errorEl.text()).toBe('Failed to fetch shows');

        expect(wrapper.html()).toMatchSnapshot('GenreCarousel - error state');
    });

    it('handles click safely on first show', async () => {
        const wrapper = mountCarousel({ genre: 'Drama' });

        const showLinks = wrapper.findAll('.show-link');
        expect(showLinks.length).toBe(2);

        await showLinks[0].trigger('click');
    });

    it('calls fetchNextPage when mounted if genre not loaded', () => {
        store.showsByGenre = {}; // simulate genre not loaded

        mountCarousel({ genre: 'Drama' });

        expect(store.fetchNextPage).toHaveBeenCalledWith('Drama');
    });

    it('does not call fetchNextPage if genre already loaded', () => {
        mountCarousel({ genre: 'Drama' });

        expect(store.fetchNextPage).not.toHaveBeenCalled();
    });

    it('sorts shows by rating descending', () => {
        store.showsByGenre = {
            Drama: [
                { id: 1, name: 'Low Rated Show', rating: { average: 2 } },
                { id: 2, name: 'High Rated Show', rating: { average: 9 } },
            ],
        };
        store.loading = false;

        const wrapper = mountCarousel({ genre: 'Drama' });

        const showTexts = wrapper.findAllComponents(ShowCard).map(s => s.props('show').name);
        expect(showTexts).toEqual(['High Rated Show', 'Low Rated Show']);
        expect(wrapper.html()).toMatchSnapshot('GenreCarousel - sorted shows');
    });

    it('handles shows without rating gracefully', () => {
        store.showsByGenre = {
            Drama: [
                { id: 1, name: 'No Rating Show' }, // missing rating
                { id: 2, name: 'Rated Show', rating: { average: 5 } },
            ],
        };
        store.loading = false;

        const wrapper = mountCarousel({ genre: 'Drama' });

        const showTexts = wrapper.findAllComponents(ShowCard).map(s => s.props('show').name);
        expect(showTexts).toEqual(['Rated Show', 'No Rating Show']);
        expect(wrapper.html()).toMatchSnapshot('GenreCarousel - missing rating shows');
    });
});
