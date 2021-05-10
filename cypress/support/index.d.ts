// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Launches the app
     */
    launchApp(countryCode?: CountryCode): Chainable<Element>

    getErrorMessage(): Chainable<Element>

    fillForm(formObject: PaymentObject): Chainable<Element>

    makePayment(formObject: PaymentObject): Chainable<Element>

    submitForm(): Chainable<Element>

    getExpectedResultsFixture(location: CountryCode): Chainable<Element>

    selectLocation(location: CountryCode): Chainable<Element>

    setFakerLanguage(location: CountryCode): Chainable<Element>

    validateAuthenticationTransaction(): Chainable<Element>

    getRandomSuccessfulCard(): Chainable<Element>

    getHighlightedErrorFields(): Chainable<Element>

    lighthouse(object: LighthouseObject): Chainable<Element>

    complete3dAuthentication(): Chainable<Element>

    fail3dAuthentication(): Chainable<Element>

    get3dAuthenticationIframe(): Chainable<Element>

    iframe(): Chainable<Element>
  }
}

type Country =
  | 'United States'
  | 'Mexico'
  | 'United Kingdom'
  | 'Australia'
  | 'Japan'
  | 'China'

type CountryCode = 'us' | 'cn' | 'au' | 'jp' | 'gb' | 'mx'

type PaymentObject = {
  cardNumber: string
  location?: CountryCode
  email?: string
  cardExpiry?: string
  cardCvc?: string
  name?: string
  zipCode?: string
}

type LighthouseObject = {
  performance: number
  accessibility: number
  'best-practices': number
  seo: number
  pwa: number
}
