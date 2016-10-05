const FileRequestHandler = require('./FileRequestHandler')

module.exports = (request, response) => {
	const { url } = request
	switch(url) {
		default:
			FileRequestHandler(request, response)
			break
	}
}
