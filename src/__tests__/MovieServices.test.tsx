import axios from 'axios';
import {
  getAllMovies,
  getMoviesById,
  searchMoviesByTitle,
  deleteMovie
} from '../services/MovieServices'; 

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Movie API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('getAllMovies fetches movies correctly', async () => {
    const mockMovies = [{ id: 1, title: 'Movie A' }];
    mockedAxios.get.mockResolvedValue({ data: mockMovies });

    const result = await getAllMovies();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/movies'),
      expect.objectContaining({ headers: expect.any(Object) })
    );
    expect(result).toEqual(mockMovies);
  });

  test('getMoviesById returns a single movie by ID', async () => {
    const movie = { id: 1, title: 'Inception' };
    mockedAxios.get.mockResolvedValue({ data: movie });

    const result = await getMoviesById(1);

    expect(result).toEqual(movie);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/movies/1'),
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  test('searchMoviesByTitle returns filtered movies by title', async () => {
    const mockData = {
      movies: [{ id: 2, title: 'Avatar' }],
      pagination: { total_count: 1, current_page: 1, total_pages: 1, per_page: 10 }
    };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await searchMoviesByTitle('Avatar');

    expect(result.movies[0].title).toBe('Avatar');
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  test('deleteMovie returns true when movie is deleted successfully', async () => {
    localStorage.setItem('token', 'mocked-token');
    mockedAxios.delete.mockResolvedValue({});

    const result = await deleteMovie(10);

    expect(result).toBe(true);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/movies/10'),
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer mocked-token',
          Accept: 'application/json'
        }
      })
    );
  });

  test('deleteMovie returns false if deletion fails', async () => {
    localStorage.setItem('token', 'mocked-token');
    mockedAxios.delete.mockRejectedValue({
      message: 'Error',
      response: { data: { error: 'Delete failed' } }
    });

    const result = await deleteMovie(99);

    expect(result).toBe(false);
  });
});
