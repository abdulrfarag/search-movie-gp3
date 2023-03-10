import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedMovies {
        movieId
        year
        image
        description
        title
        link
      }
    }
  }
`;
