const axios = require('axios')

axios.post('http://localhost:8080/singup', {
  user: "test"
}).then (res => {
  console.log(res.data)})
  .catch(err => console.error(err.response.data))

axios.post('http://localhost:8080/exercise', {
  exerciseId: 1,
  user: "test"
}).then (res => {
  console.log(res.data)})