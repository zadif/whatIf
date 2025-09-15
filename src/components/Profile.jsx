import { useState, useEffect } from "react";
import api from "./api.js";
import { Card } from "./Card.jsx";

export function Profile() {
  let [profile, setProfile] = useState([]);

  async function search() {
    try {
      const response = await api.get("/self");
      setProfile(response.data);
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
      <h2>{localStorage.getItem("username")}</h2>
      {profile.map((post) => {
        return (
          <Card
            username="You"
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
