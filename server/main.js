// Server entry point, imports all server code
import "./init";
import Server from '/imports/api/classes/Server';
import '/imports/startup/server';
import '/imports/startup/both';
server = new Server();
server.run();