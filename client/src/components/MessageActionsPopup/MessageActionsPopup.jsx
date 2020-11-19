import React, { useState, useMemo } from 'react'
import Button from '@material-ui/core/Button';
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import ForwardIcon from '@material-ui/icons/Forward';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {removeData} from '../../redux/actions/actions.js'
import { REMOVE_MESSAGE } from '../../redux/types.js'
import iconMore from '../../images/icon-more.png'
import './message-actions-popup.sass'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0),
  },
}));

export function MessageActionsPopup(props) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const token = useSelector(state => state.login.token)
  const activeChannelId = useSelector(state => state.activeChannelId)
  const { activeMessage, setActiveMessage, inputRef } = props;
  const [idMessageForPopup, setIdMessageForPopup] = useState(null)

  const topPopupRelativeTopPage = useMemo(() => {
    if ( idMessageForPopup ) {
      return getPlaceTopElement(idMessageForPopup)
    }
  }, [idMessageForPopup])

  const topIconActionRelativeTopPage = useMemo(() => {
    if ( activeMessage.id ) {
      return getPlaceTopElement(activeMessage.id)
    }
  }, [activeMessage.id])

  function getPlaceTopElement(idElement) {
    const element = document.getElementById(idElement)
    return element.getBoundingClientRect().top + 4
  }

  const handleAnswer = () => {
    setIdMessageForPopup(null)
    const valueAnsweringActiveMessage = activeMessage.reply ? undefined : activeMessage.message;
    const object = Object.assign({}, {...activeMessage}, {reply: valueAnsweringActiveMessage})
    setActiveMessage({...object});
    inputRef.current.children[1].children[0].value = "";
  }

  const handleChange = () => {
    let valueChangingActiveMessage
    setIdMessageForPopup(null)

    if (activeMessage.changing) {
      valueChangingActiveMessage = undefined;
      inputRef.current.children[1].children[0].value = '';

    } else {
      valueChangingActiveMessage = activeMessage.message;
      inputRef.current.children[1].children[0].value = activeMessage.message.text;
    }

    const object = Object.assign({}, {...activeMessage}, {changing: valueChangingActiveMessage})
    setActiveMessage({...object});
  }

  const handleDelete = async () => {
    setIdMessageForPopup(null)
    //const object = Object.assign({}, {...activeMessage}, {id: undefined})
    //setActiveMessage({...object});
    setActiveMessage({})
    await dispatch( removeData(REMOVE_MESSAGE, activeMessage.message._id, token, { activeChannelId }) );
  }

  function setViewIconActions() {
    if (topIconActionRelativeTopPage) {
      return (
        <Tippy content='Actions'>
          <img 
            className="popup popup_closed"
            style={{top: `${topIconActionRelativeTopPage}px`}} 
            src={iconMore} 
            onClick={() => setIdMessageForPopup(activeMessage.id)}
          />
        </Tippy>
      )
    }

    return null
  }

  function setViewPopup() {
    if (topPopupRelativeTopPage) {
      return (
        <div className="field-actions popup popup_opened" style={{top: `${topPopupRelativeTopPage}px`}} >
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<ReplyIcon />}
            onClick={handleAnswer} 
          >
            ANSWER
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<EditIcon />}
            onClick={handleChange} 
          >
            CHANGE
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<ForwardIcon />}
          >
            FORWARD
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={handleDelete} 
          >
            DELETE
          </Button>
        </div>
      )
    }

    return null
  }

  return <>
    {setViewIconActions()}
    {setViewPopup()}
  </>
}

const mapDispatchToProps = {
  removeData 
}

export default connect(null, mapDispatchToProps)(MessageActionsPopup)