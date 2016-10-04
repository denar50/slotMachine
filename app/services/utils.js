export const removeFromArray = (array, element) => {
	if(!element) return
	const index = array.indexOf(element)
	if(index > -1) {
		array.splice(index, 1)
	}
}

export const getMostRepeatedNumberCountInArray = (array) => {
	let occurrences = {}
	let mostRepeatedValueCount = 0
	array.forEach((arrayValue) => {
		if(!occurrences[arrayValue]) {
			occurrences[arrayValue] = 0
		}
		const currentValueCount = ++occurrences[arrayValue]
		if(currentValueCount > mostRepeatedValueCount) {
			mostRepeatedValueCount = currentValueCount
		}
	})
	return mostRepeatedValueCount
}

export const animationRunnerFactory = {
	create (domChangeCallback) {
		let stop = false
		const animationRunner = {
			runAnimation,
			stopAnimation
		}

		function animate() {
			if(stop) return //break the spell
		  requestAnimationFrame(animate)
			domChangeCallback(animationRunner)
		}
		function runAnimation() {
			animate()
		}

		function stopAnimation() {
			stop = true
		}
		return animationRunner
	}
}
