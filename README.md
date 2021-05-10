# payment-app-cypress-typescript

This repo is an example Test Framework running against https://checkout.stripe.dev/ and using https://www.cypress.io with typescript

## Prerequisites

- [node](https://docs.npmjs.com/getting-started/installing-node) and npm are installed

- For the cypress.io system requirements please see [here](https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements)

- [Docker](https://www.docker.com/) should be installed on the CI system

- To install the packages run `npm ci`

## Test Execution

There are several ways to run the suite. It's also possible to run subsets or targeted tests using the cucumber tagging feature.

| Folder                                                          | Description                        |
| --------------------------------------------------------------- | ---------------------------------- |
| Run In Interactive Mode                                         | `npm cypress open`                 |
| Run In CLI Mode with chrome.                                    | `npx cypress run --browser chrome` |
| Run In CLI Mode with mobile viewport size {package.json script} | `npm run test-mobile-width-360`    |
| Run In CLI Mode using Docker {package.json script}              | `npm run test-chrome-docker`       |

You can also select which browser to use in the top right of the cypress app.

It is possible to run using electron in CI without any additional browsers installed.

### Test Related Folders

Test related files can be found in the following folders.

## Test Overview

Below are some high level clarifications on the purpose of the different tests.

| Test                     | Intention                                            |
| ------------------------ | ---------------------------------------------------- |
| Transactions3dAuthTest   | Tests around the 3D Authentication                   |
| TransactionsDeclinedTest | Validating the Declined Card Scenarios               |
| FormValidationTest       | Form related tests                                   |
| TransactionsSuccessTest  | Successful Transaction Tests for different languages |
| PerformanceAuditTest     | Example Lighthouse Performance Check                 |

## Docker

Docker can be used to run the framework against chrome using the following command.

`docker run -it -v $PWD:/e2e -w /e2e cypress/included:6.8.0 --config baseUrl=https://checkout.stripe.dev/ --browser chrome`

## Test Data

I utilized faker to populate realistic data for each language.

I utilized fixtures in cypress/fixtures as an example of how to store differences for each language.

In several tests I gave an example of randomizing the credit card used to increase coverage. Some of the declined and 3d cards provided by the stripe documentation did not have additional card brand variants. I would want to expand on additional cards for each in a real test framework.

## Linting

Linting has been added.
Normally I would also add prettier in as well.

To run linting `npm run lint`
To run the linting and fix issues `npm run lint-fix`

## Implementation Notes

### Browsers

Tests are passing against

- Electron
- Chrome (ui and headless)

I set the default viewport to one of the most popular ones. Reference https://gs.statcounter.com/screen-resolution-stats

Internal metrics would be used to tailor it towards a particular customer base.

```
"viewportWidth": 1920,
"viewportHeight": 1080
```

The most popular mobile browser viewport is width 360 x height 640. I added an additional script to run with that viewport with
an extended height of 740 to avoid scrolling issues.

`npm run test-mobile-width-360`

### Custom Commands

The bulk of the app interaction I have added into the cypress//support/commands.ts 
In a real test suite this would be split out into separate files

### Implementation Notes and Complications

To get around the cross domain concerns I used the checkout.stripe.dev api to get the iframe src, so this could directly be loaded. Prior to this it was failing when running against the iframe in the demo app when it tried to access stripe.com on payment submit

Built-in iframe Support is still pending in Cypress.io - https://github.com/cypress-io/cypress/issues/136
I see this ticket has been open since 2016, but it does look like there has been progress recently.
Hopefully a built-in solution is on the way to help with this.

As I was unable to resolve the 3D Payment iFrame issue myself, I am utilized
an example iFrame helper via stack overflow to help with that. Additional Details are in the commands.ts file.
There is one hard coded wait to give the payment iframe time to start loading which I didn't get time to look into. I would not leave this as it will only result in flakey behavior.
