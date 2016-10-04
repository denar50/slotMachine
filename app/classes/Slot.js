import state from 'services/state'
import { slotImages } from 'services/constants'
import { events as slotMachineEvents } from 'services/stateModifiers/slotMachine'

const { ADD_RUNNING_SLOT } = slotMachineEvents

export default class Slot {
	constructor(element) {
		this.element = element
	}

	play() {
		this.reset()
		state.fireEvent(ADD_RUNNING_SLOT, this)
	}

	reset() {
		this.stopped = false
		this.stoppedAt = undefined
		this.resetCurrentImageIndexWhenNoResults()
	}

	resetCurrentImageIndexWhenNoResults() {
		this.currentImageIndexWhenNoResults = 0
	}

	increaseImageIndexWhenNoResults() {
		if(++this.currentImageIndexWhenNoResults >= slotImages.length) {
			this.currentImageIndexWhenNoResults = 0
		}
	}

	changeSlotBackground() {
		const { element, stopped, stoppedAt, currentImageIndexWhenNoResults } = this
		this.increaseImageIndexWhenNoResults()
		const backgroundImageIndex = stopped ? stoppedAt : currentImageIndexWhenNoResults
		element.style.backgroundImage = `url(${slotImages[backgroundImageIndex]})`
	}

	isStopped() {
		return this.stopped
	}

	stop(outcome, delay = 0) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.stoppedAt = outcome
				this.stopped = true
				resolve()
			}, delay)
		})
	}
}
