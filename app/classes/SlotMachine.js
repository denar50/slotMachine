import Slot from 'classes/Slot'
import { createAnimationRunner } from 'services/utils'
import state from 'services/state'
import API from 'services/api'
import { events as slotMachineEvents } from 'services/stateModifiers/slotMachine'

const { REMOVE_RUNNING_SLOT, NEW_DATA_RECEIVED } = slotMachineEvents

export default class SlotMachine {
	constructor(slotElements) {
		this.slots = []
		slotElements.forEach((slotElement) => {
			this.slots.push(new Slot(slotElement))
		})
	}

	playSlots() {
		let currentImageindex = 0
		const { slots } = this
		slots.forEach(slot => slot.play())
		const animationRunner = createAnimationRunner(() => {
			const { slotImages: images, runningSlots } = state
			if(runningSlots.length === 0) {
				animationRunner.stopAnimation()
				return
			}
			currentImageindex++
			const slotsToRemove = []
			runningSlots.forEach((slot) => {
				let imageIndex
				if(slot.isStopped()) {
					imageIndex = slot.stoppedAt
					slotsToRemove.push(slot)
				} else {
					imageIndex = currentImageindex
				}
				slot.changeSlotImage(`url(${images[imageIndex]})`)
			})
			slotsToRemove.forEach(slotToRemove => state.fireEvent(REMOVE_RUNNING_SLOT, slotToRemove))
			if(currentImageindex >= images.length -1) {
				currentImageindex = 0
			}
		})
		animationRunner.runAnimation()
	}

	play(isBonus) {
		return new Promise((resolve, reject) => {
			this.playSlots()
			// Send the request after 1 second
			setTimeout(() => {
				API.play(isBonus).then((response) => {
					this.stop(response).then(resolve)
				})
			}, 1000)
		})
	}

	stop({outcome, isBonus}) {
		return new Promise((resolve, reject) => {
			const { slots } = this
			// Run all stops in sequence
			const lastStopPromise = slots.reduce((p, slot, index) => {
				if(p) {
					return p.then(() => slot.stop(outcome[index], 1000))
				}
				return slot.stop(outcome[index], 1000)
			}, null)
			lastStopPromise.then(() => {
				if(isBonus) {
					// Debounce playing again so the user can see the result
					setTimeout(() => {
						this.play(isBonus).then(resolve)
					}, 500)
				} else {
					resolve()
				}
				state.fireEvent(NEW_DATA_RECEIVED, {outcome, isBonus})
			})
		})
	}
}
