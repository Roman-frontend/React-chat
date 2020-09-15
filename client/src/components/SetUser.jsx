import React from 'react'
import PeopleAppsFiles from './PeopleAppsFiles.jsx'
import AllUsedOfUser from './AllUsedOfUser.jsx'
import {Link} from 'react-router-dom'


export default function SetUser() {
  return(
    <div>
      <PeopleAppsFiles/>
      <AllUsedOfUser/>
    </div>
  );
}

