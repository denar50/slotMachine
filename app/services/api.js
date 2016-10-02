const sendPost = (url, data = {}, contentType = 'application/json') => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', url, true)
		xhr.onload = () => {
			if(xhr.status === 200) {
				resolve(JSON.parse(xhr.response))
			} else {
				reject()
			}
		}
		xhr.setRequestHeader('Content-Type', contentType)
		xhr.send(data)
	})
}

export default {
	play(isBonus = false) {
		return sendPost('/play', JSON.stringify({isBonus}))
	}
}
