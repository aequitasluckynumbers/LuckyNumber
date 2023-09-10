export function Loader() {
  return (
    <div className="loader-main">
      {[...Array(8).keys()].map((_, key) => (
        <span key={key}></span>
      ))}
    </div>
  );
}
