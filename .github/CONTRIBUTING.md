# Conflux Bounty Contributing Guide

Hi! We are really excited that you are interested in contributing to conflux bounty. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of conduct](CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Issue Reporting Guidelines

- Please check the existing issues and the [Conflux Bounty Site](https://bounty.confluxnetwork.org) to avoid submitting duplicate issues.

## Pull Request Guidelines

- The `master` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch. Submit to `dev` branch instead.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- Work in the `src` folder and **DO NOT** checkin `build` directory into commits.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- Make sure `yarn test` and `yarn lint` passes. (see [development setup](#development-setup))

- If adding a new feature:
  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue or [bounty](https://bounty.confluxnetwork.org/create-bounty) first and have it approved before working on it.

- If fixing bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

## Development Setup

You will need [Node.js](http://nodejs.org) **version 8+**, and [yarn](https://yarnpkg.com/en/docs/install).

After cloning the repo, run:

``` bash
$ yarn # install the dependencies of the project
```

Please use yarn instead of npm.

<!-- ### Committing Changes -->

### Commonly used yarn scripts

``` bash
# serve watch and auto re-build the site
$ yarn dev

# watch and auto re-run unit tests
$ yarn test:watch

# build the site
$ yarn build

# run the full test suite, including linting
$ yarn test
```

There are some other scripts available in the `scripts` section of the `package.json` file.

The default test script will do the following: lint with ESLint -> unit tests with coverage. **Please make sure to have this pass successfully before submitting a PR.** Although the same tests will be run against your PR on the CI server, it is better to have it working locally.

## Project Structure

- **`scripts`**: contains build-related scripts and configuration files. Usually, you don't need to touch them.

- **`build`**: contains built files for deploy. Note this directory shouldn't be checked into version control.

- **`static`**: contains static resource files, these files won't go through webpack.

- **`src`**: contains the source code. The codebase is written in ES2015.

    - **`components`**: contains common ui components.

    - **`assets`**: contains images and other resource files that go through webpack compilation.

    - **`pages`**: contains pages.

    - **`lang`**: contains i18n translations templates.

    - **`utils`**: contains common functions like function to send request.

        - **`index.js`**: contains commonly used functions.

        - **`api.js`**: contains functions to request backend data, these functions usually called from [redux-thunk](https://github.com/reduxjs/redux-thunk#readme) actions.


## Project technologies

Bounty uses react, redux, redux-thunk, styled-components to build the frontend.

### Redux

Pages have their own reducer and actions.

```
pages
  └── Home
    ├── action.js
    ├── index.js
    └── reducer.js
```

## Credits

Thank you to all the people who have already contributed to conflux bounty!