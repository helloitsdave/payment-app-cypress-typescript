import { randomSuccessfulCard } from '../support/creditCards'

/**
 * Example of the Payment Validation Checks
 * Additional Test Scenarios Specfied below.
 */

describe('Form Validation - Payment App', () => {
  beforeEach(() => {
    cy.launchApp()
    cy.intercept({ pathname: '**/confirm' }).as('confirmationApi')
    cy.intercept({ pathname: '**/payment_methods' }).as('paymentMethodApi')
  })
  it('should return error when date is in past', () => {
    // Set the Correct Fixture File based on Country
    cy.fillForm({
      cardNumber: randomSuccessfulCard().number,
      cardExpiry: '01/20',
    })
    // Validate Error Text in the UI
    cy.getErrorMessage().should(
      'have.text',
      `Your card's expiration year is in the past.`
    )
    // Validate Correct Error Field is highlighted
    cy.getHighlightedErrorFields()
      .should('contain.id', 'cardExpiry')
      .and('have.length', 1)
  })
})
