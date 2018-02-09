import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BookChanger from './BookChanger';

class Bookshelf extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    books: PropTypes.array,
    categories: PropTypes.array.isRequired,
    moveBook: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired
  };

  componentVisibilityChanged() {
    this.render();
  }

  render() {
    const {label, books, categories, moveBook, category} = this.props;
    return (<div className="bookshelf">
      <h2 className="bookshelf-title">{label}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((book) => {
            return (
              <li key={book.title}>
                <div className="book">
                  <div className="book-top">
                    <div className="book-cover" style={{
                      width: 128,
                      height: 188,
                      backgroundImage: `url(${book.imageLinks.thumbnail})`
                    }}></div>
                    <BookChanger
                      moveBook={moveBook}
                      book={book}
                      categories={categories}
                      category={category} />
                  </div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-authors">{book.author}</div>
                </div>`
              </li>)
          })}
        </ol>
      </div>
    </div>)
  }
}

export default Bookshelf;

