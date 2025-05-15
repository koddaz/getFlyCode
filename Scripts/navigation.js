function loadContent(page) {
     const mainElement = document.querySelector('main');
     mainElement.innerHTML = '<p>Loading...</p>';

     if (page.startsWith('#')) {
          // If it's a hash, convert to file path
          const pageFile = hashToPage(page);
          if (pageFile) {
               page = pageFile;
          } else {
               // Invalid hash, fallback to home
               page = './tabs/home/home.html';
          }
     }
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

               const hash = '#' + page.split('/').pop().replace('.html', '');
               if (location.hash !== hash) {
                    history.replaceState(null, '', hash);
               }

               updateActiveLink(page);

               // Check if we're loading the portfolio page and call loadProjects
               if (page.includes('portfolio.html')) {
                    loadProjects();
               }
          })
          .catch(error => {
               console.error('There was a problem with the fetch operation:', error);
               mainElement.innerHTML = '<p>Error loading content. Please try again later.</p>';
          });
}

function hashToPage(hash) {
     // Remove the # character
     const page = hash.substring(1);

     // Map hash values to page paths
     const pageMap = {
          'home': './tabs/home/home.html',
          'about': './tabs/about/about.html',
          'portfolio': './tabs/portfolio/portfolio.html',
          'contact': './tabs/contact/contact.html',
          // Add more pages as needed
     };

     return pageMap[page] || null;
}

function updateActiveLink(page) {
     document.querySelectorAll('nav ul li a').forEach(link => {
          link.classList.remove('active');
     });

     // Find the correct link - either by href or by corresponding hash
     let currentLink = document.querySelector(`nav ul li a[href="${page}"]`);
     if (!currentLink) {
          const hash = '#' + page.split('/').pop().replace('.html', '');
          currentLink = document.querySelector(`nav ul li a[href="${hash}"]`);
     }

     if (currentLink !== null) {
          currentLink.classList.add('active');
     }
}
window.addEventListener('hashchange', function () {
     loadContent(location.hash || '#home');
});
// Handle browser back/forward navigation
window.addEventListener('popstate', function (event) {
     if (event.state && event.state.page) {
          loadContent(event.state.page);
     }
});

document.addEventListener('DOMContentLoaded', function () {

     const menuToggle = document.createElement('div');
     menuToggle.className = 'menuToggle';
     menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
     document.querySelector('.menuContainer').prepend(menuToggle);

     menuToggle.addEventListener('click', function () {
          document.querySelector('nav').classList.toggle('open');
          this.innerHTML = document.querySelector('nav').classList.contains('open') ?
               '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
     });

     // Close mobile menu when a link is clicked
     document.querySelectorAll('nav ul li a').forEach(link => {
          link.addEventListener('click', function () {
               document.querySelector('nav').classList.remove('open');
               menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
          });
     });
     // Update navigation links to use hash instead of file paths
     document.querySelectorAll('nav ul li a').forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.endsWith('.html')) {
               // Convert page links to hash links
               const hash = '#' + href.split('/').pop().replace('.html', '');
               link.setAttribute('href', hash);
          }

          link.addEventListener('click', function (e) {
               e.preventDefault();
               loadContent(this.getAttribute('href'));
          });
     });

     // Load content based on current hash or default to home
     loadContent(location.hash || '#home');
});

function loadProjects() {
     const projectsContainer = document.getElementById('projectsContainer');
     if (!projectsContainer) return;

     projectsContainer.innerHTML = '<p>Loading projects...</p>';

     fetch('./Scripts/projects.json')
          .then(response => {
               if (!response.ok) {
                    throw new Error('Failed to load projects');
               }
               return response.json();
          })
          .then(projects => {
               projectsContainer.innerHTML = '';

               projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'presentationContainer';

                    projectCard.innerHTML = `
                         <div class="imageContainer">
                              <img src="${project.image}" alt="${project.title}" />
                         </div>
                         <div class="projectContent">
                              <h3 class="text-subtitle">${project.title}</h3>
                              <p class="text-body-small">${project.description}</p>
                              <a href="${project.link}" class="projectLink" target="_blank">
                                   <i class="fas fa-external-link-alt"></i> View Project
                              </a>
                         </div>
                    `;

                    projectsContainer.appendChild(projectCard);
               });
          })
          .catch(error => {
               console.error('Error loading projects:', error);
               projectsContainer.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
          });
}