class SearchView {
  _parentEl = document.querySelector('.search');

  // query (search and input field)
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // Event listener for click "Enter" button or search
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); // this handler function should be the control searchResult function
    });
  }
}

export default new SearchView();
