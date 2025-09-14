import { useState } from "react";
import api from "./api";

export function WhatIfs() {
  let [input, setInput] = useState("");
  const [option, setOption] = useState("news");
  const [tone, setTone] = useState("Mythical");

  async function generate() {
    if (!input || !option || !tone) {
      alert("Options are missing");
      return;
    }
    try {
      const response = await api.post("/generate", {
        prompt: `What if ${input}`,
        option: option,
        tone: tone,
      });
      console.log(response.data.message);
    } catch (err) {
      console.log(err);
    }

    console.log(input, option);
  }

  return (
    <>
      <h2> Story</h2>
      <br />
      <br />
      <span> What if </span>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="dinasours never existed"
      />

      <br />
      <br />
      <label htmlFor="options">Choose : </label>

      <select
        id="options"
        value={option}
        onChange={(e) => setOption(e.target.value)}
      >
        <option value="news">News Headline</option>
        <option value="tweet">Tweet</option>
        <option value="article">Mini article</option>
        <option value="dialogue">Dialogue between 2 people</option>
        <option value="timeline">Alternate Timeline summary</option>
        <option value="image">Image generation of alternate reality</option>
      </select>
      <br />
      <label htmlFor="options">Choose Tone : </label>

      <select
        id="options"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option value="Mythical">Mythical</option>
        <option value="Dark"> Dark</option>

        <option value="Scientific">Scientific</option>

        <option value="Absurd">Absurd</option>

        <option value="Humorous">Humorous</option>
      </select>
      <br />
      <br />
      <button onClick={generate}>Generate the World</button>
    </>
  );
}
