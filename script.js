document.addEventListener('DOMContentLoaded', () => {
    // === ELEMEN DOM ===
    const moviesGrid = document.getElementById('moviesGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    // Navigasi Desktop & Mobile
    const genreDropdown = document.getElementById('genreDropdown');
    const yearDropdown = document.getElementById('yearDropdown');
    const sidenavContent = document.getElementById('sidenav-content');
    const mySidenav = document.getElementById('mySidenav');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeSidenavBtn = document.getElementById('closeSidenavBtn');
    // Pencarian Desktop & Mobile
    const desktopSearchInput = document.getElementById('desktopSearchInput');
    const desktopSearchBtn = document.getElementById('desktopSearchBtn');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearchBtn = document.getElementById('closeSearchBtn');

    // ... (STATE APLIKASI & FUNGSI-FUNGSI UTAMA LAINNYA TETAP SAMA) ...
    let currentPage = 1, moviesPerPage = 12, currentFilters = { genre: 'all', year: 'all', search: '' }, currentlyDisplayedMovies = [];
    const createMovieCardElement = (movie) => { const movieCard = document.createElement('div'); movieCard.classList.add('movie-card'); movieCard.innerHTML = `<div class="card-thumbnail"><img src="${movie.thumbnail}" alt="${movie.title}"><span class="quality-badge">${movie.quality}</span><span class="rating-badge">⭐ ${movie.rating}</span></div><div class="card-info"><div class="title-container"><h3>${movie.title} (${movie.year})</h3></div><a href="#" class="watch-button">Tonton</a></div>`; movieCard.addEventListener('click', (e) => { e.preventDefault(); sessionStorage.setItem('selectedMovie', JSON.stringify(movie)); window.location.href = 'playback.html'; }); return movieCard; };
    const renderMovieCards = (movies) => { moviesGrid.innerHTML = ''; movies.forEach(movie => { moviesGrid.appendChild(createMovieCardElement(movie)); }); };
    const applyFiltersAndRender = () => { let f = allMovies; if(currentFilters.genre!=='all'){f=f.filter(m=>m.genres.includes(currentFilters.genre))} if(currentFilters.year!=='all'){f=f.filter(m=>m.year.toString()===currentFilters.year)} if(currentFilters.search!==''){f=f.filter(m=>m.title.toLowerCase().includes(currentFilters.search.toLowerCase()))} currentlyDisplayedMovies=f; currentPage=1; renderMovieCards(currentlyDisplayedMovies.slice(0,moviesPerPage)); if(currentlyDisplayedMovies.length>moviesPerPage){loadMoreBtn.style.display='block'}else{loadMoreBtn.style.display='none'} };
    const loadMoreMovies = () => { currentPage++; const s=(currentPage-1)*moviesPerPage; const e=currentPage*moviesPerPage; currentlyDisplayedMovies.slice(s,e).forEach(m=>{moviesGrid.appendChild(createMovieCardElement(m))}); if(moviesGrid.children.length>=currentlyDisplayedMovies.length){loadMoreBtn.style.display='none'} };
    const populateNavigations = () => { if(typeof allMovies==='undefined')return; const g=[...new Set(allMovies.flatMap(m=>m.genres))].sort(); const y=[...new Set(allMovies.map(m=>m.year))].sort((a,b)=>b-a); genreDropdown.innerHTML=`<a href="#" class="filter-link" data-type="genre" data-value="all">Semua Genre</a>`; g.forEach(i=>{genreDropdown.innerHTML+=`<a href="#" class="filter-link" data-type="genre" data-value="${i}">${i}</a>`}); yearDropdown.innerHTML=`<a href="#" class="filter-link" data-type="year" data-value="all">Semua Tahun</a>`; y.forEach(i=>{yearDropdown.innerHTML+=`<a href="#" class="filter-link" data-type="year" data-value="${i}">${i}</a>`}); let sHTML='<h3>Genre</h3><a href="#" class="filter-link" data-type="genre" data-value="all">Semua Genre</a>'; g.forEach(i=>{sHTML+=`<a href="#" class="filter-link" data-type="genre" data-value="${i}">${i}</a>`}); sHTML+='<h3>Tahun</h3><a href="#" class="filter-link" data-type="year" data-value="all">Semua Tahun</a>'; y.forEach(i=>{sHTML+=`<a href="#" class="filter-link" data-type="year" data-value="${i}">${i}</a>`}); sidenavContent.innerHTML=sHTML; };

    // FUNGSI BARU: Satu fungsi untuk menjalankan pencarian
    const performSearch = (searchTerm) => {
        currentFilters.search = searchTerm.trim();
        applyFiltersAndRender();
    };

    // === EVENT LISTENERS (DIPERBARUI) ===
    
    // Sidenav & Search Overlay
    mobileMenuToggle.addEventListener('click', () => mySidenav.style.width = '250px');
    closeSidenavBtn.addEventListener('click', () => mySidenav.style.width = '0');
    searchToggleBtn.addEventListener('click', () => searchOverlay.classList.add('active'));
    closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));

    // Pencarian Desktop
    desktopSearchBtn.addEventListener('click', () => performSearch(desktopSearchInput.value));
    desktopSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch(desktopSearchInput.value);
    });

    // Pencarian Mobile
    mobileSearchBtn.addEventListener('click', () => {
        performSearch(mobileSearchInput.value);
        searchOverlay.classList.remove('active');
    });
    mobileSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(mobileSearchInput.value);
            searchOverlay.classList.remove('active');
        }
    });

    // Listener untuk link filter (Genre & Tahun)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-link')) {
            e.preventDefault();
            mySidenav.style.width = '0';
            currentFilters[e.target.dataset.type] = e.target.dataset.value;
            applyFiltersAndRender();
        }
    });
    
    // Listener untuk tombol "Load More"
    loadMoreBtn.addEventListener('click', loadMoreMovies);


    // === INISIALISASI HALAMAN ===
    if (typeof allMovies !== 'undefined') {
        populateNavigations();
        applyFiltersAndRender();
    } else {
        console.error("Data film (allMovies) tidak ditemukan.");
    }
});