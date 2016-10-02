const requestHandlerFactory = require('./requestHandlerFactory')
const GETRequestsHandler = require('./GETRequestHandler')
const POSTRequestHandler = require('./POSTRequestHandler')

module.exports = function() {
	return requestHandlerFactory(GETRequestsHandler, POSTRequestHandler)
}
