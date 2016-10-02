import SlotMachine from 'classes/SlotMachine'

import state from 'services/state'

window.onload = () => {
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
	const updateScore = () => {
		headerScoreH1.innerHTML = state.getScore()
	}

	const showBonusMessage = (payload) => {
		debugger
	}

	state.subscribe('dataReceived', updateScore)
	state.subscribe('dataReceived', showBonusMessage)
}
