import React, { useState, useEffect } from 'react';
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_MOVIE } from '../utils/mutations';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchMovies = () => {
  // state for holding returned google api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  //useEffect hook to save `savedMovieIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

  // search for movies and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }
    
    try {
      // const ApiKey= process.env.REACT_APP_RAPID_API_KEY;
      const response = await fetch(
        `https://www.omdbapi.com/?s=${searchInput}&apikey=3de5f363`
         
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { Search } = await response.json();
      console.log(Search);


      const movieData = Search.map((movie) => ({
        
        movieId: movie.imdbID,
        year: movie.Year || ['No year to display'],
        title: movie.Title,
        description: movie.Type,
        image: movie.Poster || '',
      }));
      // console.log(search[0]);

      setSearchedMovies(movieData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };


  //function to handle saving a movie to our database
  const handleSaveMovie = async (movieId) => {
    // find the movie in `searchedmovies` state by the matching id
    const movieToSave = searchedMovies.find((movie) => movie.movieId === movieId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMovie({
        variables: { movieData: { ...movieToSave } },
      });
      console.log(savedMovieIds);
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a movie"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : 'Search for a movie to begin'}
        </h2>
        <CardColumns>
          {searchedMovies.map((movie) => {
            return (
              <Card key={movie.movieId} border="dark">
                {movie.image ? (
                  <Card.Img
                    src={movie.image}
                    alt={`The cover for ${movie.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <p className="small">Year: {movie.year}</p>
                  <Card.Text>{movie.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some(
                        (savedId) => savedId === movie.movieId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveMovie(movie.movieId)}
                    >
                      {savedMovieIds?.some((savedId) => savedId === movie.movieId)
                        ? 'Movie Already Saved!'
                        : 'Save This Movie!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMovies;

