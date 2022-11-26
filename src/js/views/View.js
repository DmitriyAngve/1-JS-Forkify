import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {object} View instance
   * @autor Dmitriy
   * @todo Finish implementation
   */
  // Method render() does return HTML string
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data; // render method took data(recipe) from "recipeView.render(model.state.recipe);" and stores it in that data
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup(); // String of HTML

    // Convert Markup string to a DOM object that's living in a memory and that we can then use to compare with the actual DOM that's on the page
    // ".createRange()" method returns a new Range object.
    // ".createContextualFragment()" method, which convert a string into real DOM Node objects
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);

    // Compare newDOM and oldDOM
    // ".isEqualNode()" method for compare nodes
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Update changed TEXT
      // "NodeValue" property of the Node interface returns or sets the value of the current node. Check for same textContent
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES (replace attributes from the curEL to the newEl)
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = ''; // remove message "Start by seacrching for a this._data..."
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear(); // Clear the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
        <p>${message}</p>
    </div>
    `;
    this._clear(); // Clear the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
        <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
        <p>${message}</p>
    </div>
    `;
    this._clear(); // Clear the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
