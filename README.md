# MMM-Diablo4WorldBosses

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Display timers for any upcoming Diablo 4 world boss events.

Uses data from the diablo4.life API.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
  modules: [
    {
      module: 'MMM-Diablo4WorldBosses',
      config: {
        // See below for configurable options
        updateInterval: 360000,
        url: 'https://diablo4.life/api/trackers/list',
        shortNames: false,
        showLocation: true
        }
      }
    }
  ]
}
```

## Configuration options

| Option           | Type                | Default            | Necessity | Description                                                          |
|----------------- |-------------------- |------------------- |---------- |--------------------------------------------------------------------- |
| `updateInterval` | `int`(milliseconds) | 60000ms (1 minute) | Optional  | How often to update the events.                                      |
| `url`            | `string`            | 10                 | Optional  | The url to the diablo4.life event API. Leave default.                |
| `shortNames`     | `bool`              | false              | Optional  | Show just "Ashava" or all of "Ashava the Pestilent"                  |
| `showLocation`   | `bool`              | true               | Optional  | Show boss spawn location name (if provided).                         |