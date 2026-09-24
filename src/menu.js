// Seed menu. category is used to pick sensible swap suggestions.
export const MENU = [
  { id: 'dosa', name: 'Masala Dosa', price: 50, category: 'meal', station: 'tawa', prepMins: 4 },
  { id: 'maggi', name: 'Cheese Maggi', price: 45, category: 'meal', station: 'tawa', prepMins: 3 },
  { id: 'paneer-roll', name: 'Paneer Roll', price: 60, category: 'meal', station: 'tawa', prepMins: 4 },
  { id: 'sandwich', name: 'Veg Sandwich', price: 40, category: 'meal', station: 'counter', prepMins: 1 },
  { id: 'poha', name: 'Poha', price: 25, category: 'meal', station: 'counter', prepMins: 1 },
  { id: 'vada-pav', name: 'Vada Pav', price: 20, category: 'snack', station: 'fryer', prepMins: 2 },
  { id: 'samosa', name: 'Samosa', price: 15, category: 'snack', station: 'counter', prepMins: 0 },
  { id: 'fries', name: 'French Fries', price: 50, category: 'snack', station: 'fryer', prepMins: 4 },
  { id: 'chai', name: 'Cutting Chai', price: 10, category: 'drink', station: 'drinks', prepMins: 1 },
  { id: 'cold-coffee', name: 'Cold Coffee', price: 35, category: 'drink', station: 'drinks', prepMins: 2 },
  { id: 'lime-soda', name: 'Lime Soda', price: 25, category: 'drink', station: 'counter', prepMins: 0 },
]

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'meal', label: 'Meals' },
  { id: 'snack', label: 'Snacks' },
  { id: 'drink', label: 'Drinks' },
]
