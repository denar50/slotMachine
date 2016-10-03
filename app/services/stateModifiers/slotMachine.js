import { removeFromArray } from 'services/utils'
import { getScore } from 'services/score'

export const events = {
	ADD_RUNNING_SLOT: 'ADD_RUNNING_SLOT',
	REMOVE_RUNNING_SLOT: 'REMOVE_RUNNING_SLOT',
	NEW_SCORE: 'NEW_SCORE',
	IS_BONUS_CHANGE: 'IS_BONUS_CHANGE',
	NEW_DATA_RECEIVED: 'NEW_DATA_RECEIVED'
}

const { ADD_RUNNING_SLOT, REMOVE_RUNNING_SLOT, NEW_SCORE, IS_BONUS_CHANGE, NEW_DATA_RECEIVED } = events

export const addRunningSlot = (slot, state) => {
	state.runningSlots.push(slot)
}

export const removeRunningSlot = (slot, state) => {
	removeFromArray(state.runningSlots, slot)
}

export const setCurrentScore = (outcome, state) => {
	state.currentScore = getScore(outcome)
}

export const setIsBonus = (isBonus, state) => {
	state.isBonus = isBonus
}

export const newDataReceived = ({outcome, isBonus}, state) => {
	state.fireEvent(NEW_SCORE, outcome)
	state.fireEvent(IS_BONUS_CHANGE, isBonus)
}

export const subscribeModifiers = (state) => {
	state.subscribeStateModifier(ADD_RUNNING_SLOT, addRunningSlot)
	state.subscribeStateModifier(REMOVE_RUNNING_SLOT, removeRunningSlot)
	state.subscribeStateModifier(NEW_SCORE, setCurrentScore)
	state.subscribeStateModifier(IS_BONUS_CHANGE, setIsBonus)
	state.subscribeStateModifier(NEW_DATA_RECEIVED, newDataReceived)
}
