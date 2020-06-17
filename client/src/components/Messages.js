import React, {useState, useRef, useEffect} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'
import {useHttp} from '../hooks/http.hook'

/*  const changeMas = messages.map(i => {if (i.id === openChanger.id) { i.editText = !i.editText; return i} ; return i})
  setMessages(changeMas)*/

export default function Messages(props) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([])
  const {loading, request, error} = useHttp()
  const [showAnswer, setShowAnswer] = useState([true])
  let mes = []

  function editDate(date) {
    if (date < 10) { return `0${date}`}
    else { return date}
  }

  function keyInput(event) {
    if (event.key === "Enter") {
      if (inputRef.current.value === "") {return}

        const sli = messages.slice(0, messages.length);
        const idMasEd = messages.find(i => i.editText === true)
        const indexMasEd = messages.indexOf(idMasEd, 0)
        let editedMessages = []

        if (indexMasEd + 1) {
          editedMessages = sli.map(i => {
            if (i === idMasEd) {
              i.text = inputRef.current.value
              i.editText = false
              return i
            } else return i
          })
          mes = editedMessages
          putChangedMessage(idMasEd.id)
        } else {
          const newDate = new Date();         
          const date = 
          `${editDate(newDate.getHours())}:
          ${editDate(newDate.getMinutes())}
          ${editDate(newDate.getDate())}.
          ${editDate(newDate.getMonth())}.
          ${newDate.getFullYear()}`; 

          sli.unshift({username: 'Yulia', text: inputRef.current.value, 
          createdAt: date, id: Date.now(), more: false, editText: false, answer: false},)        
          mes = sli
          requestHandler()
          getData()
        }

        inputRef.current.value = null
    }
  }
  
  useEffect(() => {
    inputRef.current.focus()
    getData()
  }, [])

  const requestHandler = async () => {
    console.log("post")
    try {
      const data = await request('/api/contacts', "POST", {...mes[0]})
    } catch (e) {console.log(e.message, ", ------ в catch попала помилка")}
  }

  const getData = async () => {
    try {
      const data = await request('/api/contacts')
      setMessages(data)
      return data
    } catch (e) {console.log(e.message, ", ------ в catch попала помилка")}
  }

  const putChangedMessage = async (id) => {
    const contact = messages.find(c => c.id === id)
    const updated = await request(`/api/contacts/${id}`, 'PUT', {
      ...contact,
    })
    setMessages(messages)
  }

  const removeContact = async (id) => {
    const message = await request(`/api/contacts/${id}`, 'DELETE')
    const filteredMessage = messages.filter(c => c.id !== id)
    setMessages(filteredMessage)
  }

  function renderMessages(messages) {
    console.log("renderMessages ...")
    return messages.map((msg, index) => {
      return (
        <Message key={messages[index].id} 
        message={msg}
        ind={index}
        answer={answer}
        setMessages={setMessages}
        messages={messages}
        inputRef={inputRef}
        />
      )
    })
  }

  function hideButton() {
    const sli = messages.slice(0, messages.length);
    const changeMas = sli.map(i => {
      if (i.editText) {
        i.editText = !i.editText
        return i
      } else return i
    })
    setMessages(changeMas)
    inputRef.current.value = ""
  }

  //    const idMasAnswer = messages.find(i => i.answer === true)
//      <div className="button-text-edit"><p>{messages[index].text}</p></div>
// style={{heigth: messages[0].answer ? '50vh' : '71vh'}}
// style={{heigth: a ? "maxHeight 200px" : "30vh"}}
  function answer(id, index) {
    const sli = messages.slice(0, messages.length);
    const changeMas = sli.map(i => {
      if (i.id === id) {
        i.answer = !i.answer
        return i
      } else { 
        i.answer = false
        return i
      }
    })
    setMessages(changeMas)
    fieldAnswer(index)
  }

  function fieldAnswer(index) {
    let idMasAnswer = []
    if (!index + 1) {
      idMasAnswer = messages.find(i => i.answer === true)
    } else {
      idMasAnswer = messages[index];
      setShowAnswer(idMasAnswer);
      putChangedMessage(idMasAnswer[0].id)
    }  
    console.log("showAnswer", showAnswer[0])  
    return (
      <div className="field-answer" style={{display: idMasAnswer ? 'block' : 'none'}}>
        <p>idMasAnswer.text</p>
      </div>)
  }

  function hideButtonTextEdit() {
    let index = []
    const idMasEd = messages.find(i => i.editText === true)
    if (idMasEd) {
      return <button className="button-text-edit" onClick={id => hideButton(idMasEd.id)}>X</button>
    } else return
  }


  return (
    <div className="right-block" style={{gridTemplateRows: showAnswer[0] ? "11vh 71vh" : "11vh 61vh 10vh"}}>
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
      </div>
      {fieldAnswer()}
      <div className="chat-with-people">
      {renderMessages(messages)}
      </div>
      <div className="field-for-message">
        <input type="text" className="input-message" placeholder="Enter Text"
          ref={inputRef} onKeyUp={event => keyInput(event)}/>
        {hideButtonTextEdit()}
      </div>
    </div>
  )
}



