const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const port = process.env.PORT || 8080
const wss = new WebSocketServer({ port })

const users = new Map()

wss.on("connection", (ws) => {
    let userId = null

    ws.on("message", (data) => {
        const message = JSON.parse(data.toString())
        
        if (message.type === "join") {
            userId = message.userId
            users.set(userId, { userName: message.userName, userColor: message.userColor })
            
            // Enviar mensagem de que o usuário entrou
            const joinMessage = {
                type: "user-joined",
                userId: userId,
                userName: message.userName,
                userCount: users.size
            }

            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(joinMessage))
                }
            })
        } else if (message.type === "message") {
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(data.toString())
                }
            })
        }
    })

    ws.on("close", () => {
        if (userId !== null) {
            const user = users.get(userId)
            users.delete(userId)
            
            // Enviar mensagem de que o usuário saiu
            const leaveMessage = {
                type: "user-left",
                userId: userId,
                userName: user.userName,
                userCount: users.size
            }

            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(leaveMessage))
                }
            })
        }
    })

    console.log("Servidor WebSocket está rodando na porta:", port)
})
