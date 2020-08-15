import React, {useState, useRef} from 'react'

export const FilterContacts = () => {
  const inputContactsRef = useRef(null)
  const [listContacts, setListContacts] = useState(null)


  function filterContactsWithNames(listContacts) {
    const regExp = /(- 3|- 8|- 0|- +).+?\s(?=( - \d|- \d| - \+|- \+))/g;
    const afterRegExp = listContacts.match(regExp)
    console.log("afterRegExp -", afterRegExp)
    let splitOn = ''
    let contact = ''
    let arrayContacts = []
    for (let element of listContacts) {
      if ((splitOn === '') && (element === '-')) {
        splitOn += element
      } else if ((splitOn === '-') && (element === ' ')) {
        splitOn += element
      } else if ((splitOn === '- ') && ((element === '+') || (element === '3') || (element === '8') || (element === '0'))) {
        arrayContacts.push(contact)
        splitOn = ''
        if (element === '0') { 
          contact = '0'
        } else contact = ''
      } else {
        splitOn = ''
        contact += element
      }
    }
    const readyList = arrayContacts.join('-\n')
    setListContacts(readyList)
  }

  function compareNambers(listContacts) {
    const arrayNumbers = createArrayNumbers(listContacts)
    const arrayShortNumbers = cutNumbers(arrayNumbers)
    const readyList = finishedListNumbers(arrayShortNumbers).join('-\n')
    setListContacts(readyList)
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
          console.log(arrayShortNumbers[index])
          arrayShortNumbers.splice(index, 1)
        }
      }
    }

    return arrayShortNumbers
  }

  return (
    <div>
      <div className="filter-contacts">
        <label className="filter-contacts-label" htmlFor="email">Filter Contacts</label>
        <input
          placeholder="Введите список контактів"
          type="text"
          name="email"
          className="none-border-bottom"
          ref={inputContactsRef}
        />
        <button onClick={listContacts => filterContactsWithNames(inputContactsRef.current.value)}>With name</button>
        <button onClick={listContacts => compareNambers(inputContactsRef.current.value)}>Without name</button>
      </div>
      <div className="b">{listContacts}</div>
    </div>)
}



















