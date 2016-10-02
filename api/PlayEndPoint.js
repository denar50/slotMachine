const utils = require('./utils')

const getOutcome = (outcomeSize, min, max) => {
	const outcome = [];
	while(outcomeSize--) {
		outcome.push(utils.generateRandomInteger(min, max));
	}
	return outcome;
}

module.exports = (isBonusRequest) => {
	const payload = {
		outcome: getOutcome(3, 0, 5)
	}
	// Get three random numbers
	if(isBonusRequest) {
		payload.isBonus = false
	} else {
		// indicate if the response is bonus
		payload.isBonus = !!utils.generateRandomInteger(0, 1)
	}
	if(payload.isBonus) console.log('Bonus en el backend')
	return JSON.stringify(payload);
}
