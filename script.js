document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-img');
    const heroImg = document.getElementById('hero-img');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let currentIndex = 0;

    // Function to get the currently visible gallery items
    function getVisibleItems() {
        return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }

    // Function to open lightbox based on the active visible subset
    function openLightbox(index) {
        const visibleItems = getVisibleItems();
        if (visibleItems.length === 0) return;
        
        currentIndex = index;
        if (currentIndex < 0) currentIndex = visibleItems.length - 1;
        if (currentIndex >= visibleItems.length) currentIndex = 0;

        const targetImg = visibleItems[currentIndex];
        lightboxImg.src = targetImg.src;
        lightboxCaption.textContent = targetImg.alt;
        lightbox.style.display = 'flex';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
    }

    function showPrev() {
        const visibleItems = getVisibleItems();
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
    }

    function showNext() {
        const visibleItems = getVisibleItems();
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
    }

    // Filtering logic (Categories & Search combined)
    function filterGallery() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const query = searchInput.value.toLowerCase().trim();

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const altText = item.alt.toLowerCase();

            const matchesCategory = (activeFilter === 'all' || category === activeFilter);
            const matchesSearch = altText.includes(query);

            if (matchesCategory && matchesSearch) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Event Listeners for Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGallery();

            //Automatically update the Hero image to the first visible item in this category
            const visibleItems = getVisibleItems();
            if(visibleItems.length > 0){
                const firstItem = visibleItems[0];
                // Swap hero image source and alt text
                heroImg.src = firstItem.src;
                heroImg.alt = firstItem.alt;
                // updat active thumbnail highlight state
                galleryItems.forEach(img => img.classList.remove('active-thumb'));
                firstItem.classList.add('active-thumb');
            }
        });
    });

    // Event Listener for Search Input
    searchInput.addEventListener('input', filterGallery);

    // Event Listeners for Gallery Items to open lightbox
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
          galleryItems.forEach(img => img.classList.remove('active-thumb'));
            item.classList.add('active-thumb');

            heroImg.src = item.src;
            heroImg.alt = item.alt; 
        });
    });
    //Clicking the Hero image opens it in the Lightbox
    heroImg.addEventListener('click', () => {
        const visibleItems = getVisibleItems();
        //find which visible item matches the current hero image
        const matchedIndex = visibleItems.findIndex(item => item.src === heroImg.src);
        openLightbox(matchedIndex != -1? matchedIndex : 0);
    });
    // Lightbox navigation buttons
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
});