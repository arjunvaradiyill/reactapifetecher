import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const APIDataFetcher = () => {
  const [dataType, setDataType] = useState('character'); // Default is 'characters'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = query
          ? `https://rickandmortyapi.com/api/${dataType}/?name=${query}&page=${page}`
          : `https://rickandmortyapi.com/api/${dataType}?page=${page}`;
        const response = await axios.get(url);
        setItems(response.data.results);
        setPageInfo(response.data.info);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType, page, query]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-light">Rick and Morty Data Fetcher</h1>

      {/* Data Type Selector */}
      <div className="mb-4">
        <label htmlFor="dataTypeSelector" className="form-label text-light fw-bold">Select Data Type:</label>
        <select
          id="dataTypeSelector"
          className="form-select form-select-lg"
          value={dataType}
          onChange={(e) => {
            setDataType(e.target.value);
            setPage(1); // Reset page on data type change
            setQuery(''); // Clear search on data type change
          }}
        >
          <option value="character">Characters</option>
          <option value="episode">Episodes</option>
          <option value="location">Locations</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <label htmlFor="searchBar" className="form-label text-light fw-bold">Search:</label>
        <input
          id="searchBar"
          type="text"
          className="form-control"
          placeholder="Enter a search term..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} />
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Data Display */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {items.map((item) => (
          <div key={item.id} className="col">
            <div className="card bg-dark text-white shadow-sm border-light rounded" style={{ height: '250px' }}>
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-light">{item.name}</h5>
                <p className="card-text text-light">ID: {item.id}</p>
                {dataType === 'character' && item.status && (
                  <p className="card-text"><span className="badge bg-success">{item.status}</span></p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-primary"
          disabled={!pageInfo.prev}
          onClick={() => setPage((prevPage) => prevPage - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          disabled={!pageInfo.next}
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default APIDataFetcher;
