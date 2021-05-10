import { randomSuccessfulCard } from '../support/creditCards'

/**
 * Example of looping through a test for a selected list of locations
 * Each language's expected results are taken from the matching fixture file
 * Validates both UI and API Responses
 */

const countries: CountryCode[] = ['us', 'cn', 'au', 'jp', 'gb', 'mx']

countries.forEach((country: CountryCode) => {
  describe(`Successful Transaction - Language Code: ${country}`, () => {
    before(() => {
      cy.launchApp(country)
      cy.intercept({ pathname: '**/confirm' }).as('confirmationApi')
      cy.intercept({ pathname: '**/payment_methods' }).as('paymentMethodApi')
      cy.intercept({ pathname: '**/completed_webhook_delivered/**' }).as(
        'checkoutApi'
      )
    })
    it('should accept the successful transaction', () => {
      // Set the Correct Fixture File based on Country
      cy.getExpectedResultsFixture(country)

      // Fill and Submit the form
      cy.makePayment({
        cardNumber: randomSuccessfulCard().number,
        location: country,
      })

      // Validate API Calls were made
      cy.get('@currentLanguageFixture').then((expected: any) => {
        cy.wait('@confirmationApi', { timeout: 10000 })
          .its('response.statusCode')
          .should('eq', 200)

        cy.wait('@paymentMethodApi')
          .its('response.statusCode')
          .should('eq', 200)

        cy.wait('@checkoutApi').its('response.statusCode').should('eq', 200)

        /* 
          Validate Confirmation Api Response
          Note: In a real situation I'd look at the full response.
          For purposes of an example I'm validating several key values
        */
        cy.get('@confirmationApi')
          .its('response.body.payment_intent.status')
          .should('eq', 'succeeded')
        cy.get('@confirmationApi')
          .its('response.body.payment_intent.amount')
          .should('eq', expected.amount)
        cy.get('@confirmationApi')
          .its('response.body.currency')
          .should('eq', expected.currency)
      })

      // Check UI Contains the expected payment method
      cy.contains('Payment success')
    })
  })
})
