import { Link } from "react-router-dom";

export function Header() {
  return (
    <>
      <header className="ranchers-regular">
        <Link to="/" className="header-class">
          Digital Diary
        </Link>
      </header>
    </>
  );
}
