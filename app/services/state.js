import { subscribeModifiers } from 'services/stateModifiers/slotMachine'

const stateModifiers = {}

const listeners = {}

const state = {
	runningSlots: [],
	score: 0,

	subscribeStateModifier(event, modifier) {
		if(!stateModifiers[event]) {
			stateModifiers[event] = []
		}
		stateModifiers[event].push(modifier)
	},

	subscribe(event, handler) {
		if(!listeners[event]) {
			listeners[event] = []
		}
		listeners[event].push(handler)
	},

	fireEvent(event, payload) {
		const { [event]: currentModifiers } = stateModifiers
		const { [event]: currentListeners } = listeners
		if(currentModifiers) {
			currentModifiers.forEach((modifier) => {
				modifier.call(null, payload, this)
			})
		}

		if(currentListeners) {
			currentListeners.forEach((listener) => {
				listener(this)
			})
		}
	}
}

export default state
