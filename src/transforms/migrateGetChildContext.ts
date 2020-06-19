import { Transform } from 'jscodeshift';

const transform: Transform = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const printOptions = options.printOptions ?? {
    quote: 'single',
    trailingComma: true,
  };

  const intlProviderImports = root
    .find(j.ImportDeclaration, {
      source: {
        value: 'react-intl',
      },
    })
    .find(j.ImportSpecifier, {
      imported: {
        name: 'IntlProvider',
      },
    });

  if (intlProviderImports.size() === 0) {
    return undefined;
  }

  // Replace IntlProvider import with createIntl and createIntlCache
  intlProviderImports.replaceWith([
    j.importSpecifier(j.identifier('createIntl')),
    j.importSpecifier(j.identifier('createIntlCache')),
  ]);

  // Remove old intl declaration
  root
    .find(j.VariableDeclarator, {
      id: {
        type: 'ObjectPattern',
      },
    })
    .filter((p) => j(p).find(j.Identifier, { name: 'intl' }).size() > 0)
    .remove();

  // Create intlCache and new intl
  const intlCache = j.variableDeclarator(
    j.identifier('intlCache'),
    j.callExpression(j.identifier('createIntlCache'), []),
  );
  const intl = j.variableDeclaration('const', [
    j.variableDeclarator(
      j.identifier('intl'),
      j.callExpression(j.identifier('createIntl'), [
        j.objectExpression([
          j.property('init', j.identifier('locale'), j.literal('en-US')),
          j.property('init', j.identifier('defaultLocale'), j.literal('en-US')),
        ]),
        j.identifier('intlCache'),
      ]),
    ),
  ]);
  root
    .findVariableDeclarators('intlProvider')
    .replaceWith(intlCache)
    .closest(j.VariableDeclaration)
    .insertAfter(intl);

  return root.toSource(printOptions);
};

export default transform;
