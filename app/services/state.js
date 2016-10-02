import { removeFromArray } from 'services/utils'
import { calculateScore } from 'services/score'

const runningSlots = []
const slotImages = [0,1,2,3,4,5].map(imageNumber => `/assets/img/Symbol_${imageNumber}.png`)
const listeners = {
	'dataReceived': []
}
let score = 0
const WIN_UNIT_POINTS = 10

const state = {
	addRunningSlot(slot) {
		runningSlots.push(slot)
	},

	removeRunningSlot(slot) {
		removeFromArray(runningSlots, slot)
	},

	getRunningSlots() {
		return runningSlots
	},

	setScore(newScore) {
		score += newScore * WIN_UNIT_POINTS
	},

	getScore() {
		return score
	},

	getSlotImages() {
		return slotImages
	},

	subscribe(event, handler) {
		listeners[event].push(handler)
	},

	fireEvent(event, payload) {
		listeners[event].forEach((handler) => {
			handler.call(null, payload)
		})
	}
}

state.subscribe('dataReceived', ({outcome}) => {
	state.setScore(calculateScore(outcome))
})

export default state
