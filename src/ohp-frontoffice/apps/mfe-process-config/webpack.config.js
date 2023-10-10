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
    uniqueName: 'mfeProcessConfig',
    publicPath: 'auto'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases()
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeProcessConfig',
      filename: 'remoteEntry.js',
      exposes: {
        './Module': './apps/mfe-process-config/src/app/process-config/process-config.module.ts'
      },
      library: { type: 'module' },
      shared: share({
        '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/common/http': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@ngrx/router-store': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@ngrx/store': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@ngx-translate/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@close-front-office/shared/config': {
          singleton: true,
          import: 'libs/shared/config/src/index',
          strictVersion: true,
          requiredVersion: false
        },

        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ]
};
