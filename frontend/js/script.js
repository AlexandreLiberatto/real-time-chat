const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    // Use the provided backend URL for WebSocket connection
    const wsUrl = "wss://real-time-chat-backend-xsj5.onrender.com"

    websocket = new WebSocket(wsUrl)
    websocket.onmessage = processMessage

    websocket.onopen = () => {
        websocket.send(JSON.stringify({ type: "join", userId: user.id, userName: user.name, userColor: user.color }))
    }

    window.addEventListener("beforeunload", () => {
        websocket.send(JSON.stringify({ type: "leave", userId: user.id, userName: user.name }))
    })
}

const processMessage = (event) => {
    const message = JSON.parse(event.data)
    const messageElement = document.createElement("div")

    if (message.type === "user-joined") {
        messageElement.classList.add("message--system")
        messageElement.textContent = `${message.userName} entrou no chat.`
        updateOnlineUsers(message.userCount)
    } else if (message.type === "user-left") {
        messageElement.classList.add("message--system")
        messageElement.textContent = `${message.userName} saiu do chat.`
        updateOnlineUsers(message.userCount)
    } else {
        const senderElement = document.createElement("span")
        senderElement.classList.add("message--sender")
        senderElement.textContent = message.userName

        messageElement.classList.add(message.userId === user.id ? "message--self" : "message--other")
        messageElement.textContent = message.text
        messageElement.prepend(senderElement)
    }

    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight
}

const updateOnlineUsers = (count) => {
    const onlineUsersElement = document.querySelector(".chat__online-users")
    onlineUsersElement.textContent = `Usuários online: ${count}`
}

document.querySelector(".login__form").addEventListener("submit", handleLogin)
document.querySelector(".chat__form").addEventListener("submit", (event) => {
    event.preventDefault()
    const messageInput = document.querySelector(".chat__input")
    const message = {
        type: "message",
        userId: user.id,
        userName: user.name,
        text: messageInput.value
    }
    websocket.send(JSON.stringify(message))
    messageInput.value = ""
})
