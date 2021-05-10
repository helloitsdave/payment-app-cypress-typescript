/**
 * Very simple example of using the Lighthouse Plugin to Capture
 * Checks to avoid regressions
 * I initially set the expected numbers to the current ones I am currently getting back
 * This of course will change based on network throughput and external factors.
 * It can be more controlled running the app locally through docker in CI
 */
describe('Performance Lighthouse Check - Payment App', () => {
  it('should return error', () => {
    cy.launchApp()

    cy.lighthouse({
      performance: 10,
      accessibility: 50,
      'best-practices': 50,
      seo: 50,
      pwa: 42,
    })
  })
})
