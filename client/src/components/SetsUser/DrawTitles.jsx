import React, { useEffect, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import './user-sets.sass';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    fontSize: '4vh',
    textAlign: 'right',
    margin: 0,
  },
  buttonRoot: {
    padding: 0,
    width: '22px',
    minWidth: 0,
  },
});

export const DrawTitles = memo(
  withStyles(styles)((props) => {
    const { t } = useTranslation();
    const {
      name,
      divClass,
      classPlus,
      stateShowing,
      seterStateShowing,
      setModalAdd,
      classes,
    } = props;
    const channelsIconRef = useRef();
    const channelsTitleRef = useRef();
    const msgIconRef = useRef();
    const msgTitleRef = useRef();
    const stateIcon = stateShowing ? (
      <KeyboardArrowDownIcon fontSize='large' />
    ) : (
      <ChevronRightIcon fontSize='large' />
    );
    const translationChannel = t('description.channelTitle');
    const iconRef = name === translationChannel ? channelsIconRef : msgIconRef;
    const titleRef =
      name === translationChannel ? channelsTitleRef : msgTitleRef;

    useEffect(() => {
      function addEvent(focusedElement, elementForDraw = null) {
        const eventElement = elementForDraw ? elementForDraw : focusedElement;
        focusedElement.current.addEventListener('mouseover', () => {
          eventElement.current.classList.add('left-bar__title_active');
        });

        focusedElement.current.addEventListener('mouseout', () => {
          eventElement.current.classList.remove('left-bar__title_active');
        });
      }

      addEvent(iconRef);
      addEvent(titleRef, iconRef);
    }, []);

    return (
      <div className={(classes.root, divClass)}>
        <Grid container className='left-bar__title-name'>
          <Grid
            item
            xs={1}
            ref={iconRef}
            style={{ margin: '0px 12px 0px 14px' }}
            onClick={() => seterStateShowing(!stateShowing)}
          >
            {stateIcon}
          </Grid>
          <Grid
            item
            xs={8}
            ref={titleRef}
            onClick={() => seterStateShowing(!stateShowing)}
          >
            {name}
          </Grid>
          <Grid
            item
            xs={1}
            style={{ font: '2rem serif' }}
            className={classPlus}
            onClick={() => setModalAdd(true)}
          >
            <Button
              variant='outlined'
              color='primary'
              size='small'
              style={{ background: 'white' }}
              classes={{ root: classes.buttonRoot }}
            >
              +
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  })
);
