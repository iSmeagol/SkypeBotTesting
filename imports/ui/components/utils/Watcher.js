/**
 * Watcher class
 * - make a class reactive
 */
class Watcher {
    constructor() {
        this.watcher = {};
        this.mounted = {};
        this.isRendering_ = {};
        this.stack = {};
    }
    /**
     * Attach obj component to this class
     * @param {Component} obj
     * @param {String} name
     */
    setWatcher(obj, name) {
        if (!name) throw Error('Watcher name is required!');
        if (!obj) throw Error('Watcher component is required!');

        this.watcher[name] = obj;

        let func = obj.componentDidMount || (() => {});
        let func2 = obj.componentWillUnmount || (() => {});
        let func3 = obj.getSnapshotBeforeUpdate || (() => null);
        let func4 = obj.componentDidUpdate || (() => {});

        func = func.bind(obj);
        func2 = func2.bind(obj);

        obj.componentDidMount = () => {
            this.mounted[name] = true;
            func.call(obj);
        };

        obj.componentWillUnmount = () => {
            delete this.mounted[name];
            func2.call(obj);
        };

        obj.getSnapshotBeforeUpdate = (prevProps, prevState) => {
            this.isRendering_[name] = true;
            return func3.call(obj, prevProps, prevState) || null;
        };

        obj.componentDidUpdate = () => {
            delete this.isRendering_[name];
            func4.call(obj);
        };
    }

    /**
     * Initiate this class for reactivity
     * @param {String} name
     */
    initiateWatch(name) {
        if (name) return this.watcher[name];
        else console.warn('Watcher initiated but no component specified!');
    }

    /**
     * Detach current component to this class
     * @param {String} name
     */
    removeWatcher(name) {
        if (this.watcher[name]) delete this.watcher[name];
    }

    /**
     * Trigger reactivity variable
     */
    activateWatcher() {
        if (!Object.keys(this.watcher).length) return;
        for (let key in this.watcher) {
            if (this.mounted[key]) {
                if (this.isRendering_[key]) {
                    if (this.stack[key]) clearTimeout(this.stack[key]);
                    this.stack[key] = setTimeout(() => {
                        this.activateWatcher();
                    }, 100);
                } else this.watcher[key].setState({ navigateWatch: new Date() * 1 });
            }
        }
    }
}

export default Watcher;
