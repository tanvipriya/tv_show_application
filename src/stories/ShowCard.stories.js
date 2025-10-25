import ShowCard from '../components/ShowCard.vue';

export default {
    title: 'Components/ShowCard',
    component: ShowCard,
};

const Template = (args) => ({
    components: { ShowCard },
    setup() {
        return { args };
    },
    template: '<ShowCard v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
    show: {
        name: 'Breaking Bad',
        rating: { average: 9.5 },
        premiered: '2008-01-20',
        image: { medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg' },
    },
};
