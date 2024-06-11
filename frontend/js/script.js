/* ====login elements==== */
const login = document.querySelector('.login')
const loginForm = document.querySelector('.login__form')
const loginInput = document.querySelector('.login__input')

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

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() = colors.length)
    return colors[randomIndex]
}



const user = { id: "", name: "", color: "" }

const handleSubmit = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value 

    console.log(user)
}

loginForm.addEventListener("submit", handleSubmit)