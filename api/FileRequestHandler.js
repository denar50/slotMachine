const fs = require('fs')

const sendFile = (response, fileName, contentType = 'text/html', enconding = 'utf8') => {
	response.setHeader('status', 200)
	response.setHeader('Content-Type', contentType)
	const file = fs.readFileSync(`${__dirname}/../${fileName}`)
	response.write(file, enconding)
}

module.exports = (request, response) => {
	const { url } = request
	switch(true) {
		case /dist\/.*\.js/.test(url):
			sendFile(response, url, 'application/javascript')
			break;
		case /assets\/img\/.*\.png/.test(url):
			sendFile(response, url, 'image/png', 'binary')
			break
		case /.*\.css/.test(url):
			sendFile(response, url, 'text/css')
			break
		default:
			sendFile(response, '/app/index.html')
			break
	}
	response.end()
}
