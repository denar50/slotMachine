const playEndPoint = require('./PlayEndPoint')
const queryString = require('querystring')


const extractRequestData = (request) => {
	return new Promise((resolve, reject) => {
		const body = []
		request.on('data', (requestData) => {
			body.push(requestData)
		})
		.on('end', () => {
			resolve(Buffer.concat(body))
		})
	})
}

module.exports = (request, response) => {
	const { url } = request
	switch(url) {
		case '/play':
			response.setHeader('status', 200);
			response.setHeader('Content-Type', 'application/json')
			extractRequestData(request).then((bodyBuffer) => {
				const { isBonus } = JSON.parse(bodyBuffer.toString())
				response.write(playEndPoint(isBonus))
				response.end()
			})
			break;
		default:
			response.setHeader('status', 404)
			response.end()
			break
	}

}
