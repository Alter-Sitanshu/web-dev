
import BlogList from "./BlogList";
import useFetch from "./useFetch";

const Home = () => {
    const {data: blogs, isPending, err} = useFetch('http://localhost:8000/data');
    return (
        <div className="home_list">
            {isPending && <div className="loader">Loading....</div>}
            {err && <div className="loader">Error Occured While Fetching Data</div>}
            {blogs && <div className="home">
                <BlogList blogs={blogs} title='All Blogs'/>
                <BlogList blogs={blogs.filter((blog) => blog.author==='Sitanshu')} title='My Blogs'/>
            </div>}
        </div>
    );
}
 
export default Home;