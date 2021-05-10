const successfulCards = [
  {
    brand: 'visa',
    number: '4242424242424242',
  },
  {
    brand: 'visa', // debit card
    number: '4000056655665556',
  },
  {
    brand: 'mastercard',
    number: '5555555555554444',
  },
  {
    brand: 'amex',
    number: '378282246310005',
  },
]

const declinedCards = [
  {
    brand: 'visa',
    number: '4000000000000002',
  },
  {
    brand: 'visa',
    numbe: '4000000000005126',
  },
]

function randomSuccessfulCard() {
  return successfulCards[Math.floor(Math.random() * successfulCards.length)]
}

function randomDeclinedCard() {
  return declinedCards[Math.floor(Math.random() * declinedCards.length)]
}

module.exports = {
  successfulCards,
  randomSuccessfulCard,
  declinedCards,
  randomDeclinedCard,
}
