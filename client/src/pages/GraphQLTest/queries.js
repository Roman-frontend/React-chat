import { gql } from 'apollo-boost';

export const usersQuery = gql`
  query moviesQuery {
    movies {
      id
      name
      email
    }
  }
`;
export const filteredUsersQuery = gql`
  query filteredMoviesQuery($name: String) {
    filteredMovies(name: $name) {
      id
      name
      email
    }
  }
`;
