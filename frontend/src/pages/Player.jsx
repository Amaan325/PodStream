import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import videojs from "video.js";

import VideoPlayer from "./VideoPlayer";
import CommentSection from "./CommentSection";

const Player = () => {
  const location = useLocation();
  const {
    videoUrl,
    id,
    image,
    title,
    username,
    uploaderId,
    views,
    description,
  } = location.state || {};

  const cleanedVideoUrl = videoUrl ? videoUrl.replace(/^\.+/, "").trim() : "";
  const actualUrl = `http://localhost:3000${cleanedVideoUrl}`;

  const playerRef = useRef(null);

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
        <CommentSection podcastId={id} />
      </div>
    </>
  );
};

export default Player;
