import { Transform } from 'jscodeshift';

const transform: Transform = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const printOptions = options.printOptions ?? {
    quote: 'single',
  };

  const reactIntlImports = root.find(j.ImportDeclaration, {
    source: {
      value: 'react-intl',
    },
  });
  const intlShapeImports = reactIntlImports.find(j.ImportSpecifier, {
    imported: {
      name: 'intlShape',
    },
  });

  if (intlShapeImports.size() === 0) {
    return undefined;
  }

  // Ensure a PropTypes default import exists
  const propTypesDefaultImports = root
    .find(j.ImportDeclaration, {
      source: {
        value: 'prop-types',
      },
    })
    .find(j.ImportDefaultSpecifier)
    .find(j.Identifier, {
      name: 'PropTypes',
    });
  if (propTypesDefaultImports.size() === 0) {
    // Put it before first react-intl import
    reactIntlImports.insertBefore(
      j.importDeclaration(
        [j.importDefaultSpecifier(j.identifier('PropTypes'))],
        j.literal('prop-types'),
      ),
    );
  }

  // Remove intlShape imports
  reactIntlImports.forEach((intlImport) => {
    j(intlImport)
      .find(j.ImportSpecifier, {
        imported: {
          name: 'intlShape',
        },
      })
      .remove();

    const specifiers = j(intlImport).find(j.ImportSpecifier);

    if (specifiers.size() === 0) {
      j(intlImport).remove();
    }
  });

  // Replace intlShape with PropTypes.object
  root
    .find(j.Identifier, {
      name: 'intlShape',
    })
    .replaceWith(() =>
      j.memberExpression(j.identifier('PropTypes'), j.identifier('object')),
    );

  return root.toSource(printOptions);
};

export default transform;
