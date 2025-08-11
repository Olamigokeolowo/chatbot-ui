import React from "react";
import ChatWindow from "./components/ChatWindow";
import { Helmet } from "react-helmet";

function App() {
  return (
    <div className="flex flex-col min-h-screen min-w-min bg-gray-100">
      <ChatWindow />
      <Helmet>
        <meta charSet="utf-8" />
        <title>Traffichat</title>
        <link rel="canonical" href="http://traffichat.vercel.app" />
        <meta name="description" content="Traffichat" />
      </Helmet>
    </div>
  );
}

export default App;
