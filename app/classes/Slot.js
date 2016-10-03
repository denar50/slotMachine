import state from 'services/state'
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
	}

	changeSlotImage(newBackground) {
		const { element } = this
		element.style.backgroundImage = newBackground
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
