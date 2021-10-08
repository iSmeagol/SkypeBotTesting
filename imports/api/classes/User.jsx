import React from 'react';
import { ROLES } from './Const';
// import Avatar, { getRandomColor } from '../../ui/extras/Avatar';

class User {

    constructor(obj, index) {
        this.id = obj._id;
        this.username = obj.username;
        this.firstname = obj.profile.first;
        this.lastname = obj.profile.last;
        this.emails = obj.emails;
        this.role = obj.profile.role;
        this.type = obj.profile.type;
        this.claimedBy = obj.profile.claimedBy;
        // this.avatar = <Avatar key={index} username={obj.username} color={getRandomColor()} />;
        this.retired = obj.profile.retired;
        this.number = obj.profile.number;
    }

    getPrimaryEmail() {
        return this.emails.filter((email) => {
            return email.verified === true;
        });
    }

    getRole() {
        let role = 'MEMBER';
        if (this.role === ROLES.SUPERVISOR)
            role = 'SUPERVISOR';
        if (this.role === ROLES.MANAGERS)
            role = 'MANAGER';
        if (this.role === ROLES.SUPERUSER)
            role = 'MANAGER';
        return role;
    }

    setTeamName(name) {
        return this.teamName = name;
    }

    getSupervisorName() {
        return ""; // TODO
    }

    isRetired() {
        return !!this.retired;
    }

}
export default User;