$(document).ready(function () {
  const beatMachine = new HouseMusicGenerator();

  // Update BPM and measures dynamically
  $("#bpm").on("input", function () {
    const bpm = $(this).val();
    $("#bpm-value").text(bpm);
  });

  $("#measures").on("input", function () {
    const measures = $(this).val();
    $("#measures-value").text(measures);
  });

  // Play button
  $("#play-button").click(function () {
    const bpm = parseInt($("#bpm").val());
    const measures = parseInt($("#measures").val());
    beatMachine.generateFunkyHouseBeat(measures, bpm);
  });

  // Stop button functionality
  $("#stop-button").click(function () {
    beatMachine.audioContext.context.close(); // Stop the current context
    beatMachine.audioContext = new AudioContext(); // Reset to a new AudioContext
  });

  // Interactive pads (e.g., for soloing parts)
  $(".pad").click(function () {
    const padType = $(this).text().toLowerCase();
    switch (padType) {
      case "kick":
        beatMachine.drums.kick(beatMachine.audioContext.context.currentTime);
        break;
      case "hihat":
        beatMachine.drums.hihat(beatMachine.audioContext.context.currentTime);
        break;
      case "clap":
        beatMachine.drums.clap(beatMachine.audioContext.context.currentTime);
        break;
      case "bass":
        beatMachine.synth.playNote(
          41,
          beatMachine.audioContext.context.currentTime,
          0.5,
          "sawtooth",
          0.7
        );
        break;
      case "synth":
        beatMachine.synth.playNote(
          60,
          beatMachine.audioContext.context.currentTime,
          0.5,
          "square",
          0.4
        );
        break;
    }
  });
});
