<template>
    <div id="chat-app">
        <div class="left-col" v-show="leftColVisible">
            <div class="profile-box">
                <div class="text-center">
                    <i class="bx bx-id-card h1 mb-0"></i>
                    <p class="m-0" id="user_login">{{userLogin}}</p>
                    <a href="/">
                        <i class="bx bx-home"></i>
                    </a>
                    <a href="/logout">
                        <i class="bx bx-log-out"></i>
                    </a>
                </div>
            </div>
            <div id="room-list-box">
                <!-- Draw all rooms user is in -->
                <div class="card room-to-change" v-for="(room, index) in rooms" v-bind:key="index"
                     v-on:click="changeRoom(room)">
                    <a class="d-block change-room-name">{{room.room.name}}</a>
                    <p class="small room-creator">{{room.room.creator.login}}</p>
                </div>
            </div>
            <div class="new-room-box">
                <div class="card p-3 d-flex">
                    <div class="w-100">
                        <input type="text" class="form-control" id="add-room-name" placeholder="Name of new room"
                               v-model="newRoom.name" v-on:keydown.enter="createRoom()">
                    </div>
                    <div class="position-relative">
                        <button id="add-room" class="btn btn-primary" v-on:click="createRoom()">
                            <i class='bx bx-plus'></i>
                        </button>
                        <p class="mb-0 badge badge-danger" id="roomCreateErrors"></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-col">
            <div id="active-room-placeholder" v-show="!activeRoom.visible">
                <span>Choose room to chat</span>
            </div>
            <div id="active-room" v-show="activeRoom.visible">
                <span id="active-room-id"></span>
                <div class="header">
                    <p id="active-room-name">{{activeRoom.name}}</p>
                    <p id="active-room-creator">{{activeRoom.creator.login}}</p>
                    <div class="rooms-shower" @click="switchLeftCol">
                        <i class="bx bx-menu"></i>
                    </div>
                    <p id="active-room-users">
						<span id="roomUsers">
							<span v-for="(user, index) in activeRoom.users" v-bind:key="index"
                                  class="badge badge-secondary small mr-1">{{user.user.login}}</span>
						</span>
                        <span class="badge badge-success position-relative" id="addFormShow"
                              style="bottom: -0.8px; z-index: 90">
							<i class="bx bx-plus-circle" title="Add user to room"
                               v-on:click="addUser.visible = !addUser.visible"></i>
						</span>
                    </p>
                    <div class="add-form form-group mt-2" id="roomAddForm" v-show="addUser.visible">
                        <div class="d-flex">
                            <input type="text" class="form-control m-0" placeholder="User login" v-model="addUser.login"
                                   v-on:keydown.enter="addUserToActiveRoom()">
                            <button class="btn btn-sm btn-success" v-on:click="addUserToActiveRoom()">
                                Add new user to room
                            </button>
                        </div>
                        <p class="mb-0 badge badge-danger" id="roomAddUserErrors"></p>
                    </div>
                </div>
                <div id="room-messages">
                    <div v-for="(message, i) in activeRoom.messages" v-bind:key="i">
                        <p class="message-sender"
                           v-if="i == 0|| activeRoom.messages[i].sender.id !== activeRoom.messages[i - 1].sender.id">
                            <span class="badge-primary badge">{{message.sender.login}}</span>
                        </p>
                        <p class="message-body">{{message.message}}</p>
                    </div>
                </div>
                <div class="new-message d-flex">
                    <div class="form-group mb-0">
                        <input type="text" class="form-control" v-model="newMessage.message"
                               v-on:keydown.enter="sendMessage()" placeholder="Aa">
                    </div>
                    <button class="btn btn-primary" v-on:click="sendMessage()">Send</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'chat',
        // from PHP vars >_>
        props: ["userId", "userLogin"],
        data() {
            return {
                // Default var
                defaultMessagesCount: 20,
                // List of user-visible rooms
                rooms: [],
                // Active room
                activeRoom: {
                    visible: false,
                    name: "",
                    creator: {},
                    users: [],
                    messages: [
                        {
                            id: 0,
                            sender: {
                                login: "This room has no messages!",
                            },
                            message: 'Add someone to this room and start chatting!',
                        }
                    ],
                    messagesCount: this.defaultMessagesCount
                },
                // Adding users to room
                addUser: {
                    visible: false,
                    login: ""
                },
                // Adding room
                newRoom: {
                    name: ""
                },
                // Sending messages
                newMessage: {
                    message: ""
                },
                // RWD
                leftColVisible: true,
                // Timeouts
                roomsTimeout: true,
                usersTimeout: true,
                messagesTimeout: true
            };
        },

        // On site load and VUE created
        created() {
            // Get all rooms user is in
            this.getRooms();
            this.initTimeouts();
        },

        methods: {
            getRooms() {
                fetch("http://azurix.pl:8080/user/" + this.userId + "/rooms", {
                    credentials: 'include',
                })
                    .then(res => res.json())
                    .then(data => {
                        this.rooms = data;
                    });
            },
            changeRoom(room) {
                // Change active room
                this.activeRoom.name = room.room.name;
                this.activeRoom.id = room.room.id;
                this.activeRoom.creator.login = room.user.login;
                this.activeRoom.messagesCount = this.defaultMessagesCount; // Reset messages count
                // Get active room users
                this.getActiveRoomUsers();
                // Get active room messages by API
                this.getActiveRoomMessages();
                // Set flag to show active room
                this.activeRoom.visible = true;
                this.initTimeouts();
                // RWD: hide rooms col
                this.switchLeftCol();
            },
            getActiveRoomUsers() {
                fetch("http://azurix.pl:8080/room/" + this.activeRoom.id + "/users", {
                    credentials: 'include',
                })
                    .then(res => res.json())
                    .then(data => {
                        this.activeRoom.users = data;
                    });
            },
            addUserToActiveRoom() {
                fetch("http://azurix.pl:8080/room/" + this.activeRoom.id + "/add?login=" + this.addUser.login, {
                    method: "POST",
                    credentials: 'include',
                }).then(res => {
                    if (res.status === 200) {
                        console.log("User [" + this.addUser.login + "] to room [" + this.activeRoom.id + "] added!");
                        // Hide adding user form
                        this.addUser.visible = false;
                        // Clear new user login input
                        this.addUser.login = "";
                        // Synchronize users
                        this.getActiveRoomUsers();
                    } else {
                        // TODO: handle error message
                        console.log("User not added!");
                    }
                });
            },
            getActiveRoomMessages() {
                fetch("http://azurix.pl:8080/room/" + this.activeRoom.id + "?count=" + this.activeRoom.messagesCount, {
                    credentials: 'include',
                })
                    .then(res => res.json())
                    .then(data => {
                        // Check if room has messages inside
                        if (data.length > 0) {
                            // If last message changed
                            if (
                                data[0].id !==
                                this.activeRoom.messages[this.activeRoom.messages.length - 1]["id"]
                            ) {
                                this.activeRoom.messagesCount++;
                                this.activeRoom.messages = data.reverse(); // Wo ho ah
                                // Scroll to bottom to show new message
                                this.scrollMessages();
                                // Debug
                                console.log("Messages in active room refreshed!");
                            }
                        } else {
                            // Room has no messages
                            this.activeRoom.messages = [
                                {
                                    id: 0,
                                    sender: {
                                        login: "This room has no messages!",
                                    },
                                    message: 'Add someone to this room and start chatting!',
                                }
                            ];
                        }
                    });
            },
            scrollMessages() {
                setTimeout(() => {
                    const element = this.$el.querySelector("#room-messages");
                    element.scrollTop = element.scrollHeight;
                }, 100);
            },
            sendMessage() {
                fetch("http://azurix.pl:8080/room/" + this.activeRoom.id + "/message?senderId=" + this.userId + "&message=" + this.newMessage.message, {
                    method: "POST",
                    credentials: 'include',
                }).then(res => {
                    if (res.status === 200) {
                        console.log("Message sent to room [" + this.activeRoom.name + "]");
                        // Clear new message input
                        this.newMessage.message = "";
                        // Synchronize messages
                        this.getActiveRoomMessages();
                    } else {
                        // TODO: handle error message
                        console.log("Message not sent!");
                    }
                });
            },
            createRoom() {
                fetch("http://azurix.pl:8080/room/new?creatorId=" + this.userId + "&name=" + this.newRoom.name, {
                    method: "POST",
                    credentials: 'include',
                });
                // Clear form input
                this.newRoom.name = "";
                // Refresh rooms
                this.getRooms();
            },
            initTimeouts() {
                if (this.roomsTimeout) {
                    setInterval(() => {
                        this.getRooms();
                    }, 2000);
                    this.roomsTimeout = false;
                }
                if (this.activeRoom.visible) {
                    if (this.usersTimeout) {
                        setInterval(() => {
                            this.getActiveRoomUsers();
                        }, 2000);
                        this.usersTimeout = false;
                    }
                    if (this.messagesTimeout) {
                        setInterval(() => {
                            this.getActiveRoomMessages();
                        }, 1000);
                        this.messagesTimeout = false;
                    }
                }
            },
            switchLeftCol() {
                // Only on mobile
                if (innerWidth < 768) {
                    console.log(1);
                    this.leftColVisible = !this.leftColVisible;
                }
            }
        }
    };
</script>