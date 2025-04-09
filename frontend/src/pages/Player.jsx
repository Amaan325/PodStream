import VideoPlayer from "./VideoPlayer";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import { useLocation } from "react-router-dom";

const Player = () => {
  const location = useLocation();
  const { videoUrl, id, image, title, username, views, description } =
    location.state || {};
  const cleanedVideoUrl = videoUrl ? videoUrl.replace(/^\.+/, "").trim() : "";
  const actualUrl = `http://localhost:3000${cleanedVideoUrl}`; // Use template literal correctly
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

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  // useEffect(() => {
  //   console.log(id);
  // }, [id]);

  return (
    <div className="pt-32 flex items-center justify-center h-screen bg-black mb-12">
      <div className="">
        <VideoPlayer
          options={videoPlayerOptions}
          onReady={handlePlayerReady}
          videoId={id}
          image = {image}
          title = {title}
          description = {description}
          views = {views} 
          username={username}// Send the id to VideoPlayer component
        />
      </div>
    </div>
  );
};

export default Player;
