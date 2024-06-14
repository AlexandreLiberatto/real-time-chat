// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket
let onlineUsers = 0

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message--self")
    div.innerHTML = content
    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    div.classList.add("message--other")
    span.classList.add("message--sender")
    span.style.color = senderColor
    span.innerHTML = sender
    div.appendChild(span)
    div.innerHTML += content
    return div
}

const createSystemMessageElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message--system")
    div.innerHTML = content
    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { type, userId, userName, userColor, content, userCount } = JSON.parse(data)
    let message

    if (type === "message") {
        message = userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)
    } else if (type === "user-joined") {
        message = createSystemMessageElement(`${userName} entrou no chat.`)
        onlineUsers = userCount
        updateOnlineUsers()
    } else if (type === "user-left") {
        message = createSystemMessageElement(`${userName} saiu do chat.`)
        onlineUsers = userCount
        updateOnlineUsers()
    }

    chatMessages.appendChild(message)
    scrollScreen()
}

const updateOnlineUsers = () => {
    const onlineUsersElement = document.querySelector(".chat__online-users")
    onlineUsersElement.innerText = `Usuários online: ${onlineUsers}`
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://real-time-chat-backend-xsj5.onrender.com")  // Certifique-se de usar a URL correta para seu WebSocket
    websocket.onmessage = processMessage

    websocket.onopen = () => {
        websocket.send(JSON.stringify({ type: "join", userId: user.id, userName: user.name, userColor: user.color }))
    }

    window.addEventListener("beforeunload", () => {
        websocket.send(JSON.stringify({ type: "leave", userId: user.id, userName: user.name }))
    })
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        type: "message",
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
