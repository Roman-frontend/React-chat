import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './filter-contacts.sass';

export const FilterContacts = (props) => {
  const inputContactsRef = useRef(null);
  const [listContacts, setListContacts] = useState(null);
  const [storageContacts, setStorageContacts] = useState('');
  const { handleClickHistory } = props;

  useEffect(() => {
    inputContactsRef.current.focus();
    /** JSON.parse() - приводить результат до обєкта */
    const storageContacts = JSON.parse(localStorage.getItem('storageContacts'));

    if (storageContacts) {
      setStorageContacts(storageContacts);
    }
  }, []);

  function filterContacts() {
    const arrayInputContacts = createArrayContacts(
      inputContactsRef.current.value
    );
    let filterList = filterInputContacts(arrayInputContacts);
    if (storageContacts) {
      filterList = compareWithStorageContacts(filterList);
    }
    console.log('filterList -', filterList);
    if (filterList) {
      const contactsWithoutEmptyElements = filterList.filter(
        (contact) => contact !== ''
      );
      const filteredList = contactsWithoutEmptyElements.join(' - ');
      console.log('readyList -', filteredList);
      setListContacts(`- ${filteredList}`);
    }
  }

  function createArrayContacts(listContacts) {
    const regExp = /[\d ]+\d/gi;
    const inputContacts = listContacts;
    const arrayContacts = inputContacts.match(regExp);

    const readyContactsArray = arrayContacts.map((contact) => {
      return contact.split(' ').join('').split('').splice(-10, 10).join('');
    });

    return readyContactsArray;
  }

  function filterInputContacts(arrayInputContacts) {
    let compareContacts = arrayInputContacts;

    for (let index in compareContacts) {
      for (let secendIndex in compareContacts) {
        if (
          compareContacts[index] === compareContacts[secendIndex] &&
          index !== secendIndex
        ) {
          console.log(
            `Повторний з індексами - ${index} i ${secendIndex}`,
            compareContacts[index]
          );
          compareContacts.splice(secendIndex, 1);
        }
      }
    }

    return compareContacts;
  }

  function compareWithStorageContacts(inputContacts) {
    let filteredContacts = inputContacts;
    const storageArrayContacts = createArrayContacts(storageContacts);

    for (const index in inputContacts) {
      for (const secendIndex in storageArrayContacts) {
        if (inputContacts[index] === storageArrayContacts[secendIndex]) {
          filteredContacts.splice(index, 1, '');
        }
      }
    }
    return filteredContacts;
  }

  function saveContactsToLocalStorage() {
    if (listContacts) {
      const combinedArrayStorageAndInputNumbers = listContacts.concat(
        storageContacts
      );
      localStorage.setItem(
        'storageContacts',
        JSON.stringify(` - ${combinedArrayStorageAndInputNumbers}`)
      );
      setStorageContacts(` - ${combinedArrayStorageAndInputNumbers}`);
      return;
    }
    alert('Список нових контактов пустой');
  }

  function cleanStorage() {
    localStorage.removeItem('storageContacts');
    setStorageContacts('');
  }

  /*Робота над класами:
  class filter {
    constructor(contacts) {
      this.contacts = contacts;
    }

    static filterContacts() {
      const arrayInputContacts = this.createArrayContacts(
        inputContactsRef.current.value
      );
      let filterList = this.filterInputContacts(arrayInputContacts);
      if (storageContacts) {
        filterList = this.compareWithStorageContacts(filterList);
      }
      console.log("filterList -", filterList);
      if (filterList) {
        const contactsWithoutEmptyElements = filterList.filter(
          (contact) => contact !== ""
        );
        const filteredList = contactsWithoutEmptyElements.join(" - ");
        console.log("readyList -", filteredList);
        setListContacts(`- ${filteredList}`);
      }
    }

    createArrayContacts(listContacts) {
      const regExp = /[\d ]+\d/gi;
      const inputContacts = listContacts;
      const arrayContacts = inputContacts.match(regExp);

      const readyContactsArray = arrayContacts.map((contact) => {
        return contact.split(" ").join("").split("").splice(-10, 10).join("");
      });

      return readyContactsArray;
    }

    filterInputContacts(arrayInputContacts) {
      let compareContacts = arrayInputContacts;

      for (let index in compareContacts) {
        for (let secendIndex in compareContacts) {
          if (
            compareContacts[index] === compareContacts[secendIndex] &&
            index !== secendIndex
          ) {
            console.log(
              `Повторний з індексами - ${index} i ${secendIndex}`,
              compareContacts[index]
            );
            compareContacts.splice(secendIndex, 1);
          }
        }
      }

      return compareContacts;
    }

    compareWithStorageContacts(inputContacts) {
      let filteredContacts = inputContacts;
      const storageArrayContacts = this.createArrayContacts(storageContacts);

      for (const index in inputContacts) {
        for (const secendIndex in storageArrayContacts) {
          if (inputContacts[index] === storageArrayContacts[secendIndex]) {
            filteredContacts.splice(index, 1, "");
          }
        }
      }
      return filteredContacts;
    }
  } */

  const location = {
    pathname: `/chat`,
    state: { fromDashboard: true },
  };

  console.log(handleClickHistory);
  console.log('storageContacts -', storageContacts);

  return (
    <div className='filter'>
      <div className='filter-header'>
        <label className='filter-header__label' htmlFor='email'>
          Filter Contacts
        </label>
        <input
          placeholder='Введите список контактів'
          type='text'
          name='email'
          className='none-border-bottom'
          ref={inputContactsRef}
        />
        <button onClick={filterContacts}>Filter contacts</button>
        <button onClick={saveContactsToLocalStorage}>Save in storage</button>
        <button onClick={cleanStorage}>Clean storage</button>
        <button className='sign-up'>
          <Link to={`/chat`} onClick={(path) => handleClickHistory(location)}>
            SignUp
          </Link>
        </button>
      </div>
      <div className='filter__list-result'>{listContacts}</div>
    </div>
  );
};
