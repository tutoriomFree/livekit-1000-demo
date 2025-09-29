
// Load LiveKit client
// (teacher.html and student.html will include this file)

async function joinRoom(role) {
  try {
    // Ask backend for a token
    const res = await fetch(`/getToken?role=${role}&identity=${role}-${Date.now()}`);
    const data = await res.json();

    const { token, url } = data;

    // Connect to LiveKit room
    const { connect, createLocalTracks } = window.LivekitClient;
    const room = await connect(url, token);

    // If teacher → publish mic+camera
    if (role === "teacher") {
      const tracks = await createLocalTracks({ audio: true, video: true });
      tracks.forEach(track => room.localParticipant.publishTrack(track));
    }

    // When subscribing to tracks (students receiving teacher’s video/audio)
    room.on("trackSubscribed", (track, pub, participant) => {
      const el = track.attach();
      if (track.kind === "video") {
        el.style.width = "100%";
        el.style.maxWidth = "600px";
      }
      document.body.appendChild(el);
    });

    console.log(`${role} joined room ${data.room}`);
  } catch (err) {
    console.error("Error joining room:", err);
  }
}
