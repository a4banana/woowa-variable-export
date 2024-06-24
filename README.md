# Woowabros Figma Variable Exporter

This plugin exports the variables from the Figma file to the JSON & ZIP file.
powered by [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)

### Pre-requisites
- [Node.js](https://nodejs.org) – v20

### Build the plugin

To build the plugin:

```
$ npm run build
$ bun run build
```

This will generate a [`manifest.json`](https://figma.com/plugin-docs/manifest/) file and a `build/` directory containing the JavaScript bundle(s) for the plugin.

To watch for code changes and rebuild the plugin automatically:

### Install the plugin

1. In the Figma desktop app, open a Figma document.
2. Search for and run `Import plugin from manifest…` via the Quick Actions search bar.
3. Select the `manifest.json` file that was generated by the `build` script.