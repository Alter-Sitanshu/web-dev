import { Link } from "react-router-dom/";

const Navbar = () => {
    return (
        <div className="nav">
            <h1>BLOG HOOK</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/create">New Blogs</Link>
            </div>
        </div>
    );
}
 
export default Navbar;