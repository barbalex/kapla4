module.exports = {
  // see: https://github.com/electron-userland/electron-forge/issues/1224#issuecomment-544294836
  // this seems to be to ensure all deps of better-sqlite3 are copied
  packagerConfig: {
    ignore: file => {
      return false
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Kapla',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.js',
              name: 'main_window',
            },
          ],
        },
      },
    ],
  ],
}
