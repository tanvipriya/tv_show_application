import GenreCarousel from '../components/GenreCarousel.vue';
import ShowCard from '../components/ShowCard.vue';
import { reactive, h } from 'vue';

// Mock store for Storybook
const mockShowsStore = () =>
    reactive({
        showsByGenre: {
            Drama: [
                {
                    id: 1,
                    name: 'Breaking Bad',
                    rating: { average: 9.5 },
                    premiered: '2008-01-20',
                    image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg' },
                },
                {
                    id: 2,
                    name: 'Game of Thrones',
                    rating: { average: 9.3 },
                    premiered: '2011-04-17',
                    image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/190/476117.jpg' },
                },
            ],
        },
        loading: false,
        error: null,
        fetchNextPage: async () => { },
    });

export default {
    title: 'Components/GenreCarousel',
    component: GenreCarousel,
};

// Wrapper to replace router-links with divs for Storybook
const Template = (args) => ({
    components: { GenreCarousel, ShowCard },
    setup() {
        const store = mockShowsStore();
        return { args, store };
    },
    render() {
        // Render GenreCarousel with custom v-slots to replace router-links
        return h(GenreCarousel, { ...this.args }, {
            default: (slots) =>
                slots.default?.().map((vnode) => {
                    if (vnode.type?.name === 'RouterLink') {
                        return h(
                            'div',
                            {
                                style: 'cursor:pointer; display:inline-block;',
                                onClick: () => console.log('Clicked show:', vnode.props.to),
                            },
                            vnode.children
                        );
                    }
                    return vnode;
                }),
            header: (slots) =>
                slots?.header?.().map((vnode) => {
                    if (vnode.type?.name === 'RouterLink') {
                        return h(
                            'div',
                            {
                                style: 'cursor:pointer; color:#1e90ff; display:inline-block;',
                                onClick: () => console.log('Clicked See All:', vnode.props.to),
                            },
                            vnode.children
                        );
                    }
                    return vnode;
                }),
        });
    },
});

export const Drama = Template.bind({});
Drama.args = {
    genre: 'Drama',
};
