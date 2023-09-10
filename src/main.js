"use strict";
let api = axios.create({
    baseURL:'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=utf-8'
    },
    //para agregar parametros revisar documentacion
    params: {
        'api_key':API_KEY,
    }
});
function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if (item) {
        movies = item;
    }
    else {
        movies = {};
    }
    return movies;
}
function likeMovie(movie) {
    const likedMovies = likedMoviesList();
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    }
    else {
        likedMovies[movie.id] = movie;
    }
    localStorage.setItem("liked_movies",JSON.stringify(likedMovies));
}

function callback(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src',url);   
        }
    });
}
const lazyLoader = new IntersectionObserver(callback);

//cambiar codigo repetido
async function getTrendingMoviesPreview() {
    //es importante que todas las api tengan versiones ya que si se quiere cambiar en el futuro algunos usuarios pueden estar usando la 
    //anterior version y la nueva version debe trasladarse a otro nuevo
    const {data} = await api(`trending/movie/day`); 
    const movies = data.results;
    trendingMoviesPreviewList.innerHTML="";

    movies.forEach(movie => renderMovie(movie,trendingMoviesPreviewList,true));
}
const getCategegoriesPreview = async function() {
    //es importante que todas las api tengan versiones ya que si se quiere cambiar en el futuro algunos usuarios pueden estar usando la 
    //anterior version y la nueva version debe trasladarse a otro nuevo
    const {data} = await api(`genre/movie/list`); 
    const categories = data.genres;
    renderCategories(categories,categoriesPreviewList);
}
/*es de tu url el #cualquier cosa
location.hash 
//cada vez que cambie el hash
addEventListener("hashchange",e=>console.log(e));*/
async function getMoviesByCategory(id) {
    //es importante que todas las api tengan versiones ya que si se quiere cambiar en el futuro algunos usuarios pueden estar usando la 
    //anterior version y la nueva version debe trasladarse a otro nuevo
    const {data} = await api(`discover/movie`,{
        params: {
            with_genres:id,
        },
    }); 
    const movies = data.results;
    maxPage = data.total_pages;
    genericSection.innerHTML = "";

    movies.forEach(movie => renderMovie(movie,genericSection,true));
}

async function getPaginatedMoviesByCategory(id) {
    const {scrollTop,scrollHeight,clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop+clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const {data} = await api(`discover/movie`,{
            params: {
                with_genres:id,
                page
            },
        }); 
        const movies = data.results;
        movies.forEach(movie => renderMovie(movie,genericSection,true));
    }
}

async function getMoviesBySearch(query) {
    //es importante que todas las api tengan versiones ya que si se quiere cambiar en el futuro algunos usuarios pueden estar usando la 
    //anterior version y la nueva version debe trasladarse a otro nuevo
    const {data} = await api(`search/movie`,{
        params: {
            query
        },
    }); 
    const movies = data.results;
    maxPage = data.total_pages;
    genericSection.innerHTML = "";

    movies.forEach(movie => renderMovie(movie,genericSection));
}

async function getPaginatedMoviesBySearch(query) {
    const {scrollTop,scrollHeight,clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop+clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const {data} = await api(`search/movie`,{
            params: {
                query,
                page
            },
        }); 
        const movies = data.results;
        movies.forEach(movie => renderMovie(movie,genericSection));
    }
}

//utilizando closurs
/*function getPaginatedMoviesBySearch(query) {
    return async () => {
        const {scrollTop,scrollHeight,clientHeight} = document.documentElement;
        const scrollIsBottom = (scrollTop+clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api(`search/movie`,{
                params: {
                    query,
                    page
                },
            }); 
            const movies = data.results;
            movies.forEach(movie => renderMovie(movie,genericSection));
        }
    }
}*/


function renderMovie(movie,container,lazyLoad=false) {
    const movieContainer = document.createElement("DIV");
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement("IMG");
    movieImg.classList.add('movie-img');
    movieImg.setAttribute("alt",movie.title);
    movieImg.setAttribute(
        lazyLoad ? 'data-img' : 'src',
        `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    );
    movieImg.addEventListener('click', () => {
        location.hash = '#movie='+movie.id;
    });
    movieImg.addEventListener("error",() => {
        movieImg.setAttribute('src','./img/error404.png');
    });

    const movieBtn = document.createElement("BUTTON");
    movieBtn.classList.add("movie-btn");
    //si la primero condicion se cumple se cumple lo que sigue despues del &&
    likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');

    movieBtn.addEventListener("click", () => {
        movieBtn.classList.toggle('movie-btn--liked');
        likeMovie(movie);
        getLikedMovies();
    });

    if (lazyLoad) {
        lazyLoader.observe(movieImg);
    }
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
}
function renderCategories(categories,container) {
    container.innerHTML = "";
    categories.forEach(function(category) {
        const categoryContainer=document.createElement('DIV');
        categoryContainer.classList.add('category-container');

        const categoryTitle=document.createElement('H3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute("id",'id'+category.id);
        categoryTitle.addEventListener('click',()=>{
            location.hash=`#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);
        
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}
async function getTrendingMovies() {
    const {data} = await api(`trending/movie/day`); 
    const movies = data.results;
    maxPage = data.total_pages;
    genericSection.innerHTML="";

    movies.forEach(movie => renderMovie(movie,genericSection));
    /*const btnLoadMore = document.createElement("BUTTON");
    btnLoadMore.innerHTML = "cargar mas";
    btnLoadMore.addEventListener("click",getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore)*/
}
async function getPaginatedTrendingMovies() {
    const {scrollTop,scrollHeight,clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop+clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const {data} = await api(`trending/movie/day`, {
            params : {
                page
            }
        }); 
        const movies = data.results;
        movies.forEach(movie => renderMovie(movie,genericSection));
    }

    /*const btnLoadMore = document.createElement("BUTTON");
    btnLoadMore.innerHTML = "cargar mas";
    btnLoadMore.addEventListener("click",getPaginatedTrendingMovies);
    genericSection.appendChild(btnLoadMore);*/
}
async function getMovieById(id) {
    const {data:movie} = await api(`movie/${id}`); 
    console.log(movie)
    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    console.log(movieImgUrl)
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%,
        rgba(0, 0, 0, 0) 29.17%
    ), url(${movieImgUrl}`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    renderCategories(movie.genres,movieDetailCategoriesList);
    getRelatedMoviesId(id);
}



