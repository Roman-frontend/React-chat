import React from 'react'

export const FilterContacts = () => {
	  let readyListContacts = []


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
    readyListContacts = listReducedNumbers
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

    readyListContacts = numEl.split(' ')
    return readyListContacts
  }

  let l = false

  function finishedListNumbers(listContacts) {
    let arrayShortNumbers = listContacts

    for (let index in arrayShortNumbers) {
      for (let secendIndex in arrayShortNumbers) {

        if ((arrayShortNumbers[index] === arrayShortNumbers[secendIndex]) && (index !== secendIndex) && (arrayShortNumbers[index] !== undefined)) {
          arrayShortNumbers.splice(index, 1)
        }
      }
    }

    return arrayShortNumbers
  }

  function compareNambers() {
    let listContacts = prompt('введите штото')

    const arrayNumbers = createArrayNumbers(listContacts)
    const arrayShortNumbers = cutNumbers(arrayNumbers)
    const readyList = finishedListNumbers(arrayShortNumbers).join('\n-')
    console.log(readyList)
    return finishedListNumbers(arrayShortNumbers).map(i => {
      return <p className="colore">{i}</p>
    })
  }

/*  let numbersNames = []

  function listContacts(listNumbers) {
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
	return (
      <div className="b">
        {compareNambers()}
      </div>
	);
}