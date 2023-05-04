/* eslint-disable @typescript-eslint/no-unused-vars */
import { NativeModules } from 'react-native';
import Reactotron from 'reactotron-react-native';
import { ArgType } from 'reactotron-core-client';
import { reactotronRedux as reduxPlugin } from 'reactotron-redux';
import { goBack, resetRoot, navigate } from '../navigators/NavigationUtilities';
import { reduxStorage } from '../utils/storage';

/**
 * We tell typescript we intend to hang Reactotron off of the console object.
 *
 * It'll live at console.tron, so you can use it like so:
 *
 *   console.tron.log('hello world')
 *
 * You can also import Reactotron yourself from ./reactotronClient
 * and use it directly, like Reactotron.log('hello world')
 */
declare global {
  interface Console {
    /**
     * Reactotron client for logging, displaying, measuring performance,
     * and more. See https://github.com/infinitered/reactotron for more!
     */
    tron: typeof Reactotron;
  }
}

if (__DEV__) {
  const { scriptURL } = NativeModules.SourceCode;
  const scriptHostname = scriptURL.split('://')[1].split(':')[0];
  // https://github.com/infinitered/reactotron for more options!
  Reactotron.setAsyncStorageHandler?.(reduxStorage)
    .configure({ name: 'App', host: scriptHostname })
    .useReactNative()
    .use(reduxPlugin())
    .connect();

  Reactotron.onCustomCommand({
    title: 'Reset Navigation State',
    description: 'Resets the navigation state',
    command: 'resetNavigation',
    handler: () => {
      Reactotron.log?.('resetting navigation state');
      resetRoot({ index: 0, routes: [] });
    },
  });

  Reactotron.onCustomCommand({
    command: 'navigateTo',
    handler: args => {
      const { route } = args;
      if (route) {
        console.log(`Navigating to: ${route}`);
        navigate(route);
      } else {
        console.log('Could not navigate. No route provided.');
      }
    },
    title: 'Navigate To Screen',
    description: 'Navigates to a screen by name.',
    args: [
      {
        name: 'route',
        type: ArgType.String,
      },
    ],
  });

  Reactotron.onCustomCommand({
    title: 'Go Back',
    description: 'Goes back',
    command: 'goBack',
    handler: () => {
      Reactotron.log?.('Going back');
      goBack();
    },
  });

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear?.();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;
} else {
  // attach a mock so if things sneaky by our __DEV__ guards, we won't crash.
  const noop = () => undefined;
  const ouroboros = () => console.tron;
  console.tron = {
    overlay: (App: React.ReactNode) => App,
    storybookSwitcher: (App: React.ReactNode) => (Root: React.ReactNode) =>
      Root,
    startTimer: () => () => 0,
    send: noop,
    apiResponse: noop,
    debug: noop,
    stateActionComplete: noop,
    stateValuesResponse: noop,
    stateKeysResponse: noop,
    stateValuesChange: noop,
    stateBackupResponse: noop,
    repl: noop,
    warn: noop,
    configure: ouroboros,
    connect: ouroboros,
    use: ouroboros,
    useReactNative: ouroboros,
    close: noop,
    clear: noop,
    log: noop,
    logImportant: noop,
    display: noop,
    error: noop,
    image: noop,
    reportError: noop,
    benchmark: name => ({ step: noop, stop: noop, last: noop }),
    onCustomCommand: config => noop,
  };
}
