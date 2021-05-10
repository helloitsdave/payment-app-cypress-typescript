/**
 * Declined Cards should not be successful
 */
describe('Declined - Payment App', () => {
  beforeEach(() => {
    cy.launchApp()
    cy.intercept({ pathname: '**/confirm' }).as('confirmationApi')
    cy.intercept({ pathname: '**/payment_methods' }).as('paymentMethodApi')
  })
  it('should deline the card with the expected error messages and responses', () => {
    // Set the Correct Fixture File based on Country
    cy.getExpectedResultsFixture('us')

    cy.makePayment({ cardNumber: '4000000000000002' })

    cy.wait('@confirmationApi').its('response.statusCode').should('eq', 402)
    cy.wait('@paymentMethodApi').its('response.statusCode').should('eq', 200)

    cy.get('@confirmationApi')
      .its('response.body.error.message')
      .should('eq', 'Your card was declined.')

    // Validate Error Text in the UI
    cy.getErrorMessage().should(
      'have.text',
      'Your card was declined. Please try a different card.'
    )
    // Validate Correct Error Field is highlighted
    cy.getHighlightedErrorFields()
      .should('contain.id', 'cardNumber')
      .and('have.length', 1)
  })
})
