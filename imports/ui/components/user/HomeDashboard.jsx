import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

//Watcher
import SkypeSender from '../utils/SkypeSender';

class HomeDashboard extends Component {
    constructor(props) {
        super(props);
        this.Auth = props.Client.Auth;
        this.Skype = props.Client.Skype;
        SkypeSender.setWatcher(this, 'skypeSender');
        SkypeSender.initContacts();
    }
    logout = () => {
        this.Auth.accountLogout((err) => {
            if (err) {
                Bert.alert(err, 'danger', 'growl-top-right');
            } else {
                Bert.alert('Logout success', 'success', 'growl-top-right');
            }
        });
    };

    send = (e) => {
        e.preventDefault();
        console.log('halu', this.message.value);
        this.Skype.sendMessage(this.message.value, SkypeSender.getSelectedUser().context, (err, data) => {
            console.log(data);
        });
    };

    render() {
        console.log(SkypeSender.getSelectedUser(), 'selected');
        return (
            <>
                <h1>Skype</h1>

                <a href="https://join.skype.com/bot/0e5195a8-eaa4-4ef0-a453-a33802619c6d">
                    <img src="https://dev.botframework.com/Client/Images/Add-To-Skype-Buttons.png" />
                </a>
                <h1>Contacts</h1>
                {SkypeSender.getContacts().map((contact) => (
                    <button onClick={() => SkypeSender.setSelectedUser(contact)} key={contact._id}>
                        {contact.context.user.name}
                    </button>
                ))}
                <form onSubmit={this.send}>
                    <input ref={(ref) => (this.message = ref)}></input>
                    <button>Send</button>
                </form>
                <button onClick={this.logout}>Logout</button>
            </>
        );
    }
}

export default withTracker(() => {
    SkypeSender.initiateWatch('skypeSender');
    return {};
})(HomeDashboard);
