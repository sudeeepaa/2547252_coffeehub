
    let coffeeData = [];
    let filteredCoffeeData = [];

    document.addEventListener('DOMContentLoaded', function() {
      loadUserData();
      getLocation();
      fetchCoffeeData();
      setupEventListeners();
    });

    //localStorage
    function loadUserData() {
      const userName = localStorage.getItem('coffeeHub_userName');
      const favoriteCoffee = localStorage.getItem('coffeeHub_favoriteCoffee');
      
      if (userName && favoriteCoffee) {
        const greeting = document.getElementById('user-greeting');
        greeting.innerHTML = `Hello, ${userName}! You love ${favoriteCoffee}.`;
      }
    }

    //location
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            const locationInfo = document.getElementById('location-info');
            locationInfo.innerHTML = `Your Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          },
          function(error) {
            console.log('Location access denied or error occurred');
          }
        );
      }
    }

    // Fetch from API
    async function fetchCoffeeData() {
      try {
        const response = await fetch('https://api.sampleapis.com/coffee/hot');
        coffeeData = await response.json();
        filterAndSort(); // Initial display with first 8 items
        populateCoffeeOptions();
      } catch (error) {
        console.error('Error fetching coffee data:', error);
        document.getElementById('coffeeGrid').innerHTML = 
          '<p class="text-red-500 text-center col-span-full">Error loading coffee data. Please try again later.</p>';
      }
    }

    // Display coffee items
    function displayCoffeeItems(coffees) {
      const grid = document.getElementById('coffeeGrid');
      grid.innerHTML = '';

      coffees.forEach(coffee => {
        const card = document.createElement('div');
        card.className = 'coffee-card bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform';
        
        card.innerHTML = `
          <img src="${coffee.image}" alt="${coffee.title}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h4 class="text-xl font-semibold mb-2 text-amber-800">${coffee.title}</h4>
            <p class="text-gray-600 mb-3 line-clamp-3">${coffee.description}</p>
            <div class="mb-3">
              <h5 class="font-medium text-amber-700 mb-1">Ingredients:</h5>
              <p class="text-sm text-gray-500">${coffee.ingredients.join(', ')}</p>
            </div>
          </div>
        `;
        
        grid.appendChild(card);
      });
    }

    // display coffee options in form
    function populateCoffeeOptions() {
      const select = document.getElementById('favoriteCoffee');
      coffeeData.forEach(coffee => {
        const option = document.createElement('option');
        option.value = coffee.title;
        option.textContent = coffee.title;
        select.appendChild(option);
      });
    }

    //Filter and sort
    function filterAndSort() {
      let filtered = [...coffeeData];
      const keyword = document.getElementById('searchInput').value.toLowerCase();
      
      // Filter by search term
      if (keyword) {
        filtered = filtered.filter(coffee => coffee.title.toLowerCase().includes(keyword));
      } else {
        // If no search term, show first 8 items
        filtered = filtered.slice(0, 8);
      }

      // Sort by title
      const titleSort = document.getElementById('sortSelect').value;
      if (titleSort === 'asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (titleSort === 'desc') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
      }

      displayCoffeeItems(filtered);
    }

    // Form validation
    function validateForm() {
      let isValid = true;
      
      // Name validation
      const name = document.getElementById('name').value.trim();
      const nameError = document.getElementById('nameError');
      if (name === '') {
        nameError.textContent = 'Name is required';
        nameError.classList.remove('hidden');
        isValid = false;
      } else {
        nameError.classList.add('hidden');
      }
      
      // Email validation
      const email = document.getElementById('email').value.trim();
      const emailError = document.getElementById('emailError');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email === '') {
        emailError.textContent = 'Email is required';
        emailError.classList.remove('hidden');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.remove('hidden');
        isValid = false;
      } else {
        emailError.classList.add('hidden');
      }
      
      // Favorite coffee validation
      const favoriteCoffee = document.getElementById('favoriteCoffee').value;
      const coffeeError = document.getElementById('coffeeError');
      if (favoriteCoffee === '') {
        coffeeError.textContent = 'Please select your favorite coffee';
        coffeeError.classList.remove('hidden');
        isValid = false;
      } else {
        coffeeError.classList.add('hidden');
      }
      
      return isValid;
    }

    // Handle form submission
    function handleFormSubmit(event) {
      event.preventDefault();
      
      if (validateForm()) {
        const formData = new FormData(event.target);
        const userName = formData.get('name');
        const favoriteCoffee = formData.get('favoriteCoffee');
        
        // Store in localStorage
        localStorage.setItem('coffeeHub_userName', userName);
        localStorage.setItem('coffeeHub_favoriteCoffee', favoriteCoffee);
        
        // Update greeting
        loadUserData();
        
        // Reset form
        event.target.reset();
        
        // Show success message
        alert('Thank you for your feedback! Your preferences have been saved.');
      }
    }

    // Setup event listeners
    function setupEventListeners() {
      // Search filter
      document.getElementById('searchInput').addEventListener('input', () => {
        filterAndSort();
      });

      // Search button
      document.getElementById('searchBtn').addEventListener('click', filterAndSort);
      
      // Sorting
      document.getElementById('sortSelect').addEventListener('change', () => {
        filterAndSort();
      });
      
      document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
      
      // Mobile menu toggle
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileMenu = document.getElementById('mobileMenu');
      const menuIcon = document.getElementById('menuIcon');
      
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Toggle icon between bars and times
        if (mobileMenu.classList.contains('hidden')) {
          menuIcon.className = 'fas fa-bars text-xl';
        } else {
          menuIcon.className = 'fas fa-times text-xl';
        }
      });
      
      // Close mobile menu when clicking on a link
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          menuIcon.className = 'fas fa-bars text-xl';
        });
      });
      
      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }