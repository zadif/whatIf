export function Card(props) {
  let { username, prompt, response, tone, type, likeCount, created_at } = props;

  function formatDateToRelative(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();

    // Normalize to midnight (ignore hours/mins/seconds)
    const inputDay = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate()
    );
    const todayDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const diffMs = todayDay - inputDay;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    return `${diffDays} days ago`;
  }
  return (
    <>
      <>
        <h2>{username}</h2>
        <h3>Prompt: {prompt}</h3>
        <h3>Response: {response}</h3>
        <h3>
          {tone} {type}{" "}
        </h3>
        <br />

        <button>{likeCount} likes </button>

        <br />
        <br />
        <p> {formatDateToRelative(created_at)} </p>
      </>
    </>
  );
}
