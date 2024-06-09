import { useEffect } from "react";
import { css } from "@linaria/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const appCss = css`
  --header-height: 3rem;
`

const headerCss = css`
  height: var(--header-height);
`

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // always redirect to classifier for now
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/classifier");
    }
  }, [location.pathname, navigate])

  return (
    <div className={appCss}>
      <header className={`bg-primary p-3 ${headerCss}`}>
        <div className="max-w-screen-xl mx-auto">
          <h5>Ground Truther</h5>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
