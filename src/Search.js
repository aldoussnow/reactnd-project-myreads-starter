import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import * as BooksApi from './BooksAPI';
import {debounce} from 'throttle-debounce';
import {categories} from "./categories";
import BookChanger from './BookChanger';
import PropTypes from "prop-types";

class Search extends Component {

    static INITIAL_STATE = {
        term: '',
        results: [],
        hasError: false
    };

    static propTypes = {
        books: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.reset = this.reset.bind(this);
        this.moveBook = this.moveBook.bind(this);
        this.state = {...Search.INITIAL_STATE};
        this.getBooks = debounce(500, this.getBooks);
    }

    render() {
        const {books} = this.props;
        const {term, results, hasError} = this.state;
        return (<div className="search-books">
            <div className="search-books-bar">
                <Link className='close-search' onClick={this.reset} to='/'>Close</Link>
                <div className="search-books-input-wrapper">
                    <input
                        placeholder="Search by title or author"
                        value={this.state.value}
                        onChange={this.handleChange}
                        onKeyUp={this.search}
                    />
                </div>
            </div>
            {term && results.length === 0 && !hasError && (
                <div className="no-results">Nothing found!</div>
            )}
            {term && results.length > 0 && !hasError && (
                <div className="bookshelf">
                    <h2 className="bookshelf-title">Search Results</h2>
                    <div className="search-books-results">
                        <ol className="books-grid">
                            {results.map((book, i) => {
                                const bookshelfEntry = books.filter((b) => b.title === book.title && b.author === book.author)[0];
                                const category = bookshelfEntry ? {shelf: bookshelfEntry.shelf, label: bookshelfEntry.label}  : null;
                                return (
                                    <li key={i}>
                                        <div className="book">
                                            <div className="book-top">
                                                <div className="book-cover" style={{
                                                    width: 128,
                                                    height: 188,
                                                    backgroundImage: `url(${book.imageLinks.thumbnail})`
                                                }}></div>
                                                <BookChanger
                                                    moveBook={this.moveBook}
                                                    book={book}
                                                    categories={categories}
                                                    hideNone={true}
                                                    category={category} />
                                            </div>
                                            <div className="book-title">{book.title}</div>
                                            <div className="book-authors">{book.author}</div>
                                        </div>`
                                    </li>)
                            })}
                        </ol>
                    </div>
                </div>
            )}
            {hasError && (<div className="error-message">Sorry something went wrong!</div>)}
        </div>);
    }

    search(e) {
        const term = e.target.value;
        this.setState(state => ({...state, term: term}));
        this.getBooks(term);
    }

    getBooks(value) {
        BooksApi.search(value, 10)
            .then((results) => {
                this.setState(state => ({...state, results: results ? results : [], hasError: false}));
            }, () => this.setState(state => ({...state, hasError: true})));
    }

    moveBook(value, book) {
        BooksApi.update(book, value).then(() => {
            let results = this.state.results.slice();
            const i = results.findIndex((b) => b === book);
            results.splice(i, 1);
            this.setState((state)=> ({...state, results}));
        }, (error) => console.log(error));
    }

    reset() {
        this.setState(()=>({...Search.INITIAL_STATE}));
    }
}

export default Search;