import SlotMachine from 'classes/SlotMachine'
import state from 'services/state'
import { events as slotMachineEvents, subscribeModifiers } from 'services/stateModifiers/slotMachine'
import { getScoreString } from 'services/score'

const { NEW_SCORE, IS_BONUS_CHANGE } = slotMachineEvents

window.onload = () => {
	subscribeModifiers(state)

	// Get all the slot elements from the DOM
	// for each, create a slot and finally create an instance of the SlotMachine
	const slotElements = []
	const slotDomElements = document.querySelectorAll('.slot-machine__slot')
	for(let i = 0, length = slotDomElements.length; i < length; i++) {
		slotElements.push(slotDomElements[i])
	}
	const slotMachine = new SlotMachine(slotElements)

	// Add onclick event to the play button
	document.querySelector('.controls__play-btn').addEventListener('click', (event) => {
		updateStatusMessage('')
		const { target: button } = event
		slotMachine.play().then(() => {
			button.disabled = false
		})
		button.disabled = true
	})

	// Change the score message
	const headerScoreH1 = document.querySelector('.app-header__score')
	const updateScore = ({currentScore}) => {
		updateStatusMessage(getScoreString(currentScore))
	}

	const updateStatusMessage = (message) => {
		headerScoreH1.innerHTML = message
	}

	const showBonusMessage = ({isBonus}) => {
		isBonus && updateStatusMessage('BONUS!')
	}

	state.subscribe(NEW_SCORE, updateScore)
	state.subscribe(IS_BONUS_CHANGE, showBonusMessage)
}
