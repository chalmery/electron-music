const eventManager = {
    subscribers: {},

    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
    },

    publish(event, data) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(callback => {
                callback(data);
            });
        }
    },

    unsubscribe(event, callback) {
        if (this.subscribers[event]) {
            this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
        }
    }
};

export default eventManager;