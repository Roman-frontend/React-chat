import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import "./user-sets.sass";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    fontSize: "4vh",
    textAlign: "right",
    margin: 0,
  },
}));

export function DrawTitles(props) {
  const {
    name,
    divClass,
    classPlus,
    stateShowing,
    seterStateShowing,
    setModalAdd,
  } = props;
  const classes = useStyles();
  const channelsIconRef = useRef();
  const channelsTitleRef = useRef();
  const msgIconRef = useRef();
  const msgTitleRef = useRef();
  const stateIcon = stateShowing ? (
    <KeyboardArrowDownIcon fontSize="large" />
  ) : (
    <ChevronRightIcon fontSize="large" />
  );
  const iconRef = name === "Channels" ? channelsIconRef : msgIconRef;
  const titleRef = name === "Channels" ? channelsTitleRef : msgTitleRef;

  useEffect(() => {
    function addEvent(focusedElement, elementForDraw = null) {
      const eventElement = elementForDraw ? elementForDraw : focusedElement;
      focusedElement.current.addEventListener("mouseover", () => {
        eventElement.current.classList.add("left-bar__title_active");
      });

      focusedElement.current.addEventListener("mouseout", () => {
        eventElement.current.classList.remove("left-bar__title_active");
      });
    }

    addEvent(iconRef);
    addEvent(titleRef, iconRef);
  }, []);

  return (
    <div className={(classes.root, divClass)}>
      <Grid container className="left-bar__title-name">
        <Grid
          item
          xs={1}
          ref={iconRef}
          style={{ margin: "0px 12px 0px 14px" }}
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
          style={{ font: "2rem serif" }}
          className={classPlus}
          onClick={() => setModalAdd(true)}
        >
          +
        </Grid>
      </Grid>
    </div>
  );
}
