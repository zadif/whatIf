import { useState, useEffect } from "react";
import api from "./api.js";
import { Card } from "./Card.jsx";

export function Feed() {
  let [feed, setFeed] = useState([]);

  async function search() {
    try {
      const response = await api.get("/feed");
      setFeed(response.data);
      return response;
    } catch (err) {
      console.error("Error in fetching feed from backend: ", err.message);
    }
  }

  useEffect(() => {
    search();
  }, []);
  return (
    <>
      {feed.map((post) => {
        return (
          <Card
            username={post.username}
            prompt={post.prompt}
            response={post.response}
            tone={post.tone}
            type={post.type}
            likeCount={post.likeCount}
            created_at={post.created_at}
            key={post.id}
          />
        );
      })}
    </>
  );
}
