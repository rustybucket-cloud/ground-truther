export function ClassifierShortcuts() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1>Shortcuts</h1>
      <table className="border-spacing-40 w-full max-w-lg">
        <thead className="text-left">
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ctrl + i</td>
            <td>Insert new classification</td>
          </tr>
          <tr>
            <td>Ctrl + h</td>
            <td>View shortcuts</td>
          </tr>
          <tr>
            <td>1-9</td>
            <td>Assign classification</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
