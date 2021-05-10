function getTheTitle() {
  return cy.title().then((title) => {
    console.log(title)
  })
}

module.exports = {
  getTheTitle,
}
