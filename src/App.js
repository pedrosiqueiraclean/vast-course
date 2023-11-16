import "./App.css";
import VideoWrapper from "./components/VideoWrapper/VideoWrapper";
import { parseVAST, vast4 } from "./utils/utils";

function App() {
  const vastParsed = parseVAST(vast4);

  return (
    <div className="container">
      <VideoWrapper vastParsed={vastParsed} />
    </div>
  );
}

export default App;
