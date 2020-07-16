import React from 'react'

export const FilterContacts = () => {
  console.log('FilterContacts')

  function compareNambers() {
  	const listContacts = prompt('введите штото')
    if (!listContacts) return null

    const arrayNumbers = createArrayNumbers(listContacts)
    const arrayShortNumbers = cutNumbers(arrayNumbers)
    const readyList = finishedListNumbers(arrayShortNumbers).join('\n-')

    return finishedListNumbers(arrayShortNumbers).map(i => {
      return <p key={Date.now} className="colore">{i}</p>
    })
  }

  function cutNumbers(arr) { 
    const listReducedNumbers = arr.map(element => {
      if (element.length === 10) {
        return element
      } else if (element.length === 11) {
        return element.slice(1, 10)
      } else if (element.length === 12) {
        return element.slice(2, 11)
      } else return element
    })

    return listReducedNumbers
  }

  function createArrayNumbers(listNumbers) {
    let numEl = ''

    for (let element of listNumbers) {
      if ( element === '0') {
        numEl +=  element
      } else if ( parseInt( element) ) {
        numEl +=  element
      } else if (( element !== ' ') && (numEl[numEl.length - 1] !== ' ')) {
        numEl += ' '
      }
    }

    return numEl.split(' ')
  }

  function finishedListNumbers(listContacts) {
    let arrayShortNumbers = listContacts

    for (let index in arrayShortNumbers) {
      for (let secendIndex in arrayShortNumbers) {

        if ((arrayShortNumbers[index] === arrayShortNumbers[secendIndex]) && 
        (index !== secendIndex) && 
        (arrayShortNumbers[index] !== undefined)) {
          arrayShortNumbers.splice(index, 1)
        }
      }
    }

    return arrayShortNumbers
  }

  return <div className="b">{compareNambers()}</div>
}



















/*function createArrayNumbersWithNames(listNumbers) {
    let yes = ''
    let numEl = ''
    let a = []
    for (let element of listNumbers) {
      if ((yes === '') && (element === '-')) {
        yes += element
      } else if ((yes === '-') && (element === ' ')) {
        yes += element
      } else if ((yes === '- ') && ((element === '+') || (element === '3') || (element === '8') || (element === '0'))) {
        a.push(numEl)
      yes = ''
      if (element === '0') { 
        numEl = '0'
      } else numEl = ''
      } else {
        yes = ''
        numEl += element
      }
    }
    return a
  }*/
