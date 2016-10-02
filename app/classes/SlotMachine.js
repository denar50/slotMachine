import Slot from 'classes/Slot'
import { createAnimationRunner } from 'services/utils'
import state from 'services/state'
import API from 'services/api'

export default class SlotMachine {
	constructor(slotElements) {
		this.slots = []
		slotElements.forEach((slotElement) => {
			this.slots.push(new Slot(slotElement))
		})
	}

	playSlots() {
		const { slots } = this
		let currentImageindex = 0
		const images = state.getSlotImages()
		slots.forEach(slot => slot.play())
		const animationRunner = createAnimationRunner(() => {
			const runningSlots = state.getRunningSlots()
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
			state.removeRunningSlot.apply(this, slotsToRemove)
			if(currentImageindex >= images.length -1) {
				currentImageindex = 0
			}
			if(runningSlots.length === 0) {
				animationRunner.stopAnimation()
				console.log('STOP!')
			}
		})
		animationRunner.runAnimation()
	}

	play(isBonus) {
		return new Promise((resolve, reject) => {
			this.playSlots()
			setTimeout(() => {
				API.play(isBonus).then((response) => {
					console.log(JSON.stringify(response))
					this.stop(response).then(resolve)
				})
			}, 1000)
		})
	}

	stop({outcome, isBonus}) {
		return new Promise((resolve, reject) => {
			const { slots } = this
			slots.reduce((p, slot, index) => {
				if(p) {
					return p.then(() => slot.stop(outcome[index], 1000))
				}
				return slot.stop(outcome[index], 1000)
			}, null).then(() => {
				if(isBonus) {
					console.log('IS BONUS!')
					this.play(isBonus).then(resolve)
				} else {
					resolve()
				}
			})
		})
	}
}
