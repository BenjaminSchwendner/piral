[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Piral Update](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-update.svg?style=flat)](https://www.npmjs.com/package/piral-update) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This is a plugin that only has a peer dependency to `piral-core`. What `piral-update` brings to the table is the possibility of automatically updating pilets (or prevent such an automated update).

By default, these API extensions are not integrated in `piral`, so you'd need to add them to your Piral instance.

## Documentation

The following functions are brought to the Pilet API.

### `canUpdate`

Changes the current updatability. Takes specific constants, either `allow`, or `block`.

## Usage

::: summary: For pilet authors

You can use the `canUpdate` function from the Pilet API to define if the current pilet can be updated or not.

Example use:

```ts
import { PiletApi } from '<name-of-piral-instance>';

export function setup(piral: PiletApi) {
  piral.registerPage('/test', () => {
    const [name, setName] = useState('');
    useEffect(() => {
      if (name) {
        piral.canUpdate('block');
        return () => piral.canUpdate('allow');
      } else {
        return () => {};
      }
    }, [name]);

    return <input value={name} onChange={e => setName(e.target.value)} />;
  });
}
```

Right now the possible values are:

- `block`, updates for this pilet should be blocked
- `allow`, updates for this pilet are possible (components may be replaced dynamically)
- `ask`, user needs to confirm to allow an update - otherwise it will be blocked

:::

::: summary: For Piral instance developers

The provided library only brings API extensions for pilets to a Piral instance.

For the setup of the library itself you'll need to import `createUpdateApi` from the `piral-update` package.

```ts
import { createUpdateApi } from 'piral-update';
```

The integration looks like:

```ts
const instance = createInstance({
  // important part
  plugins: [createUpdateApi({
    listen(notify) {
      // check every 30 seconds
      setInterval(() => {
        // notify will automatically compare the given pilets with the available ones
        fetch(myFeed).then(res => res.json()).then(pilets => notify(pilets));
      }, 30 * 1000);
    }
  })],
  // ...
});
```

The most important strategies are already available in helpers.

If you want to check **periodically** you can use the `checkPeriodically` helper factory:

```ts
import { createUpdateApi, checkPeriodically } from 'piral-update';

const instance = createInstance({
  // important part
  plugins: [createUpdateApi({
    listen: checkPeriodically({
      period: 30 * 1000,
    }),
  })],
  // ...
});
```

If you can use a **WebSocket** connection we recommend using the `checkWebSocket` helper factory:

```ts
import { createUpdateApi, checkWebSocket } from 'piral-update';

const instance = createInstance({
  // important part
  plugins: [createUpdateApi({
    listen: checkWebSocket({
      url: 'ws://<insert-ws-host-here>/api/pilets',
      available: (data) => JSON.parse(data).type === 'update_available',
    }),
  })],
  // ...
});
```

If you can use **Server-Sent Events** to detect updates using the `checkServerSentEvents` helper factory:

```ts
import { createUpdateApi, checkServerSentEvents } from 'piral-update';

const instance = createInstance({
  // important part
  plugins: [createUpdateApi({
    listen: checkServerSentEvents({
      url: 'http://<insert-sse-host-here>/api/pilets',
      name: 'update_available',
    }),
  })],
  // ...
});
```

If you can use a **Piral event** to check for updates then we recommend the `checkPiralEvent` helper factory:

```ts
import { createUpdateApi, checkPiralEvent } from 'piral-update';

const instance = createInstance({
  // important part
  plugins: [createUpdateApi({
    listen: checkPiralEvent({
      name: 'check-update',
    }),
  })],
  // ...
});
```

:::

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).