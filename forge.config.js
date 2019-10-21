process.versions.electron = process.env.npm_package_devDependencies_electron
module.exports = {
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
  hooks: {
    prePackage: async () => {
      delete process.versions.electron
    },
  },
}
