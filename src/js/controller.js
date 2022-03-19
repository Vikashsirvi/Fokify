import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import pagginationView from './views/pagginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //Loading recipe
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result

    resultsView.update(model.getSearchResultPage());

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendring Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get Search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load Search Results
    await model.loadSearchResults(query);

    //3) Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 4) Render Initial Pagination buttons
    pagginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  //3) Render NEW Results
  resultsView.render(model.getSearchResultPage(gotoPage));

  // 4) Render NEW Pagination buttons
  pagginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the Recipe Servings (in state)
  model.updateServings(newServings);
  //Update the Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  pagginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
};
init();
