# Upgrade `react-intl` from v2 to v4

![](https://github.com/quintoandar/farewell-immutablejs/workflows/Node.js%20CI/badge.svg)
![](https://github.com/quintoandar/farewell-immutablejs/workflows/Node.js%20Package/badge.svg)

Codemods to migrate [react-intl](https://formatjs.io/docs/react-intl) from v2 to v4.

Never heard of codemods? Here is a quick summary from [facebook/codemod](https://github.com/facebook/codemod):

> codemod is a tool/library to assist you with large-scale codebase refactors that can be partially automated but still require human oversight and occasional intervention.

## How to use

```bash
# installing globally
npm install -g @quintoandar/react-intl-v2-to-v4

# starting the interactive prompt
react-intl-v2-to-v4

# running a specific transform with glob and custom options
react-intl-v2-to-v4 'src/**/*.test.js' migrateGetChildContext --dry

# passing jscodeshift options
# learn more at https://github.com/facebook/jscodeshift#usage-cli
react-intl-v2-to-v4 . migrateIntlShape --jscodeshift="--run-in-band"

# passing recast options
# useful for formatting configuration (tab size, quotes, trailing comma etc.)
# learn more at https://github.com/benjamn/recast/blob/822b013218a583c555bcf754beddfc52371b4a58/lib/options.ts
react-intl-v2-to-v4 . migrateIntlShape --jscodeshift="--printOptions='{\"quote\":\"double\"}'"

# or using npx
npx @quintoandar/react-intl-v2-to-v4
```

Use `react-intl-v2-to-v4 --help` to see the CLI commands or refer to the [help file](./src/bin/help.txt).

## Features

### Migrate `intlShape` prop type (`migrateIntlShape`)

Remove the deprecated `intlShape` import and replace its occurrences with `PropType.object`. 
It automatically adds `import PropTypes from 'prop-types'` if necessary.

```diff
import React from 'react';
+ import PropTypes from 'prop-types';
- import { injectIntl, intlShape } from 'react-intl';
+ import { injectIntl } from 'react-intl';

// ...

Component.propTypes = {
  foo: PropTypes.bool,
-  intl: intlShape.isRequired,
+  intl: PropTypes.object.isRequired,
};
```

**Note**: if you are using named imports from `prop-types`, you will get a duplicate import

```diff
import React from 'react';
import { bool, string } from 'prop-types';
+ import PropTypes from 'prop-types';
- import { injectIntl, intlShape } from 'react-intl';
+ import { injectIntl } from 'react-intl';
```

Linting with a [`no-duplicate-imports` rule](https://eslint.org/docs/rules/no-duplicate-imports) will catch these cases.

### Migrate `injectIntl` `withRef` option (`migrateInjectIntlWithRef`)

Replace the deprecated `withRef` option with `forwarRef`.

```diff
import { injectIntl } from 'react-intl';

// ...

- export default injectIntl(MyComponent, { withRef: true });
+ export default injectIntl(MyComponent, { forwardRef: true });
```

**Note**: any change related to migrating to the React > 16.3 `ref` API must be done manually.

### Migrate `getChildContext` (`migrateGetChildContext`)

This transform searches speciffically for this pattern:

```js
const intlProvider = new IntlProvider({ locale: 'en', defaultLocale: 'en' }, {}); // IntlProvider arguments don't matter
const { intl } = intlProvider.getChildContext();
```

and replaces `intlProvider.getChildContext` with `createIntl`:

```diff
import React from 'react';
- import { IntlProvider } from 'react-intl';
+ import { createIntl, createIntlCache } from 'react-intl';

- const intlProvider = new IntlProvider({ locale: 'en', defaultLocale: 'en' }, {});
- const { intl } = intlProvider.getChildContext();
+ const intlCache = createIntlCache();
+ const intl = createIntl({
+   locale: 'en-US',
+   defaultLocale: 'en-US',
+ }, intlCache);
```

### Migrate `injectIntl` HOC to `useIntl` hook (partial) (`migrateInjectIntlToUseIntl`)

Replace the `injectIntl` import with `useIntl` and remove `injectIntl` calls by returning `WrappedComponent` directly.

```diff
import React from 'react';
- import { injectIntl } from 'react-intl';
+ import { useIntl } from 'react-intl';

const WrappedComponent = () => {
  return <div />;
};

- export default injectIntl(WrappedComponent);
+ export default WrappedComponent;
```

You will have to manually add the `useIntl` hook to your component:

```diff
import React from 'react';
import { useIntl } from 'react-intl';

const WrappedComponent = () => {
+  const intl = useIntl();
  return <div />;
};

export default WrappedComponent;
```

If you are composing multiple high-order components using something like `recompose`, you will have to remove `injectIntl` manually:

```diff
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
-  injectIntl,
)(Component);
```

## Unsupported changes

These codemods do not automate all required changes to upgrade from v2 or v3 to v4. 
It is necessary to do some manual work as described by the lists up next. 
Some of these tasks should be simple, like removing `addLocaleData`, a method most likely to be used only once per project, so a codemod would not save that much time.

- [v3] (optional) Keep `<span>` as default `textComponent`
- [v3] Remove `addLocaleData`/`ReactIntlLocaleData` and include `Intl.PluralRules` and `Intl.RelativeTimeFormat` polyfills
- [v3] Migrate `FormattedRelative`/`formatRelative` to new `FormattedRelativeTime`/`formatRelativeTime` API
- [v3] Update `FormattedMessage`/`formatMessage` rich text formatting
- [v3] Use apostrophe (`'`) instead of backslash (`/`) as escape character in messages
- [v3] Remove dash (`-`) from `{placeholder-variables}`
- [v3] Support ESM in build toolchain
- [v4] Migrate `FormattedHTMLMessage`/`formatHTMLMessage` to `FormattedMessage`/`formatMessage` with rich text

For more information, see the official guides:

- [Official Upgrade Guide (v3 -> v4)](https://formatjs.io/docs/react-intl/upgrade-guide-4x)
- [Official Upgrade Guide (v2 -> v3)](https://formatjs.io/docs/react-intl/upgrade-guide-3x)

## Contributing

The implementation of this tool is based on other open-source libraries, so check out their documentation:

- Transforms: [jscodeshift](https://github.com/facebook/jscodeshift)
- CLI: [meow](https://github.com/sindresorhus/meow)
- Prompt: [inquirer](https://github.com/SBoudrias/Inquirer.js)

### Testing

Unit tests are written with [Jest](https://github.com/facebook/jest) and [jscodeshift testing utilities](https://github.com/facebook/jscodeshift#unit-testing).

**Important**: if you are writting a test case where the file should not be changed, the expected output fixture must be empty!

### Releasing

Creating a [release](https://github.com/quintoandar/react-intl-v2-to-v4/releases) on GitHub automatically publishes a new version on npm.
