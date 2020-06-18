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

  // Replace withRef property with forwardRef
  root
    .find(j.CallExpression, {
      callee: {
        name: 'injectIntl',
      },
    })
    .find(j.ObjectExpression)
    .find(j.Property)
    .find(j.Identifier, {
      name: 'withRef',
    })
    .replaceWith(j.identifier('forwardRef'));

  return root.toSource(printOptions);
};

export default transform;
