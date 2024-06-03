import { Classifier } from "./features";
import { css } from "@linaria/core";

const appCss = css`
  --header-height: 3rem;
`

const headerCss = css`
  height: var(--header-height);
`

function App() {
  return (
    <div className={appCss}>
      <header className={`bg-primary p-3 ${headerCss}`}>
        <div className="max-w-screen-xl mx-auto">
          <h5>Ground Truther</h5>
        </div>
      </header>
      <main>
        <Classifier />
      </main>
    </div>
  );
}

export default App;
