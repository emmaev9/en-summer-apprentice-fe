import { useStyle } from "./styles"; 
import { kebabCase, addPurchase } from "../utils"
import {removeLoader, addLoader} from "./loader"
export class EventRenderer {

  static renderEvents(events) {
    const searchText = document.querySelector('#search-navbar');
    searchText.classList.remove('hidden');
    const searchIcon = document.querySelector('#search-icon');
    searchIcon.classList.remove('hidden');
    
    const eventsDiv = document.querySelector('.events');
    eventsDiv.innerHTML = 'No events found';
    if(events.length){
      eventsDiv.innerHTML = '';
      events.forEach((event) => {
        eventsDiv.appendChild(EventRenderer.createEvent(event));
      });
    }
  }
  static async dropdownSetup(events) {
    const uniqueVenues = new Set();
    const uniqueEventTypes = new Set();

    events.forEach((event) => {
      uniqueVenues.add(event.venue.location);
      uniqueEventTypes.add(event.eventType.eventTypeName);
    });
    
    const venueDropdownButton = document.getElementById('venue-dropdown-button');
    const venueDropdownContent = document.getElementById('venue-dropdown-content');

    const typeDropdownButton = document.getElementById('type-dropdown-button');
    const typeDropdownContent = document.getElementById('type-dropdown-content');

    const venueBadge = document.getElementById('venue-badge');
    const typeBadge = document.getElementById('type-badge');
  
    if (!venueDropdownButton || !venueDropdownContent) {
      console.error("Venue dropdown elements not found.");
      return;
    }

    if (!typeDropdownButton || !typeDropdownContent) {
      console.error("Type dropdown elements not found.");
      return;
    }
    // Clear existing checkboxes before appending new ones
    venueDropdownContent.innerHTML = '';
    typeDropdownContent.innerHTML = '';
  
    let selectedVenues = []//Array.from(venueDropdownContent.querySelectorAll('.checkbox:checked')).map(checkbox => checkbox.value);
    let selectedTypes = []//Array.from(typeDropdownContent.querySelectorAll('.checkbox:checked')).map(checkbox => checkbox.value);

    venueDropdownContent.addEventListener('click', async (event) => {
      if (event.target.classList.contains('checkbox')) {
        const checkbox = event.target;
        const venue = checkbox.value;

        if (checkbox.checked) {
          selectedVenues.push(venue);
        } else {
          const index = selectedVenues.indexOf(venue);
          if (index !== -1) {
            selectedVenues.splice(index, 1);
          }
        }
        
        venueBadge.textContent = selectedVenues.length;
        venueBadge.classList.toggle('hidden-badge', selectedVenues.length === 0);
        this.updateFiltersAndRender(selectedVenues, selectedTypes);
      }
    });
    
    typeDropdownContent.addEventListener('click', async (event) => {
      if (event.target.classList.contains('checkbox')) {
        const checkbox = event.target;
        const type = checkbox.value;

        if (checkbox.checked) {
          selectedTypes.push(type);
        } else {
          const index = selectedTypes.indexOf(type);
          if (index !== -1) {
            selectedTypes.splice(index, 1);
          }
        }
        typeBadge.textContent = selectedTypes.length;
        typeBadge.classList.toggle('hidden-badge', selectedTypes.length === 0);
        
        this.updateFiltersAndRender(selectedVenues, selectedTypes);
      }
    });
    uniqueVenues.forEach((venue) => {
      const checkbox = this.createCheckboxElement(venue);
      if (selectedVenues.includes(venue)) {
        checkbox.querySelector('.checkbox').checked = true;
      }
      venueDropdownContent.appendChild(checkbox);
    });
  
    uniqueEventTypes.forEach((type) => {
      const checkbox = this.createCheckboxElement(type);
      if (selectedTypes.includes(type)) {
        checkbox.querySelector('.checkbox').checked = true;
      }
      typeDropdownContent.appendChild(checkbox);
    });
  
    const closeDropdowns = () => {
      venueDropdownContent.classList.remove('open');
      typeDropdownContent.classList.remove('open');
      venueBadge.classList.remove('hidden-badge');
      typeBadge.classList.remove('hidden-badge');
  };

  venueDropdownButton.addEventListener('click', () => {
      venueDropdownContent.classList.toggle('open');
      typeDropdownContent.classList.remove('open');
      venueBadge.classList.toggle('hidden-badge', !venueDropdownContent.classList.contains('open'));
      typeBadge.classList.remove('hidden-badge');
  });

  typeDropdownButton.addEventListener('click', () => {
      typeDropdownContent.classList.toggle('open');
      venueDropdownContent.classList.remove('open');
      typeBadge.classList.toggle('hidden-badge', !typeDropdownContent.classList.contains('open'));
      venueBadge.classList.remove('hidden-badge');
  });

  // Attach an event listener to the document to close dropdowns when clicking outside
  document.addEventListener('click', (event) => {
      const target = event.target;
      if (!target.closest('#venue-dropdown-button') && !target.closest('#type-dropdown-button')) {
          closeDropdowns();
      }
  });

    const clearFilters = document.querySelector('.reset-filters-button');
    clearFilters.addEventListener('click', async() => {
      const newEvents = await  this.fetchTicketEvents();
      venueBadge.classList.add('hidden-badge');
      typeBadge.classList.add('hidden-badge');
      this.renderEvents(newEvents);
    });
  }
  static createCheckboxElement(value) {
    const hr = document.createElement('br');
    const checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('checkbox-label');
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value;
    checkbox.classList.add('checkbox');
  
    const labelText = document.createElement('span');
    labelText.textContent = value;
  
    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(labelText);
    checkboxLabel.appendChild(hr);
  
    return checkboxLabel;
  }
  static async updateFiltersAndRender(selectedVenues, selectedTypes) {
    let newEvents = [];
    if (selectedTypes.length === 0) {
        newEvents = await this.filterEventsByVenues(selectedVenues);
    }else if(selectedVenues.length === 0){
      newEvents = await this.filterEventsByTypes(selectedTypes);
    } else if(selectedTypes.length !== 0 && selectedVenues.length !==0) {
        newEvents = await this.filterEventsByVenuesAndTypes(selectedVenues, selectedTypes);
    }else{
      newEvents = await this.fetchTicketEvents();
    }
    this.renderEvents(newEvents);
}

  static async filterEventsByVenues(venues){
    console.log("filter events by venues: "+ venues);
 
    try {
      const response = await fetch(`http://localhost:8080/api/events/byVenues/${venues}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data for filter events by venues:', error);
      return [];
  }
 }
 static async filterEventsByTypes(types){
     console.log("filter events by types: "+ types);
  try {
    const response = await fetch(`http://localhost:8080/api/events/byTypes/${types}`);
   
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
 } catch (error) {
    console.error('Error fetching data for filter events by types:', error);
    return [];
 }
}
static async filterEventsByVenuesAndTypes(venues,types){
  try {
    console.log("In filter by venues and types");
    console.log("Selected venues: "+venues);
    console.log("Selected types: "+ types);

    const response = await fetch(`http://localhost:8080/api/events/${venues}/${types}`);
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data for filter events by venues:', error);
    return [];
  }
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
  
    if(event.eventName === 'UNTOLD') {
      img = `./src/assets/untold.jpg`;
    } else if(event.eventName === 'Electric Castle') {
      img = `./src/assets/ecc.jpeg`;
    } else if(event.eventName === 'Saga') {
      img = `./src/assets/start.jpg`;
    }else if(event.eventName === 'Tomorrowland'){
      img = `./src/assets/tom.jpg`;
    }else if(event.eventName === 'Catalin Bordea'){
      img = `./src/assets/bordea.jpg`;
    }else if(event.eventName == 'The Weeknd Concert'){
      img = `./src/assets/weeknd.jpg`;
    } else {
      // Default image or handle other cases
      img = `./src/assets/o.jpg`;
    }

  
    eventDiv.classList.add(...eventWrapperClasses);
  
    const contentMarkup = `
   
    <div class="content">
      <div class="relative">
        <img src="${img}" class="event-image w-full height-200 rounded opacity-90 shadow-xl"/>
          <div class="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-80">
              <h4 class="text-xl text-white font-bold">
              ${eventName}</h4>
                 <h6 class="mt-2 text-sm text-gray-300">
                    ${ ticketCategories.map((category) => 
                      `${category.description}-${category.price}€
                    `)}
                  </h6>  
          </div>
      </div>
  
      <!--   <img src="${img}" alt="${eventName}" class="event-image w-full height-200 rounded">  -->
      <br>
      <hr>
        <p class="description text-grey-700">${eventDescription}</p>  
      <hr>
        
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