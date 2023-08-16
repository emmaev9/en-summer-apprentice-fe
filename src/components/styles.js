const bookOfStyle = {

  purchase:[

    'bg-white',

    'px-4',

    'py-3',

    'gap-x-4',

    'sm:border-b',

    'sm:border-gray-200',

    'flex',
  ],

  purchaseTitle: ['text-lg', 'font-medium', 'text-gray-900','flex-1'],

  purchaseQuantity: [

    'w-[50px]',

    'text-center',

    'py-1',

    'px-2',

    'border',

    'border-orange-700',

    'border-2',

    'disabled:border-0',

    'rounded',

    'text-orange-700',

    'text-sm',

    'leading-tight',

    'font-bold',

    'disabled:text-gray-700',

    'focus:outline-none',

    'focus::shadow-outline',
  ],

  purchaseQuantityWrapper : ['flex', 'flex-row','flex-1'],

  purchaseType :[

      'w-fit',

      'py-1',

      'px-2',

      'border',

      'border-orange-700',

      'border-2',

      'py-px',

      'disabled:border-transparent',

      'disabled:text-gray-900',

      'disabled:border-2',

      'disabled:pl-3',

      'rounded',

      'leading-tight',

      'focus:outline-none',

      'focus:shadow-outline',

      'text-sm',

      'font-bold',

      'text-orange-700',

      'flex-1',
  ],

  purchaseTypeWrapper: ['flex', 'flex-row','justify-end','flex-1'],

  purchaseDate : ['text-center','flex-1','hidden','md:flex'],

  purchasePrice : ['text-center','flex-1','hidden', 'md:flex'],

  actions: ['sm:mt-0', 'sm:text-right', 'w-28'],

  actionButton : [

    'ml-2',

    'text-xl',

    'ps-2',

    'font-medium',

    'underline',

    'text-gray-700'
  ],

  deleteButton : ['hover:text-red-500'],

  cancelButton : ['hover:text-red-500'],

  saveButton : ['hover:text-green-500'],

  editButton : ['hover:text-blue-500'],

  hiddenButton : ['hidden'],

  eventWrapper : [

      'event',

      'big-white',

      'rounded',

      'shadow-md',

      'p-4',

      'flex',

      'flex-col',

      'm-6',
  ],

  actionsWrapper : ['actions','flex','items-center','mt-4'],
  buttonsWrapper : ['flex','items-center','mt-4','ml-20'],

  quantity : ['actions','flex','items-center','mt-4'],

  input : [
      'input',
      'w-10',
      'text-center',
      'border',
      'border-gray-300',
      'rounded',
      'py-1',
      'px-1',
  ],

  increaseBtn : [
      'increase',
      'px-3',
      'py-1',
      'rounded',
      'add-btn',
      'text-black',
      //'hover:bg-red-300',
      'bg-white',
      'focus:outline-none',
      'focus:shadow-outline',
      'shadow-red-300',
      'shadow-lg',

  ],

  quantityActions : ['quantity-actions', 'flex','space-x-2','ml-6'],

  decreaseBtn : [
      'decrease',
      'px-3',
      'py-1',
      'rounded',
      //'bg-black',
      'text-black',
  
      //'hover:bg-black-300',
      'bg-white',
      'focus:outline-none',
      'focus:shadow-outline',
      'shadow-red-300',
      'shadow-lg',
  ],

  addToCartBtn : [
      'add-to-cart-btn',
      'px-3',
      'py-2',
      'rounded',
      'text-white',
      'font-bold',
      'disabled:cursor-not-allowed',
      'focus:outline-none',
      'focus:shadow-outline',
      'shadow-red-300',
      'shadow-lg',
      'animate-pulse',
  ],
  viewEventsBtn : [
    'view-events-btn',
    'px-3',
    'py-2',
    'rounded',
    'text-white',
    'font-bold',
    'disabled:cursor-not-allowed',
    'focus:outline-none',
    'focus:shadow-outline',
    'shadow-red-300',
    'shadow-lg',
    'animate-pulse',
   ],
  
  basicButton: [
    'text-white',
    'font-bold',
    'bg-black',
    'hover:bg-gradient-to-br',
    'focus:ring-4',
    'focus:outline-none',
    'focus:ring-teal-300', 
    'dark:focus:ring-teal-800',
    'shadow-lg',
    'shadow-teal-500/50',
    'dark:shadow-lg',
    'dark:shadow-teal-800/80',
    'font-medium',
    'rounded-lg',
    'text-sm',
    'px-5',
    'py-2',
    'text-center', 
    'mr-2',
    'mb-2',
  ],
};
  export function useStyle(type){
      if(typeof type ==='string') return bookOfStyle[type];
      else {
          const allStyles = type.map((t)=>bookOfStyle[t]);
          return allStyles.flat();
      }
  }