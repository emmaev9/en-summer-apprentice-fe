import { useStyle } from "./src/components/styles"; 
import { kebabCase, addPurchase } from "./src/utils.js";
//import { kebabCase } from "./src/utils";
import {removeLoader, addLoader} from "./src/components/loader";


// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/o.jpg" alt="summer">
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate(orders) {
  const orderCards = orders.map(order => createOrderCard(order)).join('');
  
  return `
  <div id="content" class="p-4">
  <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    ${orderCards}
  </div>
</div>
  `;
}

function createOrderCard(order) {
  return `
  <div class="bg-white p-4 shadow-md rounded-md flex justify-between items-center">
  <div class="order-details">
    <h2 class="text-xl font-semibold mb-2">Order #${order.orderID}</h2>
    <p class="text-gray-600 mb-1">Event: ${order.ticketCategory.event.eventName}</p>
    <p class="text-gray-600 mb-1">Number of Tickets: ${order.numberOfTickets}</p>
    <p class="text-gray-600 mb-1">Category: ${order.ticketCategory.description}</p>
    <p class="text-gray-600">Price: $${order.totalPrice}</p>
  </div>
  <div class="order-actions">
    <button class="edit-button mr-2 text-blue-500 hover:text-blue-700">Edit</button>
    <button class="delete-button text-red-500 hover:text-red-700">Delete</button>
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

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  addLoader();

  fetchTicketEvents()
  .then((data) => {

    setTimeout(() => {
      removeLoader();
    }, 200);
    console.log('data', data);
    addEvents(data);
  });
}

const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events found';
  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach((event) => {
      eventsDiv.appendChild(createEvent(event));
    });
  }
}

const createEvent = (event) => {
 const title = kebabCase(event.eventType.eventTypeName); //event.eventType.name
  const eventElement = createEventElement(event,title);
  return eventElement;
}

const createEventElement = (event, title) => {
  const {eventID, venue, eventType, ticketCategories, eventDescription, eventName, startDate, endDate} = event;
  const eventDiv = document.createElement('div');
  const eventWrapperClasses = useStyle(`eventWrapper`);
  const actionWrapperClasses = useStyle(`actionsWrapper`);
  const quantityClasses =  useStyle(`quantity`);
  const inputClasses = useStyle(`input`);
  const quantityActionClasses = useStyle(`quantityActions`);
  const increaseButtonClasses = useStyle(`increaseBtn`);
  const decreaseButtonClasses = useStyle(`decreaseBtn`);
  const addToCartButtonClasses = useStyle(`addToCartBtn`);
  let img;

  if(event.eventName === 'Untold') {
    img = `./src/assets/untold.jpg`;
  } else if(event.eventName === 'Electric Castle') {
    img = `./src/assets/ecc.jpeg`;
  } else if(event.eventName === 'Saga') {
    img = `./src/assets/saga.jpeg`;
  } else {
    // Default image or handle other cases
    img = `./src/assets/default.jpg`;
  }

  
  eventDiv.classList.add(...eventWrapperClasses);

  const contentMarkup = `
  <header>
     <h2 class="event-title text 2xl font-bold">${eventName}</h2>
  </header>
  <div class="conten">
      <img src="${img}" alt="${eventName}" class="event-image w-full height-200 rounded">
      <p class="description text-grey-700">${eventDescription}</p>
  </div>
`;
  eventDiv.innerHTML = contentMarkup;
  const actions = document.createElement('div');
  actions.classList.add(...actionWrapperClasses);

  const categoriesOptions = [ 
    '<option value="" disabled selected>Choose ticket category</option>',
    ticketCategories.map((category) => 
     `<option value=${category.ticketCategoryID}>${category.description}</option>`
  )];
  console.log('categoriesOptions', categoriesOptions);

  const ticketTypeMarkup = ` 
  <select id="ticketType" name="ticketType" class="select ${title}-ticket-type border border-gray-300 rounded shadow-md px-2 py-4 w-10 h-10 text-center text-gray-600 transition-colors duration-200 focus:outline-none focus:border-blue-300">
    ${categoriesOptions.join('\n')}
  </select>
  `;
  actions.innerHTML = ticketTypeMarkup;

  const quantity = document.createElement('div');
  quantity.classList.add(...quantityClasses);

  const input = document.createElement('input');  
  input.classList.add(...inputClasses);
  input.type = 'number';
  input.min='0';
  input.value = '0';

  input.addEventListener('blur', () => {
    if(!input.value) {
      input.value = 0;
    }
  });

  input.addEventListener('input', () => {
    const currentQuantity = parseInt(input.value);
    if(currentQuantity < 0) {
      addToCart.disabled = true;
    }else{
      addToCart.disabled = false;
    }
  });

  quantity.appendChild(input);

  const quantityActions = document.createElement('div');
  quantityActions.classList.add(...quantityActionClasses);

  const increase = document.createElement('button');
  increase.classList.add(...increaseButtonClasses);
  increase.innerHTML = '+';
  increase.addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
    const currentQuantity = parseInt(input.value);
    if(currentQuantity < 0) {
       addToCart.disabled = true;
    }else{
       addToCart.disabled = false;

    }
  });

  const decrease = document.createElement('button');
  decrease.classList.add(...decreaseButtonClasses);
  decrease.innerHTML = '-';
  decrease.addEventListener('click', () => {
    input.value = parseInt(input.value) - 1;
    const currentQuantity = parseInt(input.value);
    if(currentQuantity < 0) {
      addToCart.disabled = true;
    }else{
      addToCart.disabled = false;
    }
  });

  quantityActions.appendChild(increase);
  quantityActions.appendChild(decrease);

  quantity.appendChild(quantityActions);
  actions.appendChild(quantity);
  eventDiv.appendChild(actions);

  const eventFooter = document.createElement('footer');
  const addToCart = document.createElement('button');
  addToCart.classList.add(...addToCartButtonClasses);
  addToCart.innerHTML = 'Add to cart';
  addToCart.disabled=true;
  addToCart.addEventListener('click', () => {
      handleAddToCart(title,eventID, input, addToCart);
  });
  eventFooter.appendChild(addToCart);
  eventDiv.appendChild(eventFooter);
  return eventDiv;
}

const handleAddToCart = (title, id, input, addToCart) => {
  const ticketType = document.querySelector(`.${kebabCase(title)}-ticket-type`).value;
  const quantity = input.value;

  console.log('eventID', id);
  console.log('ticketCategoryID', ticketType);
  console.log('numberOfTickets', quantity);


  if(parseInt(quantity)) {

    addLoader();

    fetch('http://localhost:8080/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        eventID:+id,
        ticketCategoryID:+ticketType,
        numberOfTickets:+quantity,
      })
    }).then((response) => {
      return response.json().then((data) => {
        if(!response.ok){
          console.log("Something went wrong");
        }
        return data;
      });
    }).then((data) => {
      addPurchase(data);
      console.log("Done!");
      input.value = 0;
      addToCart.disabled = true;
      toastr.success('Ticket added to cart!');
    })
    .catch((error) => {
      toastr.error('Something went wrong!');
    })
    .finally(() => {
      setTimeout(() => {
        removeLoader();
      }, 200);
    });

  }else{
    //not integer
  }
}

async function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  const orders = await fetchOrders();
  mainContentDiv.innerHTML = getOrdersPageTemplate(orders);
  


}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

async function fetchTicketEvents() {
  try {
    const response = await fetch('http://localhost:8080/api/events');
    console.log('response', response);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error('Error fetching data:', error);
    return [];
}
}

async function fetchOrders(){
  const response = await fetch('http://localhost:8080/api/orders');
  const orders = await response.json();
  console.log('orders', orders)
  return orders;
}


// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
