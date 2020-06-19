import React from 'react'
import EditMessage from './EditMessage'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function HideButtonTextEdit(props) {
  const {messages, setMessages, inputRef} = props

/*  else if (inputRef.current === undefined) {
      console.log("once undefined")
      return true
    } else {
      console.log("inputRef not undefined")
      return inputRef.current.value = undefined
    }*/
/*      index = messages.map(i => {i.editText === false && inputRef.carrent.value !== undefined ? 
        inputRef.carrent.value = undefined : true})*/

/*        else if (messages[1]) {
      messages.map(i => {
        if (i.editText === false && inputRef.carrent !== undefined) {
          inputRef.carrent.value = undefined
          console.log(inputRef.carrent.value)
        }
      })
    }*/

/*        if (messages[0] && idMasAnswer) {
      inputRef.current.value = null
      return true
    } else */

  //    const idMasAnswer = messages.find(i => i.answer === true)
//      <div className="button-text-edit"><p>{messages[index].text}</p></div>
// style={{heigth: messages[0].answer ? '50vh' : '71vh'}}
// style={{heigth: a ? "maxHeight 200px" : "30vh"}}

  function hideButtonTextEdit() {
    let index = []
    const idMasEd = messages.find((i) => i.editText === true)
    const idMasAnswer = messages.find((i) => i.answer === true)
    
    if (idMasEd) {
      return <button className="button-text-edit" onClick={props.hideButton}>X</button>
    } else return true
  }

  return hideButtonTextEdit()
}
