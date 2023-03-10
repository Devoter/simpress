# simpress

This package is a simple analogue of [Express.js](https://expressjs.com/).

## Installation

```sh
npm i simpressjs
```

## Usage

Trivial example:

```ts
import { createServer } from 'http';

import { Simpress } from 'simpressjs';

const host = 'localhost';
const port = 8000;

const app = new Simpress();

app.route('/', 'GET', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ hello: 'world' }));
});

const server = createServer(app.toListener());

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
```

## License

[BSD 3-Clause License](./LICENSE)
