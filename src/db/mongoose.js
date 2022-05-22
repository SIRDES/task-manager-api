const mongoose = require("mongoose");
// const validator = require("validator")

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
});





// const task1 = new Task({
//   description: "Go shopping again",
//   completed: false
// })

// task1.save().then(task => {
//   console.log(task)
// }).catch(error => {
//   console.log(error)
// })
// const me = new User({
//   name: "Desmond2",
//   age: 25,
//   email: "des2@tt.com",
//   password: "passwosrd"
// });
// me.save()
//   .then((me) => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
