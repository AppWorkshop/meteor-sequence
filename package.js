Package.describe({
  name: 'juto:sequence',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Manages aribtrary sequences in a Sequences collection',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/appworkshop/meteor-sequence.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

// This lets you use npm packages in your package:
Npm.depends({
  'number-sequence': '1.0.0'
});


Package.onUse(function(api) {
  api.versionsFrom('1.6');
  api.use('ecmascript','server');
  api.mainModule('sequence.js', 'server');
});

Package.onTest(function(api) {
  // You almost definitely want to depend on the package itself,
  // this is what you are testing!
  api.use('juto:sequence');
  // You should also include any packages you need to use in the test code
  api.use(['ecmascript', 'random', 'meteortesting:mocha', 'hwillson:stub-collections']);
  // Finally add an entry point for tests
  api.addFiles('sequence-tests.js','server');
});