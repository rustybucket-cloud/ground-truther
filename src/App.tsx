import { Classifier } from "./features";

function App() {
  return (
    <>
      <header className="bg-primary p-3">
        <div className="max-w-screen-xl mx-auto">
          <h5>ML Tools</h5>
        </div>
      </header>
      <main className="max-w-screen-xl mx-auto">
        <Classifier />
      </main>
    </>
  );
}

export default App;
