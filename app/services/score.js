export const calculateScore = (results) => {
	let lastNumber = null
	let score = 0
	results.forEach((result) => {
		if(lastNumber === null) {
			lastNumber = result
		} else {
			if(lastNumber === result) {
				score++
			}
			lastNumber = result
		}
	})
	return score
}
