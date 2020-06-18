import { Transform } from 'jscodeshift';

const transform: Transform = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const printOptions = options.printOptions ?? {};

  const injectIntlImports = root
    .find(j.ImportDeclaration, {
      source: {
        value: 'react-intl',
      },
    })
    .find(j.ImportSpecifier, {
      imported: {
        name: 'injectIntl',
      },
    });

  if (injectIntlImports.size() === 0) {
    return undefined;
  }

  // Replace injectIntl import with useIntl
  injectIntlImports.replaceWith(j.importSpecifier(j.identifier('useIntl')));

  // Replace injectIntl calls with WrappedComponent
  root
    .find(j.CallExpression, {
      callee: {
        name: 'injectIntl',
      },
    })
    .forEach((injectIntlCall) => {
      const WrappedComponent = injectIntlCall.node.arguments[0];
      injectIntlCall.replace(WrappedComponent);
    });

  return root.toSource(printOptions);
};

export default transform;
