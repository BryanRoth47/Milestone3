import React, { Component } from 'react'
import Message from './Message'

export class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scrolledToBottom: false,
            initialSetupComplete: false
        }
        this.handleScroll = this.handleScroll.bind(this);
        this.determinePrevName = this.determinePrevName.bind(this);
        this.determineNextName = this.determineNextName.bind(this);
    }

    componentDidUpdate() {
        //alert("prev: "+JSON.stringify(prevState));
        //alert("current: "+JSON.stringify(this.state));
        //alert("update:" + this.state.scrolledToBottom);
        //alert('update');
        let myChats = this.props.chats;
        if (!(myChats == null) && (myChats.chats.length > 0)) {
            let last = myChats.chats[myChats.chats.length - 1];
            // if we are joining a chat with existing chats, scroll to the bottom
            if (this.state.initialSetupComplete === false) {
                //alert('initial');
                //this.state.initialSetupComplete = true;
                this.setState({ initialSetupComplete: true });
                this.scrollTheDiv();
            }
            // if the logged in user sent the last chat OR was already scrolled to the bottom, scroll
            else if (last.from === this.props.username || this.state.scrolledToBottom === true) {
                this.scrollTheDiv();
            }
        }
    }

    scrollTheDiv() {
        let target = document.getElementById("chatDiv");
        target.scrollTop = target.scrollHeight;
    }

    handleScroll() {
        //set the chat window to scroll to the bottom when initially loaded
        let target = document.getElementById("chatDiv");
        if (target != null) {
            let isAtBottom = (target.scrollHeight - target.scrollTop === target.offsetHeight);
            if (isAtBottom !== this.state.scrolledToBottom) {
                //alert("handle -- old: " + this.state.scrolledToBottom + ", new: " + isAtBottom);
                this.setState({ scrolledToBottom: isAtBottom });
            }
        }

    }

    componentDidMount() {
        let target = document.getElementById("chatDiv");
        target.scrollTop = target.scrollHeight;
    }

    //contains the logic to determine the sender of the message BEFORE chats[index]. Returns "" if first message
    determinePrevName(index) {
        if (index === 0) {
            return "";
        }
        else {
            return this.props.chats.chats[index-1].from;
        }
    }

    determineNextName(index){
        if(index===(this.props.chats.chats.length-1)){
            return "";
        }
        else{
            return this.props.chats.chats[index+1].from;
        }
    }

    render() {

        let myChats = this.props.chats;

        let displayChats = null;

        if (!(myChats == null) && myChats.chats.length > 0) {

            displayChats = myChats.chats.map((chat, index) =>
                <Message key={chat.id} contents={chat} username={this.props.username} prevName={this.determinePrevName(index)} 
                    nextName={this.determineNextName(index)} />
            );
        }


        return (
            <div id="chatDiv" className="card-body" style={{ overflowY: "auto", maxHeight: '500px' }} onScroll={this.handleScroll}>
                <dl>{displayChats}</dl>
            </div>
        );
    }
}

export default Chat;