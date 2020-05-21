import React from 'react'
import PeopleAppsFiles from './PeopleAppsFiles'
import AllUsedOfUser from './AllUsedOfUser'
import '../css/OpinShareCSS.css'



export default function SetUser() {
  return(
    <div className="style">
      <PeopleAppsFiles/>
      <AllUsedOfUser/>
    </div>
  );
}

