const express = require("express");
const morgan = require("morgan");
const cors = require('cors')

const app = express()


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms :body")
);


let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "CSS makes web pages look better",
    important: false,
  },
  {
    id: "3",
    content: "JavaScript adds interactivity",
    important: true,
  },
  {
    id: "4",
    content: "React uses components",
    important: true,
  },
  {
    id: "5",
    content: "Props are read-only",
    important: false,
  },
  {
    id: "6",
    content: "State changes trigger re-renders",
    important: true,
  },
  {
    id: "7",
    content: "Hooks simplify state management",
    important: false,
  },
  {
    id: "8",
    content: "Always use unique keys when rendering lists",
    important: true,
  },
  {
    id: "9",
    content: "Axios is used for HTTP requests",
    important: false,
  },
  {
    id: "10",
    content: "JSON Server is useful for mock APIs",
    important: true,
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});


app.get("/api/notes", (req, res) => {
  res.json(notes);
});


app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).send("Not Found");
  }
});

app.delete('/api/notes/:id',(req,res)=>{
  const id = req.params.id;
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (req,res)=>{
  const body = req.body;
  if(!body.content){
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)
  
  res.json(note)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

