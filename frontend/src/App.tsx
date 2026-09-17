import { useEffect, useState } from "react";

import "./App.css";

import Home from "./pages/home";
import Create from "./pages/create";
import Projects from "./pages/projects";
import Tutorials from "./pages/tutorials";

import ArtBackground from "./components/3d/ArtBackground";
import HandCameraController from "./components/3d/HandCameraController";


function App() {
  const [hash, setHash] = useState(
    window.location.hash || "#home"
  );


  useEffect(() => {
    const handleHashChange = () => {
      setHash(
        window.location.hash || "#home"
      );
    };

    window.addEventListener(
      "hashchange",
      handleHashChange
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange
      );
    };
  }, []);


  function renderPage() {
    switch (hash) {
      case "#create":
        return <Create />;

      case "#projects":
        return <Projects />;

      case "#tutorials":
        return <Tutorials />;

      case "#home":
      default:
        return <Home />;
    }
  }


  return (
    <div className="app-shell">

      <ArtBackground />

      <HandCameraController />

      <div className="app-content">
        {renderPage()}
      </div>

    </div>
  );
}


export default App;