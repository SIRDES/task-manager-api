const express = require("express");
// const Task = require("./modal/task");
// const User = require("./modal/user");

require("./db/mongoose");

const userRouter = require("./routes/user")
const taskRouter = require("./routes/task")
const app = express();
const port = process.env.PORT || 3000;

// app.use((req,res, next)=> {
// res.status(503).send("Site is current unavialbe")
// })

app.use(express.json());
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
