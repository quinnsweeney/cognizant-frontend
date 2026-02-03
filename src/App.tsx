import { ChatApp } from "./ChatApp";
import "./index.css";

export function App() {
  return (
    <div className="w-full h-full flex flex-col" style={{ height: '100dvh' }}>
      <ChatApp />
    </div>
  );
}

export default App;
