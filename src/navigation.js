"use strict";
let page,maxPage,infiniteScroll;
const infoIdioms={
US:{country:"United States",language:"English",language_iso:"en-US",country_icon:"🇺🇸"},
DE:{country:"Deutschland",language:"Deutsch",language_iso:"de-DE",country_icon:"🇩🇪"},
BR:{country:"Brasil",language:"Português",language_iso:"pt-BR",country_icon:"🇧🇷"},
FR:{country:"France",language:"Français",language_iso:"fr-FR",country_icon:"🇫🇷"},
MX:{country:"Mexico",language:"Español",language_iso:"es-MX",country_icon:"🇲🇽"}
};

//buscar es una pila
const searchInput = new Stack();
searchFormBtn.addEventListener("click", ()=>{
    location.hash="#search="+searchFormInput.value;
    searchInput.push(searchFormInput.value);
});
trendingBtn.addEventListener("click", ()=>{
    location.hash="#trends";
});
//aqui es para ir atras
arrowBtn.addEventListener('click',()=>{
    if (location.hash.startsWith('#search=')) {
        searchInput.pop();
        if (searchInput.top != null) {
            let {value} = searchInput.peek();
            location.hash="#search="+value;
        }
        else {
            location.hash="#home";
        }
    }
    else {
        location.hash="#home";
    }
});

addEventListener("DOMContentLoaded",navigator,false);
//cuando cambia de # en la url
addEventListener("hashchange",navigator,false);
languageSelect.addEventListener("click",e => {
    const collectButton = document.createElement("DIV");
    collectButton.innerHTML = btnLanguage.innerHTML;
    collectButton.setAttribute("data-language",btnLanguage.getAttribute('data-language'));
    collectButton.classList.add("item-languaje");
    languageSelect.appendChild(collectButton);

    const lan = e.target.getAttribute('data-language');
    const {country,language,language_iso,country_icon} = infoIdioms[lan];
    btnLanguage.innerHTML = `${language} ${country} ${country_icon}`;
    api = axios.create({
        baseURL:'https://api.themoviedb.org/3/',
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        params: {
            'api_key':API_KEY,
            'language': language_iso
        }
    });
    languageSelect.removeChild(e.target);
    navigator();
});

function navigator() {
    if (infiniteScroll) {
        removeEventListener("scroll",infiniteScroll);
        infiniteScroll = undefined;
    }
    if (location.hash.startsWith("#trends")) {
        page = 1;
        trendsPage();
        const {functions} = infiniteScroll; 
        infiniteScroll = function() {
            functions();
        }
    }
    else if(location.hash.startsWith('#search=')) {
        page = 1;
        searchPage();
        const {functions,parameters} = infiniteScroll; 
        infiniteScroll = function() {
            functions(...parameters);
        }
    }
    else if(location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    }
    else if(location.hash.startsWith('#category=')) {
        page = 1;
        categoriesPage();
        const {functions,parameters} = infiniteScroll; 
        infiniteScroll = function() {
            functions(...parameters);
        }
    }
    else {
        homePage();
    }
    scroll(0,0);
    if (infiniteScroll) {
        addEventListener("scroll",infiniteScroll,{passive:false});
    }
}
function homePage() {
    console.log("home!!");
    headerSection.classList.remove('header-container--long');
    headerSection.style.background="";
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove('inactive');
    containerLanguage.classList.remove('inactive');

    trendingPreviewSection.classList.remove("inactive");
    categoriesPreviewSection.classList.remove("inactive");
    likedMoviesSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add("inactive");

    getTrendingMoviesPreview();
    getCategegoriesPreview();
    getLikedMovies();
}
function categoriesPage() {
    console.log("categories");
    
    headerSection.classList.remove('header-container--long');
    headerSection.style.background="";
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add('inactive');
    containerLanguage.classList.add('inactive');

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add("inactive");
    //se asignan a variables en base a las pocisiones del arreglo
    const [_,categoryData] = location.hash.split('=');
    const [categoryId,categoryName] = categoryData.split('-');
    headerCategoryTitle.innerHTML = categoryName;
    getMoviesByCategory(categoryId);
    infiniteScroll = {functions:getPaginatedMoviesByCategory,parameters:[categoryId]};
}
function movieDetailsPage() {
    console.log("movie!!");

    headerSection.classList.add('header-container--long');
    //headerSection.style.background="";
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.add('inactive');
    containerLanguage.classList.add('inactive');

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove("inactive");

    const [_,movieId] = location.hash.split('=');
    getMovieById(movieId);
}
function searchPage() {
    console.log("search!!");

    headerSection.classList.remove('header-container--long');
    headerSection.style.background="";
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add("inactive");
    searchForm.classList.remove('inactive');
    containerLanguage.classList.add('inactive');

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add("inactive");

    const [_,query] = location.hash.split("=");
    getMoviesBySearch(query);
    infiniteScroll = {functions:getPaginatedMoviesBySearch,parameters:[query]};
}
function trendsPage() {
    console.log("Trends");

    headerSection.classList.remove('header-container--long');
    headerSection.style.background="";
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove("inactive");
    searchForm.classList.add('inactive');
    containerLanguage.classList.add('inactive');

    trendingPreviewSection.classList.add("inactive");
    categoriesPreviewSection.classList.add("inactive");
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add("inactive");

    headerCategoryTitle.innerHTML = "Tendencias";
    getTrendingMovies();
    infiniteScroll = {functions:getPaginatedTrendingMovies,parameters:null};
}
/**paginacion : tiene distintas paginas ademas una ventaja  es que se especifica mas facilmente donde esta el contenido pero no es tan adictivo
 * scroll infinito : cada vez que se  escrolea llega mas contenido lo malo es que es muy dificil encontrar contenido especifico si se usara footer no usarlo
 * ambas usan las SPA single page aplication
*/

/**
 * Reto : 
 * cada vez que se haga like a una pelicula tiene que ser actualizada en la misma pagina sin recargar    *pista :es un evento del localstorage  
 */
