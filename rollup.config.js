import merge from 'deepmerge';
// use createSpaConfig for bundling a Single Page App
import { createSpaConfig } from '@open-wc/building-rollup';
import { injectManifest } from 'rollup-plugin-workbox';
import copy from 'rollup-plugin-copy';

const outputDir = 'build';

// use createBasicConfig to do regular JS to JS bundling
// import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  // use the outputdir option to modify where files are output
  outputDir: outputDir,

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  // legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
  workbox: false
});

export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: './index.html',
  plugins: [
    copy({
      targets: [
        { src: 'utils/*', dest: outputDir+'/utils' },
        { src: 'images/*', dest: outputDir+'/images' },
        { src: 'src/config.json', dest: outputDir+'/src' },
        { src: 'node_modules/@lrnwebcomponents/*', dest: outputDir+'/node_modules/@lrnwebcomponents'}
      ],
      // set flatten to false to preserve folder structure
      flatten: true,
    }),
    injectManifest({
      swSrc: 'pwabuilder-sw.js',
      swDest: outputDir +'/pwabuilder-sw.js',
      globPatterns: ['index.html','*.js','config.json','images/**/*.{ico,png,jpg,gif}'],
      globDirectory: outputDir +'/',
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
    })
  ],

  // alternatively, you can use your JS as entrypoint for rollup and
  // optionally set a HTML template manually
  // input: './app.js',
});
