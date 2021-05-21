# React Unleash Flags
React component for Unleash or GitLab Feature Flags. This library provides a custom hook and react components to use in JavaScript or TypeScript projects.

## Installation
Using NPM:
```
npm i --save react-unleash-flags
```
## Configuration
The following config is required in order to fetch te flags from your Unleash or GitLab instance:
- appName (the name of the app you will be running. Eg.: 'production', 'staging')
- host (the location of the Unleash api. Eg.: ht&#8203;tps://my-unleash-url.com/api/)
- url (Deprecated! Use `host` instead)
- uri (the uri of the Unleash api. Eg.: `/client/features`) (this could be different if you want to point to an Unleash Proxy instead)
- instanceId (the unique Unleash instance ID)
- extraHttpHeaders (OPTIONAL extra http headers passed to the fetch call. For example, an Authorization header)
- userId (OPTIONAL the current users userId as a string. Required for user id based strategies)

This configuration can be provided as an env variabe. The environment variables are:
- `REACT_APP_FLAGS_CTX_APP_NAME`
- `REACT_APP_FLAGS_CTX_HOST`
- `REACT_APP_FLAGS_CTX_URL` (Deprecated! Use `REACT_APP_FLAGS_CTX_HOST` instead)
- `REACT_APP_FLAGS_CTX_URI`
- `REACT_APP_FLAGS_CTX_INSTANCE_ID`

The configuration can also be provide as a dict. (see examples below)
### `<FlagsProvider>` with config in env vars
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { FlagsProvider } from 'react-unleash-flags';
import App from './App';

const root = document.getElementById('root');

if (root != null) {
    ReactDOM.render((
        <FlagsProvider>
            <App />
        </FlagsProvider>
    ), cakeRoot);
}
```
### `<FlagsProvider>` with config in code
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { FlagsProvider } from 'react-unleash-flags';
import App from './App';

const root = document.getElementById('root');

// we can also define the config in code instead of using env vars
const flagConfig = {
    appName: 'production',
    host: 'https://...',
    uri: '/client/features',
    instanceId: '...',
    extraHttpHeaders: {
        Authorization: 'token123'
    },
    userId: userId,
};

// or if env vars are used for Unleash Flags settings, they can be combined 
// these settings will be appended to the settings from the env variables
const flagConfig = {
    extraHttpHeaders: {
        Authorization: 'token123'
    }
};

if (root != null) {
    ReactDOM.render((
        <FlagsProvider config={flagConfig} >
            <App />
        </FlagsProvider>
    ), cakeRoot);
}
```
## Usage
Make sure you've setup the `<FlagsProvider>` correctly.
### Custom `useFlag` Hook
```javascript
// load the flag using the useFlag hook
const flag = useFlag(name);

// a flag that does not exist will return undefined
if (flag && flag.enabled) {
    ...
}
```
### React `<FeatureFlag>` component
Attributes:
- name: string - the name of the flag
- defaultValue (optional, default=false): boolean - the value when the flag does not exist or when it is still loading
- invert (optional, default=false): boolean - if true, the child elements will render when the feature is disabled

The `<FeatureFlag>` component can handle both JSX and a function as child elements:
```html
<FeatureFlag name="test-flag">
    hello, this flag is enabled
</FeatureFlag>

<FeatureFlag name="test-flag" invert={true}>
    hello, this flag is disabled
</FeatureFlag>

<FeatureFlag name="test-flag">
    {(flag) => { console.log(flag); }}
</FeatureFlag>
```

## Strategies

This library supports the following strategies:

- default: flag will be activated for all users
- userWithId: flag will be activated where the user id is in the list
- gradualRolloutUserId - flag will be activated for a percentage of users, this is deterministic based on the userId.

This is the set currently supported by Gitlab.
# Links
- Unleash (https://unleash.github.io/)
- GitLab Feature Flags (https://docs.gitlab.com/ee/user/project/operations/feature_flags.html)
