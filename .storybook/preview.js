import { setup } from '@storybook/vue3';
import { createPinia } from 'pinia';

// Setup Pinia globally for all stories
setup((app) => {
    const pinia = createPinia();
    app.use(pinia);
});

// Optional: global parameters for actions and controls
export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
};
