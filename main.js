import { useStyle } from "./src/components/styles"; 
import { kebabCase, addPurchase } from "./src/utils.js";
import {removeLoader, addLoader} from "./src/components/loader";
import {EventRenderer} from "./src/components/eventRenderer.js";
import { OrderRenderer } from "./src/components/orderRenderer.js"; 


const navbar = document.querySelector('.navbar');


// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getEventsPageTemplate() {
  return `
   <div id="content" >
      <hr class="shadow-xl">
      <h2 class="eventHead">Events</h2>
      <hr class="shadow-xl">
      <section class="filter-bar">

      <div class="filter-dropdown">
        <button class="dropdown-button-venue" id="venue-dropdown-button">Venues<span class="badge hidden-badge" id="venue-badge"></span></button>
        <div class="dropdown-content" id="venue-dropdown-content">
          <!-- Checkboxes will be added here dynamically -->
        </div>
      </div>

      <div class="filter-dropdown">
      <button class="dropdown-button-type" id="type-dropdown-button">Types<span class="badge hidden-badge" id="type-badge"></span></button>
      <div class="dropdown-content" id="type-dropdown-content">
        <!-- Checkboxes will be added here dynamically -->
      </div>
    </div>

        <!-- Other filter dropdowns here -->

        <button class="reset-filters-button">Clear all filters</button>
      </section>

      <hr class="shadow-xl">

      <div class="events flex items-center justify-center flex-wrap shadow-amber-500">
      </div>
    </div>
  `;
}

function getHomePageTemplate() {
  return `
   <div id="content" class="home-page">
      <img src="./src/assets/home.jpg" alt="summer" class="bg-image">
      <div class="evDescription">
        <h1>Your Journey of Exploration Begins Here!</h1>
        <p>Imagine dancing under the stars at music extravaganzas, savoring culinary delights at gourmet festivals, and engaging with thought-provoking discussions at insightful seminars. Our events promise to deliver moments that stay with you long after the spotlight fades.</p>
        <a href="/events" class="eventsButton">View Events</a>
      </div>
    </div>
  `;
}

function getOrdersPageTemplate(orders) {
  const orderCards = orders.map(order => OrderRenderer.createOrderCard(order)).join('');
  
  return `
  <div id="content" class="p-4">
  <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ${orderCards}
  </div>
</div>
  `;
}
function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

async function liveSearch(){
  const filterInput = document.querySelector('.search-navbar');
  let events = await EventRenderer.fetchTicketEvents();
  console.log(events);
  if(filterInput){
    const searchValue = filterInput.value;
    if(searchValue !== undefined){
      const filteredEvents = events.filter((event) => event.eventName.toLowerCase().includes(searchValue.toLowerCase()));
      EventRenderer.renderEvents(filteredEvents); 
    }
  }
}

function setupFilterEvents(){
  const nameFilterInput = document.querySelector('.search-navbar')
  console.log(nameFilterInput.value);
  if(nameFilterInput){
    const filterInterval = 500;
    nameFilterInput.addEventListener('keyup', (event) => {
      console.log('key up');
      setTimeout(liveSearch, filterInterval);
    });
  }
}


function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}


async function renderEventsPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getEventsPageTemplate();
  addLoader();
  await EventRenderer.fetchTicketEvents()
  .then((data) => {


    setTimeout(() => {
      removeLoader();
    }, 500);
    EventRenderer.dropdownSetup(data);
    EventRenderer.renderEvents(data);
  });
}

async function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  const searchText = document.querySelector('#search-navbar');
    searchText.classList.add('hidden');
    const searchIcon = document.querySelector('#search-icon');
    searchIcon.classList.add('hidden');
  // Fetch orders first
  try {
    const orders = await OrderRenderer.fetchOrders();
    const ordersPageTemplate = getOrdersPageTemplate(orders);
    mainContentDiv.innerHTML = ordersPageTemplate;

    // Call setupDeleteButtonEvent for each order
    orders.forEach(order => {
      OrderRenderer.setupButtonEvents(order.orderID);
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

function renderHomePage() {
  const viewEventsButtonClasses = useStyle(`viewEventsBtn`);
  const searchText = document.querySelector('#search-navbar');
    searchText.classList.add('hidden');
    const searchIcon = document.querySelector('#search-icon');
    searchIcon.classList.add('hidden');
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  const button = document.querySelector('.eventsButton');
  button.classList.add(...viewEventsButtonClasses);
}


function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/events') {
    renderEventsPage();
  } else if (url === '/orders') {
    renderOrdersPage()
  } else if (url === "/home"){
    renderHomePage();
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
setupFilterEvents();
