class WebSocketService {
    private ws: WebSocket | null = null;
    private url = 'wss://exceleed.in';
    // private url = import.meta.env.MODE === 'development' ? 'ws://localhost:3000' : 'ws://exceleed.in:3000';
    private subscribers: ((message: any) => void)[] = [];

    connect(roomName: string) {
        if (this.ws) return;

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.ws?.send(JSON.stringify({ type: 'SUBSCRIBE', roomName }));
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.subscribers.forEach((callback) => callback(data));
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.ws = null;
            setTimeout(() => this.connect(roomName), 1000); // Reconnect after 1 second
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Handle ping from server and respond with pong
        // this.ws.on('ping', () => {
        //     console.log('Received ping from server');
        //     this.ws?.pong(); // Respond with pong (browser WebSocket doesn’t support this natively, see below)
        // });

        // Optional: Send periodic pings to server (if server doesn’t ping)
        const pingInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send('ping'); // Custom ping message
            }
        }, 30000);

        this.ws.onclose = () => {
            clearInterval(pingInterval);
            console.log('WebSocket disconnected');
            this.ws = null;
            setTimeout(() => this.connect(roomName), 1000);
        };
    }

    disconnect() {
        this.ws?.close();
        this.ws = null;
    }

    onMessage(callback: (message: any) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter((sub) => sub !== callback);
        };
    }
}

export const webSocketService = new WebSocketService();