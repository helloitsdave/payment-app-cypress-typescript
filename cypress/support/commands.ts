import faker from 'faker'
import 'cypress-audit/commands'

/**
 * Launches the app
 * Calls the checkout.stripe.dev api to get the demo-session url
 * There is no cross domain restriction on cy.request, so it's then possible
 * to parse the response and then use cy.visit to hit checkout.stripe.com
 * Otherwise cypress has issues on the cross domain nature of the submit
 * This command takes an optional CountryCode parameter (defaults to 'us')to set language
 * This would be extended to take in options object in order to configure the other paramters
 * @example cy.launchApp('gb')
 */
Cypress.Commands.add('launchApp', (countryCode: CountryCode = 'us') => {
  cy.request({
    url: 'api/demo-session',
    qs: {
      country: countryCode,
      billingPeriod: 'monthly',
      hasBgColor: false,
      hasBillingAndShipping: false,
      hasCoupons: false,
      hasFreeTrial: false,
      hasShippingRate: false,
      hasTaxes: false,
      mode: 'payment',
      wallet: 'applePay',
      hasPolicies: false,
      billingType: 'flat',
    },
  }).then((request) => {
    cy.visit(request.body.url)
  })
})

/**
 * Submits the payment form
 * @example cy.submitForm()
 */
Cypress.Commands.add('submitForm', () => {
  cy.get('button[type="submit"]').click()
})

/**
 * Fills and Submits the payment form
 * @example cy.makePayment({ cardNumber: '34534534534', location: country })
 */
Cypress.Commands.add('makePayment', (paymentObject: PaymentObject) => {
  cy.fillForm(paymentObject).then(() => {
    cy.submitForm()
  })
})

Cypress.Commands.add('getRandomSuccessfulCard', () => {
  cy.fixture('SuccessfulCards').then((successfulCards) => {
    return successfulCards[Math.floor(Math.random() * successfulCards.length)]
  })
})

/**
 * Sets the Faker Locale to Match the CountryCode
 * @example cy.setFakerLanguage('United States')
 */

Cypress.Commands.add('setFakerLanguage', (location: CountryCode) => {
  switch (location) {
    case 'us': {
      faker.locale = 'en_US'
      break
    }
    case 'mx': {
      faker.locale = 'es_MX'
      break
    }
    case 'gb': {
      faker.locale = 'en_GB'
      break
    }
    case 'au': {
      faker.locale = 'en_AU'
      break
    }
    case 'jp': {
      faker.locale = 'ja'
      break
    }
    case 'cn': {
      faker.locale = 'zh_CN'
      break
    }
    default: {
      throw new Error('Invalid case')
    }
  }
})

/**
 * Fills the payment form
 * @example cy.fillForm({ cardNumber: '34534534534', location: country })
 * Omitted attributes will be set with faker values
 */
Cypress.Commands.add('fillForm', (paymentObject: PaymentObject) => {
  let { location } = paymentObject
  if (!location) {
    location = 'us'
  }
  // Set Faker Language to Appropriate Country Language
  cy.setFakerLanguage(location).then(() => {
    let { name, zipCode, email, cardExpiry, cardCvc } = paymentObject
    const { cardNumber } = paymentObject

    if (!email) {
      email = faker.internet.email()
    }

    if (cardNumber) {
      cy.get('input#cardNumber').type(cardNumber)
    }

    cy.get('input#email').type(email)

    if (!cardExpiry) {
      cardExpiry = '03/25'
    }
    cy.get('input#cardExpiry').type(cardExpiry)

    if (!cardCvc) {
      cardCvc = faker.finance.creditCardCVV()
    }
    cy.get('input#cardCvc').type(cardCvc)

    if (!name) {
      name = faker.name.findName()
    }
    cy.get('input#billingName').type(name)

    // For Countries which have a Zip/Postal Code Enter It
    if (['us', 'gb'].includes(location)) {
      if (!zipCode) {
        zipCode = faker.address.zipCode()
      }
      cy.get('input#billingPostalCode').type(zipCode)
    }
  })
})

/**
 * Gets the Expected Results language file
 * Parses out spaces so it can retrieve the config file
 * @example cy.getExpectedResultsFixture('Japan')
 * Language File can then be retrieved with cy.get('@currentLanguageFixture')
 */
Cypress.Commands.add('getExpectedResultsFixture', (location: Country) => {
  cy.fixture(`${location.replace(' ', '')}.json`).as('currentLanguageFixture')
})

/**
 * Checks the correct currency symbol is displayed
 */
Cypress.Commands.add('checkCurrencySymbol', (location: CountryCode) => {
  cy.getExpectedResultsFixture(location).then((expected: any) => {
    cy.find('#ProductSummary-totalAmount').should(
      'contain.text',
      expected.currencySymbol
    )
  })
})

/**
 * Gets the displayed price from the UI
 */
Cypress.Commands.add('getDisplayedPrice', () => {
  cy.find('#ProductSummary-totalAmount').invoke('text').as('displayedPrice')
})

/**
 * Gets the error message from the UI
 */
Cypress.Commands.add('getErrorMessage', () => {
  return cy.get('fieldset#cardNumber-fieldset span[class^="FieldError"] > span')
})

Cypress.Commands.add('getHighlightedErrorFields', () => {
  return cy.get('input[class*="CheckoutInput--invalid"]')
})

/**
 * Clicks on the 3D Authenticate button
 */
Cypress.Commands.add('complete3dAuthentication', () => {
  cy.get3dAuthenticationIframe()
    .find('button#test-source-authorize-3ds', { timeout: 20000 })
    .click()
})

/**
 * Clicks on the 3D Authenicate button
 */
Cypress.Commands.add('fail3dAuthentication', () => {
  cy.get3dAuthenticationIframe()
    .find('button#test-source-fail-3ds', { timeout: 20000 })
    .click()
})

/**
 * Clicks on the 3D Authenicate button
 */
Cypress.Commands.add('get3dAuthenticationIframe', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(10000)
  // TODO: Normally I would never hard code a wait but I didn't get enough time to
  // change this logic to confirm the iFrame has content before returning it

  return cy
    .get('iframe[name^="__privateStripeFrame"]')
    .iframe()
    .find('#challengeFrame')
    .iframe()
})

/**
 * DISCLAIMER!!
 * Built-in iframe Support is still pending in Cypress.io - https://github.com/cypress-io/cypress/issues/136
 * I see this ticket has been open since 2016, but it does look like there has been progress recently.
 * Hopefully a built-in solution is on the way.
 *
 * As I was unable to solve the 3D Payment iFrame issue myself, I am utilizing the following
 * online iFrame helper to help with that. Comments below here for the remainder of the file are not mine.
 */

/**
 * Will check if an iframe is ready for DOM manipulation. Just listening for the
 * load event will only work if the iframe is not already loaded. If so, it is
 * necessary to observe the readyState. The issue here is that Chrome initialises
 * iframes with "about:blank" and sets their readyState to complete. So it is
 * also necessary to check if it's the readyState of the correct target document.
 *
 * Some hints taken and adapted from:
 * https://stackoverflow.com/questions/17158932/how-to-detect-when-an-iframe-has-already-been-loaded/36155560
 *
 * @param $iframe - The iframe element
 */
const isIframeLoaded = ($iframe) => {
  const contentWindow = $iframe.contentWindow

  const src = $iframe.attributes.src
  const href = contentWindow.location.href
  if (contentWindow.document.readyState === 'complete') {
    return href !== 'about:blank' || src === 'about:blank' || src === ''
  }

  return false
}

/**
 * Wait for iframe to load, and call callback
 *
 * Some hints taken and adapted from:
 * https://gitlab.com/kgroat/cypress-iframe/-/blob/master/src/index.ts
 */
Cypress.Commands.add(
  'iframe',
  { prevSubject: 'element' },
  ($iframes) =>
    new Cypress.Promise((resolve) => {
      const loaded = []

      $iframes.each((_, $iframe) => {
        loaded.push(
          new Promise((subResolve) => {
            if (isIframeLoaded($iframe)) {
              subResolve($iframe.contentDocument.body)
            } else {
              Cypress.$($iframe).on('load.appearHere', () => {
                if (isIframeLoaded($iframe)) {
                  subResolve($iframe.contentDocument.body)
                  Cypress.$($iframe).off('load.appearHere')
                }
              })
            }
          })
        )
      })

      return Promise.all(loaded).then(resolve)
    })
)
