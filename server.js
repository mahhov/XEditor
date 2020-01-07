const fs = require('fs');
const http = require('http');

const PORT = 8083;

let main = async () => {
	// Because intellij doesn't clean up nicely
	await new Promise(resolve => http.get(`http://localhost:${PORT}/exit`).on('response', resolve).on('error', resolve));

	http.createServer(async (req, res) => {
		console.log(req.url);
		switch (req.url) {
			case '/exit':
				process.exit();
				break;
			case '/':
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(await fs.promises.readFile('./src/index.html'));
				break;
			case '/sw.js':
				res.writeHead(200, {'Content-Type': 'application/javascript'});
				res.end(await fs.promises.readFile('./sw.js'));
				break;
			default:
				fs.promises.readFile('.' + req.url)
					.then(read => res.end(read))
					.catch(() => {
						res.writeHead(404);
						res.end();
					});
		}
	}).listen(PORT);
	console.log('Listening', PORT)
};

main();
