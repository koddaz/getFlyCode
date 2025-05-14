function loadContent(page) {
     const mainElement = document.querySelector('main');
     mainElement.innerHTML = '<p>Loading...</p>';

     fetch(page) 
     .then(response => {
           if (!response.ok) {
                throw new Error('Network response was not ok');
           }
           return response.text();
      })
     .then(data => {
          const temp = document.createElement('div');
          temp.innerHTML = data;

          const content = temp.querySelector('.content') || temp;
          mainElement.innerHTML = content.innerHTML;

          history.pushState({ page: page }, '', '#' + page.split('/').pop().replace('.html', ''));

          updateActiveLink(page);
      })
      .catch(error => {
           console.error('There was a problem with the fetch operation:', error);
           mainElement.innerHTML = '<p>Error loading content. Please try again later.</p>';
      });
}

function updateActiveLink(page) {
     document.querySelectorAll('nav ul li a').forEach(link => {
          link.classList.remove('active');
     })

     const currentLink = document.querySelector(`nav ul li a[href="${page}"]`);
     if (currentLink !== null) {
          currentLink.classList.add('active');
     }
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        loadContent(event.state.page);
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation link click handlers
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent(this.getAttribute('href'));
        });
    });
    
    // Load home content by default
    loadContent('./tabs/home/home.html');
});