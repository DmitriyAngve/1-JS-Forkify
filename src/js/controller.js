import * as model from './model.js'; // "*" - all
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // for polyfiling everything else
import 'regenerator-runtime/runtime'; // for polyfiling async await
// import { search } from 'core-js/fn/symbol';

// From Parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // change the hash id with slice 2 first element

    // guard clause (if no id)
    if (!id) return;
    recipeView.renderSpinner(); // Render spinner

    // 1) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 3) Loading recipe
    await model.loadRecipe(id);
    // async function and it is going to return a promise (here we have to avoid that promise before we can move on in the next step)

    // 4) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the inital pagination buttons
    paginationView.render(model.state.search); // model.state.search - the entire object
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results

  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add / remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // render bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL (after reloading the page)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    window.history.back(); // back to the last page

    // Close form window (use public toggle method)
    setTimeout(function () {
      // location.reload();
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
  location.reload();
};

// And function and data flow. As we start to programm then the init() runs and it will then immediately run addHandlerRender. AddHandlerRender listening for events in the "recipeView.js". As we call addHandlerRender we pass in the controller function (controlRecipes) / handler function that we want to get executed as soon as the event happens. Then receive that function as being called handler and so that's what we then call as soon as the event happens

const init = function () {
  bookmarksView.addHandlerRender(controlAddBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination); // call addHandlerClick who called addEventListener on pagination element
};
addRecipeView.addHandlerUpload(controlAddRecipe);
init();
