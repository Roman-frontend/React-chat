import React, {useState, useRef, useEffect} from 'react'

export const FilterContacts = () => {
  const inputContactsRef = useRef(null)
  const [listContacts, setListContacts] = useState(null)
  const [storageContacts, setStorageContacts] = useState('')

  useEffect(() => {
    inputContactsRef.current.focus();
  }, []);

  useEffect(() => {
    /** JSON.parse() - приводить результат до обєкта */
    const storageContacts = JSON.parse(localStorage.getItem('storageContacts'))

    if (storageContacts) {
      setStorageContacts(storageContacts)
      console.log(storageContacts, 'storageContacts')
    }
  }, [])


  function compareContactsWithNames(listContacts) {
    const contactsReadyToAudit = `${listContacts} - 3`
    const regExp = /(- 3|- 8|- 0|- +).+?\s(?=(?:( ?- \d| ?- \+)))/g;
    const afterAuditRegExp = contactsReadyToAudit.match(regExp)
    const readyList = afterAuditRegExp.join('\n')
    setListContacts(readyList)
  }

  function compareContactsWithoutNames(listContacts) {
    const arrayNumbers = getArrayContacts(listContacts)
    const readyList = finishedListNumbers(arrayNumbers).join('\n - ')

    setListContacts(readyList)
  }

  function saveContactsToLocalStorage() {
    const combinedArrayStorageAndInputNumbers = listContacts.concat(storageContacts)
    localStorage.setItem('storageContacts', JSON.stringify(` - ${combinedArrayStorageAndInputNumbers}`))
  }

  function cleanStorage() {
    localStorage.removeItem('storageContacts')
  }

  function getArrayContacts(listContacts) { 
    const regExp = /[\d ]+\d/gi;

    const arrayNumbers = listContacts.match(regExp)
    const readyContactsArray = arrayNumbers.map(contact => {
      const contactWithoutEmptyPlace = contact.split(' ').join('')
      return contactWithoutEmptyPlace.split('').splice(-10, 10).join('')
    })
    console.log('Short numbers -', readyContactsArray)

    return readyContactsArray
  }

  function finishedListNumbers(listContacts) {
    let inputContacts = listContacts
    let storageArrayContacts = []
    if (storageContacts) {
      storageArrayContacts = getArrayContacts(storageContacts)
    } 

    for (let index in inputContacts) {

      for (let secendIndex in inputContacts) {
        if ((inputContacts[index] === inputContacts[secendIndex]) && 
        (index !== secendIndex) && 
        (inputContacts[index] !== undefined)) {
          console.log(`Повторний з індексами - ${index} i ${secendIndex}`, inputContacts[index])
          inputContacts.splice(index, 1)
        }
      }

      for (let secendIndex in storageArrayContacts) {
        if (inputContacts[index] === storageArrayContacts[secendIndex]) {
          console.log(`Введений контакт -${index}`, 
            inputContacts[index], 
            `Контакт з localStorage -${secendIndex}`, 
            storageArrayContacts[secendIndex]
          )
          inputContacts.splice(index, 1)
        }
      }
    }

    setListContacts(inputContacts)
    return inputContacts
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
        <button onClick={listContacts => compareContactsWithNames(inputContactsRef.current.value)}>With name</button>
        <button onClick={listContacts => compareContactsWithoutNames(inputContactsRef.current.value)}>Without name</button>
        <button onClick={saveContactsToLocalStorage}>Save contacts</button>
        <button onClick={cleanStorage}>Clean contacts</button>
      </div>
      <div className="b">{listContacts}</div>
    </div>)
}