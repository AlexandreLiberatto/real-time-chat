/* ====login elements==== */
const login = document.querySelector('.login')
const loginForm = document.querySelector('.login__form')
const loginInput = document.querySelector('.login__input')

/* ====chat elements==== */
const chat = document.querySelector('.chat')
const chatForm = document.querySelector('.chat__form')
const chatInput = document.querySelector('.chat__input')

const colors = [
    "White",
    "LightGray", 
    "LightYellow", 
    "LightCyan", 
    "LightGoldenRodYellow", 
    "LightSteelBlue", 
    "Lavender", 
    "MistyRose", 
    "LightPink", 
    "PaleTurquoise" 
]

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)
}


const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value 
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage

}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
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