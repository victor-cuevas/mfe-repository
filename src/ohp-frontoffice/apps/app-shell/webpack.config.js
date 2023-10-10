const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.base.json'), [
  /* mapped paths to share */
]);

module.exports = {
  output: {
    uniqueName: 'app-shell',
    publicPath: 'auto',
  },
  optimization: {
    // Only needed to bypass a temporary bug
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: 'module' },
      shared: share({
        '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/common/http': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@ngrx/router-store': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@ngrx/store': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@ngx-translate/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/animations': { singleton: true, strictVersion: true, eager: true, requiredVersion: 'auto' },
        '@close-front-office/shared/config': {
          singleton: true,
          import: 'libs/shared/config/src/index',
          strictVersion: true,
          requiredVersion: false,
        },
        '@close-front-office/shared/landing': {
          singleton: true,
          import: 'libs/shared/landing/src/index',
          strictVersion: true,
          requiredVersion: false,
        },

        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],
};
