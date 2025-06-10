document.addEventListener('DOMContentLoaded', () => {
    // === ELEMEN DOM ===
    const moviesGrid = document.getElementById('moviesGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const genreDropdown = document.getElementById('genreDropdown');
    const yearDropdown = document.getElementById('yearDropdown');
    const sidenavContent = document.getElementById('sidenav-content');
    const mySidenav = document.getElementById('mySidenav');
    const closeSidenavBtn = document.getElementById('closeSidenavBtn');
    const desktopSearchInput = document.getElementById('desktopSearchInput');
    const desktopSearchBtn = document.getElementById('desktopSearchBtn');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    // === STATE APLIKASI ===
    let currentPage = 1;
    const moviesPerPage = 12;
    let currentFilters = { genre: 'all', year: 'all', search: '' };
    let currentlyDisplayedMovies = [];

    // === FUNGSI-FUNGSI ===

    const createMovieCardElement = (movie) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <div class="card-thumbnail">
                <img src="${movie.thumbnail}" alt="${movie.title}">
                <span class="quality-badge">${movie.quality}</span>
                <span class="rating-badge">⭐ ${movie.rating}</span>
            </div>
            <div class="card-info">
                <div class="title-container">
                    <h3>${movie.title} (${movie.year})</h3>
                </div>
                <a href="playback.html?id=${movie.id}" class="watch-button">Tonton</a>
            </div>
        `;
        return movieCard;
    };

    const renderMovieCards = (movies) => {
        moviesGrid.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = createMovieCardElement(movie);
            movieCard.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `playback.html?id=${movie.id}`;
            });
            moviesGrid.appendChild(movieCard);
        });
    };
    
    const applyFiltersAndRender = () => {
        let filteredMovies = allMovies;
        if (currentFilters.genre !== 'all') {
            filteredMovies = filteredMovies.filter(movie => movie.genres.includes(currentFilters.genre));
        }
        if (currentFilters.year !== 'all') {
            filteredMovies = filteredMovies.filter(movie => movie.year.toString() === currentFilters.year);
        }
        if (currentFilters.search !== '') {
            filteredMovies = filteredMovies.filter(movie => 
                movie.title.toLowerCase().includes(currentFilters.search.toLowerCase())
            );
        }
        currentlyDisplayedMovies = filteredMovies;
        currentPage = 1;
        const moviesToShow = currentlyDisplayedMovies.slice(0, currentPage * moviesPerPage);
        renderMovieCards(moviesToShow);
        if (currentlyDisplayedMovies.length > moviesPerPage) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    };

    const loadMoreMovies = () => {
        currentPage++;
        const startIndex = (currentPage - 1) * moviesPerPage;
        const endIndex = currentPage * moviesPerPage;
        const newMoviesToShow = currentlyDisplayedMovies.slice(startIndex, endIndex);
        newMoviesToShow.forEach(movie => {
            moviesGrid.appendChild(createMovieCardElement(movie));
        });
        if (moviesGrid.children.length >= currentlyDisplayedMovies.length) {
            loadMoreBtn.style.display = 'none';
        }
    };

    // === FUNGSI YANG DIPERBARUI ===
    const populateNavigations = () => {
        if (typeof allMovies === 'undefined') return;

        // Daftar genre tetap
        const fixedGenres = [
            'Action', 'Action & Adventure', 'Adventure', 'Animation', 'Anime', 'Box Office',
            'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy',
            'Horror', 'Mystery', 'Romance', 'Science Fiction', 'Thriller'
        ];
        
        // **PERUBAHAN DI SINI:** Daftar tahun tetap dari 2025 hingga 2010
        const fixedYears = [];
        for (let year = 2025; year >= 2010; year--) {
            fixedYears.push(year);
        }

        // Mengisi dropdown Genre (Desktop)
        genreDropdown.innerHTML = `<a href="#" class="filter-link" data-type="genre" data-value="all">Semua Genre</a>`;
        fixedGenres.forEach(genre => {
            genreDropdown.innerHTML += `<a href="#" class="filter-link" data-type="genre" data-value="${genre}">${genre}</a>`;
        });

        // Mengisi dropdown Tahun (Desktop) dengan daftar tahun yang tetap
        yearDropdown.innerHTML = `<a href="#" class="filter-link" data-type="year" data-value="all">Semua Tahun</a>`;
        fixedYears.forEach(year => {
            yearDropdown.innerHTML += `<a href="#" class="filter-link" data-type="year" data-value="${year}">${year}</a>`;
        });

        // Mengisi Sidenav (Mobile) dengan daftar yang tetap
        let sidenavHTML = '<h3>Genre</h3><a href="#" class="filter-link" data-type="genre" data-value="all">Semua Genre</a>';
        fixedGenres.forEach(genre => {
            sidenavHTML += `<a href="#" class="filter-link" data-type="genre" data-value="${genre}">${genre}</a>`;
        });
        sidenavHTML += '<h3>Tahun</h3><a href="#" class="filter-link" data-type="year" data-value="all">Semua Tahun</a>';
        fixedYears.forEach(year => {
            sidenavHTML += `<a href="#" class="filter-link" data-type="year" data-value="${year}">${year}</a>`;
        });
        sidenavContent.innerHTML = sidenavHTML;
    };

    const performSearch = (searchTerm) => {
        currentFilters.search = searchTerm.trim();
        applyFiltersAndRender();
    };

    // === EVENT LISTENERS ===
    if(mobileMenuToggle && navbar) mobileMenuToggle.addEventListener('click', () => mySidenav.style.width = '250px');
    if(closeSidenavBtn) closeSidenavBtn.addEventListener('click', () => mySidenav.style.width = '0');
    if(searchToggleBtn) searchToggleBtn.addEventListener('click', () => searchOverlay.classList.add('active'));
    if(closeSearchBtn) closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));
    if(desktopSearchBtn) desktopSearchBtn.addEventListener('click', () => performSearch(desktopSearchInput.value));
    if(desktopSearchInput) desktopSearchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') performSearch(desktopSearchInput.value); });
    if(mobileSearchBtn) mobileSearchBtn.addEventListener('click', () => { performSearch(mobileSearchInput.value); searchOverlay.classList.remove('active'); });
    if(mobileSearchInput) mobileSearchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') { performSearch(mobileSearchInput.value); searchOverlay.classList.remove('active'); } });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-link')) {
            e.preventDefault();
            if(mySidenav) mySidenav.style.width = '0';
            currentFilters[e.target.dataset.type] = e.target.dataset.value;
            applyFiltersAndRender();
        }
    });
    
    if(loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreMovies);
    
    const handleScroll = () => {
        if (!scrollTopBtn) return;
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    };
    const backToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    window.onscroll = () => handleScroll();
    if(scrollTopBtn) scrollTopBtn.addEventListener('click', backToTop);

    // === INISIALISASI HALAMAN ===
    try {
        if (typeof allMovies !== 'undefined') {
            populateNavigations();
            applyFiltersAndRender();
        } else {
            console.error("Data film (allMovies) tidak ditemukan. Pastikan file data.js sudah dimuat sebelum script.js.");
        }
    } catch (error) {
        console.error("Terjadi error saat inisialisasi halaman:", error);
    }
});