import { useEffect, useState } from "react";
import api from "./api";
import { Link, useParams } from "react-router-dom";
import { Card } from "./Card";

export function View() {
  let { postID } = useParams();
  let [post, setPost] = useState({});

  async function search() {
    try {
      console.log("Sending requestt");
      let response = await api.post("/whatIf", {
        postId: postID,
      });

      setPost(response.data);
      return response;
    } catch (err) {
      console.error("Error in fetching fetch: ", err);
    }
  }

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <Card
        username={post.username}
        prompt={post.prompt}
        response={post.response}
        tone={post.tone}
        type={post.type}
        likeCount={post.likeCount}
        created_at={post.created_at}
        key={post.id}
        userID={post.userID}
        postID={post.id}
        has_Liked={post.has_liked}
        view={true}
      />
    </>
  );
}
