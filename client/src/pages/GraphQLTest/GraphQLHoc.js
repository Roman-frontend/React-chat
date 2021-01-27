import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { usersQuery } from './queries';

export default compose(graphql(usersQuery));
