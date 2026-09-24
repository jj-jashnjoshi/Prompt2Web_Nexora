export const APP_NAME = 'Canteen'

// Cooks working at each station. ETA = queued work / cooks + own prep time.
export const STATIONS = {
  tawa: { label: 'Tawa', cooks: 1 },
  fryer: { label: 'Fryer', cooks: 1 },
  counter: { label: 'Counter', cooks: 2 },
  drinks: { label: 'Drinks', cooks: 1 },
}

// Minutes left in the break when the app first loads (editable from /kitchen).
export const DEFAULT_BREAK_MINS = 10

// An item counts as "Ready now" when its ETA is at or below this.
export const READY_NOW_MINS = 2
