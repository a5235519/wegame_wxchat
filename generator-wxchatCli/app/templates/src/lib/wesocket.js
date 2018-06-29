class WeSocket {
    constructor(params) {
        this.private = {
            link: null,
            isCC: false,
            monitor: {
                open: () => {},
                close: () => {},
                message: () => {},
                error: () => {},
            },
        };
        this.handler = {};
        this.params = params;
        this.options = Object.assign({
            times: 10, // 重连次数
            interval: 3000, // 重连间隔
        }, params.options);
        this.times = 0; // 累计重连次数
        this.open();
    }
    on(event, callback) {
        this.private.monitor[event] = callback;
    }
    register(name, callback) {
        this.handler[name] = callback;
    }
    open() {
        this.private.link = wx.connectSocket(this.params);
        this.private.link.onOpen(this.private.monitor.open);
        this.private.link.onClose(() => {
            this.private.link = null;
            this.private.monitor.close();
            if (!this.private.isCC && this.times < this.options.times) {
                setTimeout(() => {
                    this.times += 1;
                    this.open();
                }, this.options.interval);
            }
        });
        this.private.link.onMessage((data) => {
            this.private.monitor.message(data);
        });
        this.private.link.onError((err) => {
            this.private.monitor.error(err);
        });
    }
    send(data) {
        if (this.private.link) this.private.link.send({ data });
    }
    close() {
        this.private.isCC = true;
        if (this.private.link) this.private.link.close();
    }
    refresh() {
        if (this.private.link) this.private.link.close();
    }
}

export default WeSocket;
