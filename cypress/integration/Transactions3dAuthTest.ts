const cardNumberAuthentication = '4000002500003155'

/**
 * Validates the 3D Authentication Mechanisms.
 * This was were I initially had a lot of complications interacting with the 3d iframe.
 */

describe('3D Authentication', () => {
  beforeEach(() => {
    cy.launchApp()
    cy.intercept({ pathname: '**/confirm' }).as('confirmationApi')
    cy.intercept({ pathname: '**/payment_methods' }).as('paymentMethodApi')
  })
  it('should have success payment when accepting 3D authentication', () => {
    cy.makePayment({ cardNumber: cardNumberAuthentication })

    cy.wait('@confirmationApi').its('response.statusCode').should('eq', 200)

    cy.get('@confirmationApi')
      .its('response.body.payment_intent.status')
      .should('eq', 'requires_action')
    cy.get('@confirmationApi')
      .its('response.body.payment_intent.next_action.use_stripe_sdk.type')
      .should('eq', 'three_d_secure_redirect')

    cy.complete3dAuthentication()

    cy.contains('Payment success', { timeout: 20000 })
  })
  it('should have failed payment when failing 3d authentication', () => {
    cy.makePayment({ cardNumber: cardNumberAuthentication })

    cy.wait('@confirmationApi').its('response.statusCode').should('eq', 200)

    cy.get('@confirmationApi')
      .its('response.body.payment_intent.status')
      .should('eq', 'requires_action')
    cy.get('@confirmationApi')
      .its('response.body.payment_intent.next_action.use_stripe_sdk.type')
      .should('eq', 'three_d_secure_redirect')

    cy.fail3dAuthentication()

    cy.contains(
      'We are unable to authenticate your payment method. Please choose a different payment method and try again.',
      { timeout: 20000 }
    )
  })
})
