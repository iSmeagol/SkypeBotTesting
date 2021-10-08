import Watcher from './Watcher';
import { ContextCollection } from '../../../api/skype';

class SkypeSender extends Watcher {
    constructor() {
        super();
        this.message = '';
        this.contacts = [];
        this.selectedUser = '';
    }

    setMessage(value) {
        this.message = value;
        this.activateWatcher();
    }

    setSelectedUser(value) {
        this.selectedUser = value;
        this.activateWatcher();
    }

    getMessage() {
        return this.message;
    }

    getSelectedUser() {
        return this.selectedUser;
    }

    initContacts() {
        this.contacts = ContextCollection.find({}).fetch();
        this.activateWatcher();
    }

    getContacts() {
        return this.contacts;
    }
}

export default new SkypeSender();
