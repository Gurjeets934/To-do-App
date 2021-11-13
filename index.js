const express= require('express');
const app= express();

const dotenv = require('dotenv');


const mongoose = require('mongoose');

const TodoTask = require("./models/TodoTask");

dotenv.config();
//connection to db
// mongoose.set('useFindAndModify', false
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");
app.listen(4000, () => console.log("Server Up and running"));
});



app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });

// app.get("/",(req,res)=>
// {
    // res.send("Hello World!");
// });

// app.get("/", (req, res) => {
//         // (tasks) => {
//         res.render("todo.ejs");});
        
    

app.set("view engine", "ejs");

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content,
    completed: false
    
    });
    try {
    await todoTask.save();
    res.redirect("/");
    // console.log('data added successfully');
    } catch (err) {
    // console.log(err);
    res.redirect("/");
    // console.log('data added successfully');
    }
    });

    app
    .route("/taskdone/:id")
    .get((req, res) => {
        const id = req.params.id;
        // TodoTask.findByIdAndUpdate(id, {completed:true});
        TodoTask.find({}, (err, tasks) => {
        res.render("taskdone.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
        const id = req.params.id;
        // const done;
        TodoTask.findByIdAndUpdate(id, {  completed:req.body.checked }, err => {
        // if (err) return res.send(500, err);
        res.redirect("/");
        });
        });
    
    app
    .route("/tasknotdone/:id")
    .get((req, res) => {
            const id = req.params.id;
            // TodoTask.findByIdAndUpdate(id, {completed:true});
            TodoTask.find({}, (err, tasks) => {
            res.render("tasknotdone.ejs", { todoTasks: tasks, idTask: id });
        });
        })
    .post((req, res) => {
            const id = req.params.id;
            // const done;
            TodoTask.findByIdAndUpdate(id, { completed:req.body.checked }, err => {
            // if (err) return res.send(500, err);
            res.redirect("/");
            });
            });
        

    app
    .route("/edit/:id")
    .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
    const id = req.params.id;
    // const done;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    // if (err) return res.send(500, err);
    res.redirect("/");
    });
    });

    app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;
        // TodoTask.findOneAndReplace()
        TodoTask.findByIdAndRemove(id, err => {
        // if (err) return res.send(500, err);
        res.redirect("/");
        });
        });