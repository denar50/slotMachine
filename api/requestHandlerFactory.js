module.exports = (GetRequestHanlders, POSTRequestHandler) => {
	return (req, res) => {
		switch(req.method) {
			case 'POST':
				POSTRequestHandler(req, res)
				break;
			default:
				GetRequestHanlders(req, res)
				break;
		}
	}
}
