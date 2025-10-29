import path from 'path';

export default {
  stories: ['../src/**/*.stories.@(js|ts|vue|mdx)'],
  addons: ['@storybook/addon-links', "@storybook/addon-docs"],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(process.cwd(), 'src'),
    };
    return config;
  },
};
