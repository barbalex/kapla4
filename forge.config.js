module.exports = {
  packagerConfig: {
    icon: './src/etc/app.png',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Kapla',
        iconUrl: './src/etc/app.ico',
        copyright: 'AWEL Kt. Zürich, Schweiz, Abteilung Recht',
        owners: 'AWEL Kt. Zürich, Schweiz',
        description:
          'Damit verwaltet das AWEL Kt. ZH seine juristischen Geschäfte',
        authors: 'Alexander Gabriel, Gabriel-Software',
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
          nodeIntegration: true, // defaults to false
        },
        devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:`,
      },
    ],
  ],
}
