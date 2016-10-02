const runningSlots = new WeakMap()
const slotImages = [0,1,2,3,4,5].map(imageNumber => `/assets/img/Symbol_${imageNumber}.png`)

export default {
	addRunningSlot(slot) {
		runningSlots.set(slot, slot)
	},

	removeRunningSlot(slot) {
		runningSlots.remove(slot)
	},

	getRunningSlots() {
		return runningSlots
	},

	getSlotImages() {
		return slotImages
	}
}
