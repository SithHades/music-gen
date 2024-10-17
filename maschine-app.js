document.addEventListener("DOMContentLoaded", function () {
  const audioContext = new AudioContext();
  const drumMachine = new DrumMachine(audioContext);
  const instruments = { kick: [], hihat: [], clap: [] };
  const steps = 16;
  let currentStep = 0;
  let playing = false;
  let intervalId;

  // Create a 4x4 grid with 16 steps
  const grid = document.getElementById("grid");
  const stepData = Array(steps).fill(false); // For each instrument

  for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
    const step = document.createElement("div");
    step.classList.add("step");
    step.dataset.index = stepIndex; // Store step index for reference
    step.addEventListener("click", () => toggleStep(stepIndex, step));
    grid.appendChild(step);
  }

  function toggleStep(stepIndex, stepElement) {
    stepData[stepIndex] = !stepData[stepIndex];
    stepElement.classList.toggle("active");
  }

  function play() {
    intervalId = setInterval(() => {
      Array.from(grid.getElementsByClassName("step")).forEach(
        (stepElement, index) => {
          stepElement.classList.toggle("current", index === currentStep);
          if (stepData[index]) {
            const instrument =
              document.getElementById("instrument-select").value;
            playInstrument(instrument);
          }
        }
      );
      currentStep = (currentStep + 1) % steps;
    }, 200); // Tempo control
  }

  function stop() {
    clearInterval(intervalId);
    currentStep = 0;
    Array.from(grid.getElementsByClassName("step")).forEach((step) =>
      step.classList.remove("current")
    );
  }

  function playInstrument(instrument) {
    if (instrument === "kick") {
      drumMachine.kick(audioContext.currentTime);
    } else if (instrument === "hihat") {
      drumMachine.hihat(audioContext.currentTime);
    } else if (instrument === "clap") {
      drumMachine.clap(audioContext.currentTime);
    }
  }

  document.getElementById("play").addEventListener("click", () => {
    if (!playing) {
      play();
      playing = true;
    }
  });

  document.getElementById("stop").addEventListener("click", () => {
    stop();
    playing = false;
  });
});
