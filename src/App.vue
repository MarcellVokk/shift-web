<template>
  <div class="view login" v-if="state.username === '' || state.username === null">
    <form class="login-form" v-on:submit.prevent="Login">
      <div class="form-inner">
        <h1>Shift</h1>
        <label for="username">A neved</label>
        <input
          type="text"
          v-model="inputUsername"
          placeholder="Írd be a felhasználóneved..."
        />
        <input
        type="submit"
        value="Belépés"
        />
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header>
      <button class="logout" v-on:click="Logout">Kilépés</button>
      <h1>Szia, {{ state.username }}</h1>
    </header>

    <section class="chat-box" id="messages">
      <div
      v-for="message in state.messages" 
      v-bind:key="message.key"
      v-bind:class="(message.username == state.username ? 'message current-user' : 'message')">
      <div class="message-inner">
        <div class="username">{{ message.username }}</div>
        <div class="content">{{ message.content }}</div>
      </div>

      </div>
    </section>

    <footer>
      <form v-on:submit.prevent="SendMessage">
        <input
        type="text"
        v-model="inputMessage"
        placeholder="Ide írhatod az üzeneted" 
        />
        <input type="submit" value="Küldés">
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import db from './db';

export default {

  setup() {

    const inputUsername = ref("");
    const inputMessage = ref("");

    const state = reactive({
      username: "",
      messages: []
    });

    const Login = () => {
      if(inputUsername.value != "" || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = "";
      }
    }

    const Logout = () => {
      state.username = "";
    }

    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");

      if(inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value
      }

      messagesRef.push(message);
      inputMessage.value = "";
    }

    onMounted(() => {
      const messagesRef = db.database().ref("messages");

      messagesRef.on('value', snapshot => {
        const data = snapshot.val();
        let messages = [];

        Object.keys(data).forEach(key => {
          console.log(data[key].content)
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          });
        });

        state.messages = messages;
      });
    });

    return {
      inputUsername,
      inputMessage,
      Login,
      Logout,
      state,
      SendMessage
    }
  }
}
</script>

<style lang="scss">
* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.view {
	display: flex;
	justify-content: center;
	min-height: 100vh;
	background-color: #ea526f;
 
	&.login {
		align-items: center;
		.login-form {
			display: block;
			width: 100%;
			padding: 15px;
 
			.form-inner {
				display: block;
				background-color: rgb(28, 28, 28);
				padding: 50px 15px;
				border-radius: 16px;
				box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
				h1 {
					color: #ea526e7c;
					font-size: 28px;
					margin-bottom: 30px;
				}
				label {
					display: block;
					margin-bottom: 5px;
					color: rgba(255, 255, 255, 0.178);;
					font-size: 16px;
					transition: 0.4s;
				}
				input[type="text"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px;
					margin-bottom: 15px;
 
					color: rgb(255, 255, 255);
					font-size: 18px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
					background-color: #1f1f1f;
					transition: 0.4s;
					&::placeholder {
						color: rgba(255, 255, 255, 0.185);
						transition: 0.4s;
					}
				}
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					background-color: rgb(0, 153, 255);
					border-radius: 8px;
					color: #FFF;
					font-size: 18px;
					font-weight: 700;
				}
				&:focus-within {
					label {
						color: #ea526f;
					}
					input[type="text"] {
						background-color: rgb(48, 48, 48);
						box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
						&::placeholder {
							color: rgba(255, 255, 255, 0.185);
						}
					}
				}
			}
		}
	}
	&.chat {
		flex-direction: column;
		header {
			position: relative;
			display: block;
			width: 100%;
			padding: 50px 30px 10px;
			.logout {
				position: absolute;
				top: 15px;
				right: 15px;
				appearance: none;
				border: none;
				outline: none;
				background: none;
 
				color: #FFF;
				font-size: 18px;
				margin-bottom: 10px;
				text-align: right;
			}
			h1 {
				color: #FFF;
			}
		}
		.chat-box {
			border-radius: 24px 24px 0px 0px;
			background-color: rgb(26, 26, 26);
			box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
			flex: 1 1 100%;
			padding: 30px;
			.message {
				display: flex;
				margin-bottom: 15px;
 
				.message-inner {
					.username {
						color: #888;
						font-size: 16px;
						margin-bottom: 5px;
						padding-left: 15px;
						padding-right: 15px;
					}
					.content {
						display: inline-block;
						padding: 10px 20px;
            word-break: break-word;
            white-space: pre-wrap;
						background-color: #7272723a;
						border-bottom-right-radius: 18px;
            border-bottom-left-radius: 18px;
            border-top-right-radius: 18px;
            border-top-left-radius: 18px;
						color: rgb(255, 255, 255);
						font-size: 18px;
						line-height: 1.2em;
						text-align: left;
					}
				}
				&.current-user {
					margin-top: 30px;
					justify-content: flex-end;
					text-align: right;
					.message-inner {
						max-width: 75%;
						.content {
							color: #FFF;
							font-weight: 600;
							//background-color: #ea526f;
              background-color: #0099ff;
						}
					}
				}
			}
		}
		footer {
			position: sticky;
			bottom: 0px;
			background-color: rgb(22, 22, 22);
			padding: 30px;
			box-shadow: 0px 0px 12px rgb(29, 29, 29);
			form {
				display: flex;
				input[type="text"] {
					flex: 1 1 100%;
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					width: 100%;
					padding: 10px 15px;
					border-radius: 8px 0px 0px 8px;
 
					color: rgb(255, 255, 255);
					font-size: 18px;
					box-shadow: 0px 0px 0px rgb(58, 58, 58);
					background-color: #111111;
					transition: 0.4s;
					&::placeholder {
						color: rgb(53, 53, 53);
						transition: 0.4s;
					}
				}
 
				input[type="submit"] {
					appearance: none;
					border: none;
					outline: none;
					background: none;
					display: block;
					padding: 10px 15px;
					border-radius: 0px 8px 8px 0px;
					background-color: #ea526f;
					color: rgb(255, 255, 255);
					font-size: 18px;
					font-weight: 700;
				}
			}
		}
	}
}
</style>
