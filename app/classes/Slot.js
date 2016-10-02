import state from 'services/state'
export default class Slot {
	constructor(element) {
		this.element = element
	}

	play() {
		console.log('Playing slot')
		this.reset()
		state.addRunningSlot(this)
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
				console.log('Stopping slot')
				resolve()
			}, delay)
		})
	}
}
