
import { useState } from "react";
import Mobile from "./components/mobile";
import Laptop from "./components/laptop";
function App() {
  const [theme, setTheme] = useState("violet");
  return (
    <>
      <div className="hidden md:block"><Laptop theme={theme} onThemeChange={setTheme} /></div>
      <div className="block md:hidden"><Mobile theme={theme} onThemeChange={setTheme} /></div>
    </>
  );
}

export default App;