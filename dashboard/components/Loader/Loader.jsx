export function Loader() {
  return (
    <div class="loader-main">
      {[...Array(8).keys()].map((_, key) => (
        <span key={key}></span>
      ))}
    </div>
  );
}
