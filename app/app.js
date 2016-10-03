import SlotMachine from 'classes/SlotMachine'
import state from 'services/state'
import { events as slotMachineEvents, subscribeModifiers } from 'services/stateModifiers/slotMachine'

const { NEW_SCORE, IS_BONUS_CHANGE } = slotMachineEvents

window.onload = () => {
	subscribeModifiers(state)
	
	const slotElements = []
	document.querySelectorAll('.slot-machine__slot').forEach(element => slotElements.push(element))

	const slotMachine = new SlotMachine(slotElements)

	document.querySelector('.controls__play-btn').addEventListener('click', (event) => {
		const { target: button } = event
		slotMachine.play().then(() => {
			button.disabled = false
		})
		button.disabled = true
	})
	const headerScoreH1 = document.querySelector('.app-header__score')
	const updateScore = (state) => {
		headerScoreH1.innerHTML = state.score
	}

	const showBonusMessage = (state) => {
		debugger
	}

	state.subscribe(NEW_SCORE, updateScore)
	state.subscribe(IS_BONUS_CHANGE, showBonusMessage)
}
