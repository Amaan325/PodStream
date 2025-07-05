import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import videojs from "video.js";

import VideoPlayer from "./VideoPlayer";
import CommentSection from "./CommentSection";

const Player = () => {
  const location = useLocation();
  const {
    videoUrl,
    user,
    id,
    image,
    title,
    username,
    uploaderId,
    views,
    description,
  } = location.state || {};

  const [commentCount, setCommentCount] = useState(0);
  const playerRef = useRef(null);

  const cleanedVideoUrl = videoUrl ? videoUrl.replace(/^\.+/, "").trim() : "";
  const actualUrl = `http://localhost:3000${cleanedVideoUrl}`;

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: actualUrl,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/comments/count/${id}`
        );
        setCommentCount(res.data.count);
      } catch (error) {
        console.error("Failed to fetch comment count:", error);
      }
    };

    if (id) {
      fetchCommentCount();
    }
  }, [id]);

  useEffect(() => {
    console.log("In Player", username);
    console.log(id);
  }, []);

  return (
    <>
      <div className="pt-32 bg-black mb-12">
        <div className="flex items-center justify-center">
          <VideoPlayer
            key={id}
            url={actualUrl}
            options={videoPlayerOptions}
            onReady={handlePlayerReady}
            videoId={id}
            userAdmin={user}
            uploaderId={uploaderId}
            image={image}
            title={title}
            description={description}
            views={views}
            username={username}
          />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-white text-lg font-medium mb-2">
          {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
        </p>
        <CommentSection podcastId={id} />
      </div>
    </>
  );
};

export default Player;
