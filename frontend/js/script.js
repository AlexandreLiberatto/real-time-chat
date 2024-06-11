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

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}


const handleSubmit = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value 
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    console.log(user)
}

loginForm.addEventListener("submit", handleSubmit)