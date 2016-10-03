import { getMostRepeatedNumberCountInArray } from 'services/utils'
import { SMALL_WIN_SLOTS_COUNT, BIG_WIN_SLOTS_COUNT } from 'services/constants'

export const getScore = (results) => {
	const  sameSlotCount = getMostRepeatedNumberCountInArray(results)
	return sameSlotCount > 1 ? sameSlotCount : 0
}


export const getScoreString = (score) => {
	let scoreString = ''
	switch(score) {
		case SMALL_WIN_SLOTS_COUNT:
			scoreString = 'small win!'
			break
		case BIG_WIN_SLOTS_COUNT:
			scoreString = 'big win!'
			break
		default:
			scoreString = 'no win'
			break
	}
	return scoreString
}
