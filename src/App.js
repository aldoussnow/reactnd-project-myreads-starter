import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import Bookshelf from './Bookshelf';
import Search from './Search';
import * as BooksApi from "./BooksAPI";
import './App.css';
import {categories} from "./categories";
import {withRouter} from 'react-router';

class BooksApp extends Component {

    constructor() {
        super();
        this.moveBook = this.moveBook.bind(this);
        this.getBooks = this.getBooks.bind(this);
    }

    state = {
        hasError: false,
        books: []
    };

    render() {
        const {books, hasError} = this.state;
        return (
            <div className="app">

                <Route path='/' exact render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        {hasError && (<div className="error-message">Sorry something went wrong!</div>)}
                        {!hasError && (<div className="list-books-content">
                            <div>
                                {categories.map((category) => {
                                        return (<Bookshelf
                                            key={category.label}
                                            books={books.filter((book) => book.shelf === category.shelf)}
                                            label={category.label}
                                            moveBook={this.moveBook}
                                            categories={categories}
                                            category={category}
                                        />)
                                    }
                                )}
                            </div>
                        </div>)}
                        <div className="open-search">
                            <Link className='add-a-book' to='/search'>Add a book</Link>
                        </div>
                    </div>
                )}/>
                <Route path='/search' render={()=> {
                    return (<Search books={books} />);
                }}/>
            </div>
        )
    }

    componentWillMount() {
        this.unlisten = this.props.history.listen(({pathname}) => {
            pathname === '/' && this.getBooks();
        });
    }

    componentDidMount() {
        this.getBooks();
    }

    componentWillUnmount() {
        this.unlisten();
    }

    componentDidCatch(error, info) {
        console.error(error);
        console.table(info);
    }

    getBooks() {
        BooksApi.getAll().then(
            (books) => this.setState(state => ({...state, books, hasError: false})),
            (error) => this.setState(state => ({...state, hasError: true}))
        );
    }

    moveBook(value, book) {
        let books = this.state.books.slice();
        const i = books.findIndex((b) => b === book);
        if (i === -1) return;
        if (categories.map((c) => c.shelf).indexOf(value) > -1) {
            books[i].shelf = value;
        } else if (value === 'none') {
           books.splice(i, 1);
        }
        BooksApi.update(book, value).then(() => {
            this.setState(state=>({...state, books}));
        }, (error) => console.log(error));
    }
}

export default withRouter(BooksApp)
