import { useStyle } from "./styles"; 
import { kebabCase, addPurchase } from "../utils"
import {removeLoader, addLoader} from "./loader"
export class EventRenderer {

  static renderEvents(events) {
    const searchText = document.querySelector('#search-navbar');
    searchText.classList.remove('hidden');
    const searchIcon = document.querySelector('#search-icon');
    searchIcon.classList.remove('hidden');
    this.dropdownSetup(events);
    
    const eventsDiv = document.querySelector('.events');
    eventsDiv.innerHTML = 'No events found';
    if(events.length){
      eventsDiv.innerHTML = '';
      events.forEach((event) => {
        eventsDiv.appendChild(EventRenderer.createEvent(event));
      });
    }
  }
  static dropdownSetup(events) {
    const venuesDropdown = document.querySelector('#dropdown-content-venue');
    const typesDropdown = document.querySelector('#dropdown-content-type');
    //const venueDropdown = document.querySelector(".dropdown-button-venue");
    //const typeDropdown = document.querySelector(".dropdown-button-type");
    
  
    if (!venuesDropdown || !typesDropdown) {
      console.error("Dropdown elements not found.");
      return;
    }
  
    venuesDropdown.innerHTML = '';
    typesDropdown.innerHTML = '';
  
    if (events.length === 0) {
      venuesDropdown.innerHTML = '<option disabled>No venue found</option>';
      typesDropdown.innerHTML = '<option disabled>No ticket type found</option>';
      return;
    }
  
    const uniqueVenues = new Set();
    const uniqueEventTypes = new Set();
  
    events.forEach((event) => {
      uniqueVenues.add(event.venue.location);
      
      uniqueEventTypes.add(event.eventType.eventTypeName);
    });
    uniqueVenues.forEach((venue) => {
      const venueOption = EventRenderer.createOptionElement(venue);
      venuesDropdown.appendChild(venueOption);
    });
    console.log(uniqueVenues.length);
    //venuesDropdown.appendChild(`<span class="badge">${uniqueVenues.length}</span>`);
    //typesDropdown.appendChild(`<span class="badge">${uniqueEventTypes.length}</span>`);

  
    uniqueEventTypes.forEach((type) => {
      const typeOption = EventRenderer.createOptionElement(type);
      typesDropdown.appendChild(typeOption);
    });
  }
  
  static createOptionElement(value) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    return option;
  }
  



  static createEvent(event) {
    const title = event; //event.eventType.name
    const eventElement = EventRenderer.createEventElement(event,title);
    return eventElement;
  }

  static createEventElement(event, title){
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
      img = `./src/assets/start.jpg`;
    } else {
      // Default image or handle other cases
      img = `./src/assets/default.jpg`;
    }
  
    eventDiv.classList.add(...eventWrapperClasses);
  
    const contentMarkup = `
   
    <div class="content">
      <div class="relative">
        <img src="${img}" class="event-image w-full height-200 rounded opacity-90 shadow-xl"/>
          <div class="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-80 items-center">
              <h3 class="text-xl text-white font-bold">
              ${eventName}</h3>
                 <p class="mt-2 text-sm text-gray-300">
                    ${ ticketCategories.map((category) => 
                      `${category.description} - ${category.price}$ <br>
                    `)}
                    
                  </p> 
          </div>
      </div>
  
      <!--   <img src="${img}" alt="${eventName}" class="event-image w-full height-200 rounded">  -->
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
    //console.log('categoriesOptions', categoriesOptions);
  
    const ticketTypeMarkup = ` 
      <select id="ticketType" name="ticketType" class="select event-${event.eventID}-ticket-type bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-black light:focus:ring-blue-500 light:focus:border-blue-500 shadow-xl">
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
        EventRenderer.handleAddToCart(title,eventID, input, addToCart);
    });
    eventFooter.appendChild(addToCart);
    eventDiv.appendChild(eventFooter);
    return eventDiv;
  } 

  static handleAddToCart = (ticketCategory, id, input, addToCart) => {
    console.log('title',id );
    const ticketType = document.querySelector(`.event-${id}-ticket-type`).value;
    const quantity = input.value;

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
        }, 500);
      });
  
    }else{
      //not integer
    }
  }
  static async fetchTicketEvents() {
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

}