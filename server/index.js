const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
// if not in production mode
if (process.env.NODE_ENV !== "production") require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello From CodeX" });
});
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

app.listen("5000", () => [console.log(`Serving on port 5000`)]);
