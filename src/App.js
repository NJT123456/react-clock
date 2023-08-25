import { useEffect, useRef, useState } from "react"

function App() {
  const [breakTime, setBreakTime] = useState(5)
  const [sessionTime, setSessionTime] = useState(25)
  const [clockCount, setClockCount] = useState(25 * 60)
  const [isPlaying, setIsPlaying] = useState(false)
  const [session, setSession] = useState("Session")
  const [intervalId, setIntervalId] = useState(null)
  const audioRef = useRef(null)

  const convertToTime = (count) => {
    let minutes = Math.floor(count / 60)
    let seconds = count % 60

    minutes = minutes < 10 ? "0" + minutes : minutes
    seconds = seconds < 10 ? "0" + seconds : seconds
    return `${minutes}:${seconds}`
  }

  const handleLengthChange = (count, typeTime) => {
    let newCount

    if (typeTime === "session") {
      newCount = sessionTime + count
      if (newCount > 0 && newCount < 61 && !isPlaying) {
        if (session === "Session") {
          setClockCount(newCount * 60)
        }
        setSessionTime(newCount)
      }
    } else {
      newCount = breakTime + count
      if (newCount > 0 && newCount < 61 && !isPlaying) {
        if (session === "Break") {
          setClockCount(newCount * 60)
        }
        setBreakTime(newCount)
      }
    }
  }

  const startTimer = () => {
    setClockCount((prevClockCount) => {
      if (prevClockCount === 0) {
        setSession(session === "Session" ? "Break" : "Session")
        audioRef.current.play()
        return session === "Session" ? breakTime * 60 : sessionTime * 60
      } else {
        return prevClockCount - 1
      }
    })
  }

  useEffect(() => {
    if (isPlaying) {
      const timerId = setTimeout(startTimer, 1000)
      return () => clearTimeout(timerId)
    }
  }, [isPlaying, clockCount])

  const handlePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const reset = () => {
    clearInterval(intervalId)
    setBreakTime(5)
    setSessionTime(25)
    setClockCount(25 * 60)
    setIsPlaying(false)
    setSession("Session")
    setIntervalId(null)
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  return (
    <div className="container flex justify-center items-center min-h-screen flex-col">
      <div className="flex justify-center items-center flex-col w-[450px] min-h-[650px] rounded-[26px] clock">
        <div className="m-10 min-w-[85%] h-[60px] flex justify-center items-center rounded-md title">
          <h1 className="font-semibold">25 + 5 Clock</h1>
        </div>
        <div className="flex flex-row font uppercase">
          <div id="break-label" className="flex flex-col m-5">
            break length
            <div className="flex flex-row justify-around text-3xl font-semibold items-center">
              <button
                id="break-decrement"
                className="text-xl font-normal"
                onClick={() => handleLengthChange(-1, "break")}>
                <i
                  class="fa-solid fa-circle-minus"
                  style={{ color: "#fff" }}></i>
              </button>
              <div id="break-length">{breakTime}</div>
              <button
                id="break-increment"
                className="text-xl"
                onClick={() => handleLengthChange(1, "break")}>
                <i
                  class="fa-solid fa-circle-plus"
                  style={{ color: "#fff" }}></i>
              </button>
            </div>
          </div>
          <div id="session-label" className="flex flex-col m-5">
            session length
            <div className="flex flex-row justify-around text-3xl font-semibold items-center">
              <button
                id="session-decrement"
                className="text-xl leading-none"
                onClick={() => handleLengthChange(-1, "session")}>
                <i
                  class="fa-solid fa-circle-minus"
                  style={{ color: "#fff" }}></i>
              </button>
              <div id="session-length">{sessionTime}</div>
              <button
                id="session-increment"
                className="text-xl"
                onClick={() => handleLengthChange(1, "session")}>
                <i
                  class="fa-solid fa-circle-plus"
                  style={{ color: "#fff" }}></i>
              </button>
            </div>
          </div>
        </div>

        <div
          id="timer-label"
          className="flex flex-col items-center justify-center w-[350px] h-[350px] rounded-full">
          <h2 className={clockCount < 1 * 60 ? "red-text" : ""}>{session}</h2>
          <div
            id="time-left"
            className={`text-8xl ${clockCount < 1 * 60 ? "red-text" : ""}`}>
            <audio
              ref={audioRef}
              src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
              id="beep"></audio>
            {convertToTime(clockCount)}
          </div>

          <div>
            <button id="start_stop" className="mr-2.5" onClick={handlePlay}>
              <i
                class={`fa-solid fa-${isPlaying ? "pause" : "play"}`}
                style={{ color: "#fff" }}></i>
            </button>
            <button id="reset" className="ml-2.5" onClick={reset}>
              <i class="fa-solid fa-rotate-left" style={{ color: "#fff" }}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
