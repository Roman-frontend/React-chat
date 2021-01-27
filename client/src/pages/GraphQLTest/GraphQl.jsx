import React, { useState, useRef, useEffect } from 'react';
import withHocs from './GraphQLHoc';

const GraphQL = (props) => {
  async function fetchQraphQL() {
    /*     const headers = {};
    headers['Content-Type'] = 'application/json';
    const body = JSON.stringify({
      query: '{ viewer { todos { totalCount } } }',
    });
    const response = await fetch('/graphql', { body, headers }); */
  }

  console.log(props.data);
  return (
    <>
      <button onClick={fetchQraphQL}>Send</button>
    </>
  );
};

export default withHocs(GraphQL);
