class WebSocketService {
    private ws: WebSocket | null = null;
    // private url = import.meta.env.MODE === 'development' ? 'ws://localhost:3000' : 'wss://exceleed.in';
    private url = 'wss://exceleed.in';
    private subscribers: ((message: any) => void)[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectInterval = 5000;

    connect(roomName: string) {
        if (this.ws && this.ws.readyState !== WebSocket.CLOSED) return;

        console.log(`Connecting to ${this.url} (Attempt ${this.reconnectAttempts + 1})`);
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.ws?.send(JSON.stringify({ type: 'SUBSCRIBE', roomName }));
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.subscribers.forEach((callback) => callback(data));
        };

        this.ws.onclose = (event) => {
            console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
            this.ws = null;
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = this.reconnectInterval * this.reconnectAttempts;
                console.log(`Reconnecting in ${delay / 1000} seconds...`);
                setTimeout(() => this.connect(roomName), delay);
            } else {
                console.error('Max reconnect attempts reached. Giving up.');
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    disconnect() {
        this.ws?.close();
        this.ws = null;
        this.reconnectAttempts = 0;
    }

    onMessage(callback: (message: any) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter((sub) => sub !== callback);
        };
    }
}

export const webSocketService = new WebSocketService();