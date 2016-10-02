import { removeFromArray } from 'services/utils'

const runningSlots = []
const slotImages = [0,1,2,3,4,5].map(imageNumber => `/assets/img/Symbol_${imageNumber}.png`)

export default {
	addRunningSlot(slot) {
		runningSlots.push(slot)
	},

	removeRunningSlot(slot) {
		removeFromArray(runningSlots, slot)
	},

	getRunningSlots() {
		return runningSlots
	},

	getSlotImages() {
		return slotImages
	}
}
