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
	if(isBonusRequest) {
		payload.isBonus = false
	} else {
		payload.isBonus = !!utils.generateRandomInteger(0, 1)
	}
	return JSON.stringify(payload);
}
