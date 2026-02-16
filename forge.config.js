const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./src/assets/img/UvSaludV3",
    name: 'Expedientes',

    //Incluir la carpeta api en el paquete final
    extraResource: [
      path.resolve(__dirname, 'api')
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Universidad Veracruzana - Luis Enrique Romero Pérez',
        description: 'Gestión de expedientes médicos',
        setupIcon: "./src/assets/img/UvSaludV3.ico",
        iconUrl: "https://raw.githubusercontent.com/Luigi196362/Expedientes/c5dcbfbffc81fb53336d31e4256b064441689374/src/assets/img/UvSaludV3.ico",
        setupShortcut: true,
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
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
