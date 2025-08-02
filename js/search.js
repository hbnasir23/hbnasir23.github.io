document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    function performSearch(query) {
        if (query.trim() === '') {
            alert('Please enter a search term');
            return;
        }
        
        // In a real implementation, this would search your content
        // For now, we'll just show an alert
        alert(`Searching for: ${query}`);
        
        // Clear the search input
        searchInput.value = '';
    }
});