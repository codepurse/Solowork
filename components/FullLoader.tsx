export default function FullLoader() {
  const count = 20;
  return (
    <div className="full-loader-wrapper">
      <div className="loader-container">
        <ul>
          {Array.from({ length: count }).map((_, index) => (
            <li key={index}></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
