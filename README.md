# Name: Phyo W. Shwe
Final Project for advance web programming class.

Basic chat application that allow two users to talk to each other via socker.io
This app also keep track of all user messages in mongodb provided via docker.

Folder finalserv serves as a server and finalcli vue client.
All events are pass from socket io to make the communication easier.

User activity:
Create an account if he does not have one yet by clicking on register.
Then they will log in. After they can select who they would like to talk to
via combo box which trigger a room join on the server and allow a message to come
across the socket io room.