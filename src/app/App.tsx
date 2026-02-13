import React from "react";
import QuoteBuilder from "./QuoteBuilder";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <QuoteBuilder />
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default App;
