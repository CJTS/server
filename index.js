const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

let GridSize = {
    x: 5,
    y: 5
};

let obj = [];

wss.on('connection', function connection(ws) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`gridsize|${JSON.stringify(GridSize)}`)
        }
    });
    setInterval(sendGrid, 1000);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        let mes = message.split('|');
        if (mes[0] === 'pos') {
            let index = obj.findIndex(o => o.id === mes[1]);
            if (index == -1) {
                obj.push({
                    id: mes[1],
                    x: mes[2],
                    y: mes[3],
                });
            } else {
                obj[index].x = mes[2];
                obj[index].y = mes[3];
            }
        }
    });
});

function sendGrid() {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`grid|${JSON.stringify(obj)}`);
        }
    });
}

