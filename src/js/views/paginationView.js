import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Use Publisher-subscriber pattern (creating a publisher which is a function which is the one listening for the event) / (listen for the event here in the view while at the same time being to handle that event from the conroller)
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Event delegation // we need to figure out which button was actually clicked, based on the event
      // lets create a btn element and select the closest button element to the click element
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  // Every view that renders something to the user interface needs a generate markup method
  _generateMarkup() {
    const curPage = this._data.page;
    // "this._data" (from View.js) is the entire search boject basically
    // Calculate how many pages needs (in this case "this._data" come from "state.search" object from "model.js")
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
        `;
    }
    // Other page
    if (curPage < numPages) {
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>      
        `;
    }
    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
