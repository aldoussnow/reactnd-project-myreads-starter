import React, {Component} from 'react';
import PropTypes from 'prop-types';

class BookChanger extends Component {

    static propTypes = {
        categories: PropTypes.array.isRequired,
        category: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const {categories, category, hideNone} = this.props;
        return (<div className="book-shelf-changer">
            {!hideNone ?
                <select value={category.shelf} onChange={this.handleChange}>
                    <option value="none" disabled>Move to...</option>
                    {categories.map((c, i) => {
                        return <option key={'book-shelf-changer-option-' + i} value={c.shelf}>{c.label}</option>
                    })}
                    <option value="none">None</option>
                </select> :
                <select value={category ? category.shelf : "none"} onChange={this.handleChange}>
                    <option value="none" disabled>Move to...</option>
                    {categories.map((c, i) => {
                        return <option key={'book-shelf-changer-option-' + i} value={c.shelf}>{c.label}</option>
                    })}
                </select>}
        </div>)
    }

    handleChange(event) {
        const {moveBook, book} = this.props;
        moveBook(event.target.value, book);
    }
}

export default BookChanger;