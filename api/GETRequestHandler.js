const fs = require('fs')
const sendFile = (response, fileName, contentType = 'text/html', enconding = 'utf8') => {
	response.setHeader('status', 200)
	response.setHeader('Content-Type', contentType)
	const file = fs.readFileSync(`${__dirname}/../${fileName}`)
	response.write(file, enconding)
}
module.exports = (request, response) => {
	const { url } = request
	switch(url) {
		case '/dist/bundle.js':
			sendFile(response, url, 'application/javascript')
			break;
		case '/assets/img/button.png':
		case '/assets/img/Symbol_0.png':
		case '/assets/img/Symbol_1.png':
		case '/assets/img/Symbol_2.png':
		case '/assets/img/Symbol_3.png':
		case '/assets/img/Symbol_4.png':
		case '/assets/img/Symbol_5.png':
			sendFile(response, url, 'image/png', 'binary')
			break
		case '/app/style.css':
			sendFile(response, url, 'text/css')
			break
		case '/node_modules/normalize.css/normalize.css':
			sendFile(response, url, 'text/css')
			break
		default:
			sendFile(response, '/app/index.html')
			break
	}
	response.end()
}
