import {removeLoader, addLoader} from "./loader";
import { useStyle } from "./styles"; 
import { kebabCase, addPurchase } from "../utils"
export class OrderRenderer{

  constructor(){
    this.setupDeleteButtonEvent();
  }
  
  static createOrderCard(order) {
    return `
      <div class="bg-white ml-4 mr-4 mt-4 p-4 shadow-lg rounded-md flex justify-between items-center order-${order.orderID}">
        <div class="order-details">
          <h2 class="text-xl font-semibold mb-2">Order #${order.orderID}</h2>
          <p class="text-gray-600 mb-1">Event: ${order.ticketCategory.event.eventName}</p>
          <p class="text-gray-600 mb-1">Number of Tickets: ${order.numberOfTickets}</p>
          <p class="text-gray-600 mb-1">Category: ${order.ticketCategory.description}</p>
          <p class="text-gray-600">Price: $${order.totalPrice}</p>
        </div>
        <div class="order-actions">
          <button class="btn order-${order.orderID}-deleteButton"> Delete </button>
          <button class="btn order-${order.orderID}-editButton"> Update </button>
        </div>
        </div>
      </div>
    `;
  }

  static async openEditModal(orderID) {
    const order =  await this.findOrderById(orderID);
    console.log(order);
    //const modal = document.querySelector('.edit-modal');

    const actionWrapperClasses = useStyle(`actionsWrapper`);
    const quantityClasses =  useStyle(`quantity`);
    const inputClasses = useStyle(`input`);
    const quantityActionClasses = useStyle(`quantityActions`);
    const increaseButtonClasses = useStyle(`increaseBtn`);
    const decreaseButtonClasses = useStyle(`decreaseBtn`);
    const basicButtonClasses = useStyle(`basicButton`);
    const eventWrapperClasses = useStyle(`eventWrapper`);
    const buttonsWrapperClasses = useStyle(`buttonsWrapper`);
   
    const contentDiv = document.querySelector('.modal-content');
    contentDiv.classList.add(...eventWrapperClasses);
    const contentMarkup = `
    <header>
      <br>
       <div class="orderID"> Order #${order.orderID} </div>
    </header>
    <div class="content">
        <div class="px-5" text-bold >Event: ${order.ticketCategory.event.eventName} </div>
        <p class="px-5"> Select ticket category: </p>
    </div>
    `;
    contentDiv.innerHTML = contentMarkup;

    const actions = document.createElement('div');
    actions.classList.add(...actionWrapperClasses);
    
    let ticketCategories = order.ticketCategory.event.ticketCategories;
    ticketCategories = ticketCategories.filter(tc => tc.description!=order.ticketCategory.description);
    
    const categoriesOptions = [ 
      '<option value="" disabled>Choose ticket category</option>',
      `<option value=${order.ticketCategory.ticketCategoryID}>${order.ticketCategory.description}</option>`,
      
      ticketCategories.map((category) => 
       `<option value=${category.ticketCategoryID}>${category.description}</option>`
    )];
    console.log('categoriesOptions', categoriesOptions);
  
    const ticketTypeMarkup = ` 
      <select id="ticketType" name="ticketType" class="event-${orderID}-ticket-type bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-black light:focus:ring-blue-500 light:focus:border-blue-500 shadow-xl">
        ${categoriesOptions.join('\n')}
      </select>
      `;
    
    actions.innerHTML = ticketTypeMarkup;
  
    const quantity = document.createElement('div');
    quantity.classList.add(...quantityClasses);

    const quantityActions = document.createElement('div');
    quantityActions.classList.add(...quantityActionClasses);

    const decrease = document.createElement('button');
    decrease.classList.add(...decreaseButtonClasses);
    decrease.innerHTML = '-';
    decrease.addEventListener('click', () => {
      input.value = parseInt(input.value) - 1;
      const currentQuantity = parseInt(input.value);
      if(currentQuantity < 0) {
        saveChangesButton.disabled = true;
      }else{
        saveChangesButton.disabled = false;
      }
    });
  
    quantityActions.appendChild(decrease);
  
    quantity.appendChild(quantityActions);
    actions.appendChild(quantity);
    

    const input = document.createElement('input');  
    input.classList.add(...inputClasses);
    input.type = 'number';
    input.min='0';
    input.value = order.numberOfTickets;
  
    input.addEventListener('blur', () => {
      if(!input.value) {
        input.value = 0;
      }
    });
  
    input.addEventListener('input', () => {
      const currentQuantity = parseInt(input.value);
      if(currentQuantity < 0) {
        saveChangesButton.disabled = true;
      }else{
        saveChangesButton.disabled = false;
      }
    });
  
    quantity.appendChild(input);
  
  
  
    const increase = document.createElement('button');
    increase.classList.add(...increaseButtonClasses);
    increase.innerHTML = '+';
    increase.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
      const currentQuantity = parseInt(input.value);
      if(currentQuantity < 0) {
         saveChangesButton.disabled = true;
      }else{
         saveChangesButton.disabled = false;
      }
    });
    quantityActions.appendChild(increase); 
    quantity.appendChild(increase);
    contentDiv.appendChild(actions);
    //modal.appendChild(contentDiv);
  
  
  
    const editFooter = document.createElement('footer');

    editFooter.classList.add(...buttonsWrapperClasses);
    const saveChangesButton = document.createElement('button');
    const cancelButton = document.createElement('button');
    
    saveChangesButton.innerHTML = 'Update';
    cancelButton.innerHTML = 'Cancel';

    saveChangesButton.classList.add(...basicButtonClasses);
    cancelButton.classList.add(...basicButtonClasses);

    saveChangesButton.addEventListener('click', () => {
        this.handleSaveChangesButton(orderID, input);
    });
    cancelButton.addEventListener('click', () => {
      document.querySelector('.edit-modal').style.display = 'none';
    });
    editFooter.appendChild(saveChangesButton);
    editFooter.appendChild(cancelButton);

    contentDiv.appendChild(editFooter);
    //return eventDiv;
  } 


  static setupButtonEvents(orderID) {
    
    const deleteButton = document.querySelector(`.order-${orderID}-deleteButton`);
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        this.handleDeleteButton(orderID);
      });
    }

    const editButton = document.querySelector(`.order-${orderID}-editButton`);
    if(editButton){
      editButton.addEventListener('click', () =>{
        console.log("edit clicked");
        document.querySelector('.edit-modal').style.display = 'flex';
        this.handleEditButton(orderID);
      });
    }
  }

  static handleEditButton(orderID){
    const editButton = document.querySelector(`.order-${orderID}-editButton`);
    if(editButton){
      console.log("in edit handler");
      this.openEditModal(orderID);
    }else{
      console.log(`Order with id ${orderID} was not found`);
    }
  }

  static handleSaveChangesButton(orderID, input){
    //const order =  await this.findOrderById(orderID);
    const ticketType = document.querySelector(`.event-${orderID}-ticket-type`).value;
    const quantity = input.value;
    console.log(ticketType, quantity);

    if(parseInt(quantity)) {
      addLoader();
      fetch('http://localhost:8080/api/editOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          orderID:+orderID,
          ticketCategoryID:+ticketType,
          numberOfTickets:+quantity,
        })
      }).then((response) => {
        return response.json().then((data) => {
          if(response != "Success"){
            console.log("Something went wrong");
          }
          console.log(response);
          return data;
        });
      }).then((data) => {
        addPurchase(data);

        console.log("Done!");
        input.value = 0;
        document.querySelector('.edit-modal').style.display = 'none';
        toastr.success('Order updated!');
      })
      .catch((error) => {
        toastr.error(`Something went wrong! ${error}`);
      })
      .finally(() => {
        setTimeout(() => {
          removeLoader();
        }, 500);
      });
  
    }else{
      toastr.error(`Please introduce a number!`);
    }
  }


  static handleDeleteButton(orderID) {
    addLoader();
    fetch(`http://localhost:8080/api/deleteOrder/${orderID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      if (!response.ok) {
        console.log("Something went wrong");
      }
      return response;
    }).then((data) => {
      console.log('data', data);
      if (data) {
        const order = document.querySelector(`.order-${orderID}`);
        if (order) {
          order.remove();
          console.log(`Order with ID ${orderID} deleted`);
          toastr.success('Order deleted!');
        } else {
          console.log(`Order with ID ${orderID} not found`);
          toastr.warning('Order with ID ${orderID} not found');
        }
      }
    }).catch((error) => {
      console.log('error', error);
      toastr.error('Something went wrong!');
    }).finally(() => {
      setTimeout(() => {
        removeLoader();
      }, 500);
    });
  }
  static async findOrderById(orderID) {
    const orders = await this.fetchOrders();
    return orders.find(order => order.orderID === orderID);
  }

  static async fetchOrders(){
    const response = await fetch('http://localhost:8080/api/orders');
    const orders = await response.json();
    console.log('orders', orders)
    return orders;
  }
}