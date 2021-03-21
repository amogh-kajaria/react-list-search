import { useEffect, useState } from 'react'
import './App.css';
import uuid from 'react-uuid'

function App() {
  const [friendName, setFriendName] = useState("");
  const [mainList, setMainList] = useState([]);
  const [searchedList, setSearchedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4)

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      setMainList([...mainList, { name: e.target.value, isFav: false, id: uuid() }])
      setFriendName('');
      setSearchedList(mainList)
    }
  }

  const handleSearchPhrase = (e) => {
    setFriendName(e.target.value);
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure? Clicking OK will delete the entry and cannot be undone!')) {
      setMainList(
        mainList.filter((ml) => ml.id !== id)
      );
      setSearchedList(mainList)
    }
  }

  const handleFavourite = (id) => {
    const sortedList = mainList.map((ml) => {
      if (ml.id === id) {
        ml.isFav = !ml.isFav;
      }
      return ml;
    }).sort((a, b) => (a.isFav === b.isFav) ? 0 : a.isFav ? -1 : 1);
    setMainList(sortedList)
    setSearchedList(sortedList)
  }

  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.id))
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value)
  }

  useEffect(() => {
    setSearchedList(mainList.filter((ml) => {
      return ml.name.toLowerCase().includes(friendName.toLowerCase())
    }
    ))
  }, [friendName, mainList]);

  const renderPaginationLinks = () => {
    let paginationTemplate = [];
    for (let i = 1; i <= Math.ceil(searchedList.length / itemsPerPage); i++) {
      paginationTemplate.push(
        <li
          key={i}
          id={i}
          onClick={handlePageChange}
          className={`pagination-item ${currentPage === i ? 'disable' : ''}`}
        >
          {i}
        </li>
      );
    }
    return paginationTemplate;
  }

  const renderPageList = () => {
    const endIndex = itemsPerPage * currentPage;
    const startIndex = endIndex - itemsPerPage;
    return searchedList.slice(startIndex, endIndex).map((sl, i) =>
      <li key={sl.id} className="list-item">
        <span>{sl.name}</span>
        <div className="actions-container">
          <button className={`favourite ${sl.isFav ? 'active' : ''}`} onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleFavourite(sl.id);
          }}>&#9733;</button>
          <button className="delete" onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDelete(sl.id);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
          </button>
        </div>
      </li>
    )
  }

  return (
    <div className="App">
      <h2>Enter Name to Search & Hit Enter to Add</h2>
      <input
        type="text"
        placeholder="Enter Name of Friend"
        value={friendName}
        onKeyDown={handleEnterPress}
        onChange={handleSearchPhrase}
      />
      <ul className="list-container">
        {renderPageList()}
      </ul>
      <ul className="pagination-container list-container">
        {renderPaginationLinks()}
      </ul>
      <div className="items-per-page-wrapper">
        <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="items-per-page-select">
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
          <option value="10">10</option>
        </select>
      </div>
    </div>
  );
}

export default App;
