import Slot from 'classes/Slot'
import { animationRunnerFactory } from 'services/utils'
import state from 'services/state'
import API from 'services/api'
import { events as slotMachineEvents } from 'services/stateModifiers/slotMachine'
import { STOP_SLOT_DELAY, PLAY_AFTER_BONUS_DEBOUNCE_TIME } from 'services/constants'
const { REMOVE_RUNNING_SLOT, NEW_DATA_RECEIVED, IS_BONUS_CHANGE } = slotMachineEvents

export default class SlotMachine {
	constructor(slotElements) {
		this.slots = []
		slotElements.forEach((slotElement) => {
			this.slots.push(new Slot(slotElement))
		})
		this.changeSlotsBackground = this.changeSlotsBackground.bind(this)
	}

	changeSlotsBackground(animationRunner) {
		const { runningSlots } = state
		if(runningSlots.length === 0) {
			animationRunner.stopAnimation()
			return
		}
		const slotsToRemove = []
		runningSlots.forEach(slot => slot.changeSlotBackground())
		this.removeStoppedSlotsFromRunningSlots()
	}

	removeStoppedSlotsFromRunningSlots() {
		const { runningSlots } = state
		runningSlots.forEach(slot => slot.isStopped() && state.fireEvent(REMOVE_RUNNING_SLOT, slot))
	}

	playSlots() {
		const { slots } = this
		slots.forEach(slot => slot.play())
		const animationRunner = animationRunnerFactory.create(this.changeSlotsBackground)
		animationRunner.runAnimation()
	}

	play(isBonus) {
		return new Promise((resolve, reject) => {
			this.playSlots()
			API.play(isBonus).then((response) => {
				this.stop(response).then(resolve)
			})
		})
	}

	stopSlotsSequentially(outcome) {
		const { slots } = this
		// Run all stops in sequence
		const stopSlot = (slot, currentOutcome) => slot.stop(currentOutcome, STOP_SLOT_DELAY)
		return slots.reduce((p, slot, index) => {
			const currentOutcome = outcome[index]
			if(p) {
				return p.then(() => stopSlot(slot, currentOutcome))
			}
			return stopSlot(slot, currentOutcome)
		}, null)
	}

	stop({outcome, isBonus}) {
		return new Promise((resolve, reject) => {
			this.stopSlotsSequentially(outcome).then(() => {
				if(isBonus) {
					// Debounce playing again so the user can see the result
					setTimeout(() => {
						state.fireEvent(IS_BONUS_CHANGE, true)
						this.play(isBonus).then(resolve)
					}, PLAY_AFTER_BONUS_DEBOUNCE_TIME)
				} else {
					resolve()
				}
				state.fireEvent(NEW_DATA_RECEIVED, {outcome, isBonus})
			})
		})
	}
}
