const Express = require("express")
const fs = require("fs")
const app =  new Express()
const cors = require("cors")

app.use(Express.json())
app.use(cors())

const users = JSON.parse(fs.readFileSync("data/data.json"))
const exercises = JSON.parse(fs.readFileSync("data/exercises.json"))
/* USERS = {
  user: "test",
  exercises: {
    1: {
      status: "PASSED"
    }
  }
}
*/

const u = {
  user: "test",
  exercises: {
    1: {
      status: "PASSED"
    }
  }
}
const port = 8080

setInterval(()=> {
  try{
  fs.writeFileSync("data/data.json", JSON.stringify(users))
  } catch (err) {
    console.error(err)
  }
}, 1000)

app.post("/singup", (req, res) => {
  const { user } = req.body
  if (users[user]) {
    res.status(400).json({message: "User already exists"})
  } else {
    users[user] = {joined: true, exercises: {}}
    res.status(200).json({messagge: "User created"})
  }
})

app.post("/exercise", (req, res) => {
  const { user, exerciseId } = req.body
  if (!users[user]) {
    res.status(404).json({message: "User does not exist"})
  } else {
    if (!exercises[exerciseId]) {
      res.status(404).json({message: "Exercise does not exist"})
    } else {
      res.json({
        id: exercises[exerciseId].id,
        title: exercises[exerciseId].title,
        text: exercises[exerciseId].text,
        value: exercises[exerciseId].value
      })
    }
  }
})

app.post("/submit", (req, res) => {
  const { user, exerciseId, result } = req.body
  if (!users[user]) {
    res.status(404).json({message: "User does not exist"})
  } else {
    if (!exercises[exerciseId]) {
      res.status(404).json({message: "Exercise does not exist"})
    } else {
      if (exercises[exerciseId].solution === result) {
        users[user].exercises[exerciseId].status = "PASSED"
        res.status(200).json({message: "Exercise passed"})
      } else {
        users[user].exercises[exerciseId].status = "FAILED"
        res.status(200).json({message: "Exercise failed"})
      }
    }
  }
})

app.get("/exercises", (req, res) => {
  let html = "<h1>Exercises</h1>"
  for (const exercise in exercises) {
    html += `<h2>${exercises[exercise].title}</h2>`
    html += `<p>${exercises[exercise].text}</p>`
    html += `</br>`
  }
  res.send(html)
})
/*
app.get("/users", (req, res) => {
  let html = "<h1>Users</h1>"
  for (const user in users) {
    html += `<h2>${user}</h2>`
    for (const exerciseId in Object.keys(exercises)) {
      if (!users[user].exercises[exerciseId] || users[user].exercises[exerciseId].status === "FAILED") {
        html += `<p style="color: red; display: inline-block">${exerciseId}</p>`
      }
      else {
        html += `<p style="color: green; display: inline-block">${exerciseId}</p>`
      }

    }
  }
  res.send(html)
})
*/

app.get("/users", (req, res) => {
  res.json(users)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})