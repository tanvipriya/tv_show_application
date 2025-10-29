
import { mount } from '@vue/test-utils';
import ShowCard from '@/components/ShowCard.vue';

describe('ShowCard.vue', () => {
    const showFullData = {
        name: 'Breaking Bad',
        image: { medium: 'https://example.com/breaking-bad.jpg' },
        rating: { average: 9.5 },
        premiered: '2008-01-20',
    };

    const showMissingData = {
        name: 'Unknown Show',
        image: null,
        rating: {},
        premiered: null,
    };

    it('renders show name, rating, and premiered year correctly', () => {
        const wrapper = mount(ShowCard, {
            props: { show: showFullData },
        });

        expect(wrapper.find('h3').text()).toBe('Breaking Bad');
        expect(wrapper.find('p').text()).toContain('⭐ 9.5');
        expect(wrapper.findAll('p')[1].text()).toBe('2008');
    });

    it('renders placeholder text when rating or premiered is missing', () => {
        const wrapper = mount(ShowCard, {
            props: { show: showMissingData },
        });

        expect(wrapper.find('h3').text()).toBe('Unknown Show');
        expect(wrapper.find('p').text()).toContain('⭐ N/A');
        expect(wrapper.findAll('p')[1].text()).toBe('—');
    });

    it('renders the image when available', () => {
        const wrapper = mount(ShowCard, {
            props: { show: showFullData },
        });

        const img = wrapper.find('img');
        expect(img.exists()).toBe(true);
        expect(img.attributes('src')).toBe(showFullData.image.medium);
        expect(img.attributes('alt')).toBe(showFullData.name);
    });

    it('does not render an img element if image is missing', () => {
        const wrapper = mount(ShowCard, {
            props: { show: showMissingData },
        });

        expect(wrapper.find('img').exists()).toBe(false);
    });
});
