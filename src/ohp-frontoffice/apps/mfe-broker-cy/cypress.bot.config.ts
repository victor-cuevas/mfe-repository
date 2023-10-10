import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: false,
  trashAssetsBeforeRuns: false,
  videosFolder: '../../dist/cypress/apps/mfe-broker-portal-cy/videos',
  screenshotsFolder: '../../dist/cypress/apps/mfe-broker-portal-cy/screenshots',
  chromeWebSecurity: false,
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4200',
    specPattern: './src/bot/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/bot.support.ts',
    experimentalSessionAndOrigin: true,
    responseTimeout: 20000,
    requestTimeout: 20000,
    video: false,
    setupNodeEvents: (on, config) => {
      // eslint-disable-next-line
      const webpackPreprocessor = require('@cypress/webpack-batteries-included-preprocessor');
      const webpackOptions = webpackPreprocessor.defaultOptions.webpackOptions;

      webpackOptions.module.rules.unshift({
        test: /[/\\]@angular[/\\].+\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@angular/compiler-cli/linker/babel'],
            compact: false,
            cacheDirectory: true,
          },
        },
      });

      on(
        'file:preprocessor',
        webpackPreprocessor({
          webpackOptions: webpackOptions,
          typescript: require.resolve('typescript'),
        }),
      );

      on('task', {
        log(msg: string) {
          console.log(msg);
          return null;
        },
      });

      return config;
    },
  },
});
