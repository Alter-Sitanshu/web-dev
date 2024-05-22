import { useHistory, useParams } from "react-router-dom";
import useFetch from "./useFetch";

const BlogDetails = () => {
    const history = useHistory();
    const { id } = useParams();
    const {data:blog, isPending, err} = useFetch('http://localhost:8000/data/'+id);
    const handleDelete = () => {
        fetch('http://localhost:8000/data/'+id,{
            method:'DELETE'
        }).then(() => {
            history.push('/');
        })
    }
    return (
        <div className="blog_detail">
            {isPending && <div className="loader">Loading....</div>}
            {err && <div className="loader">Error Occured While Fetching Data</div>}
            {blog && (
                <div className="expanded_blog">
                    <article>
                        <h2>{blog.title}</h2>
                        <p>Written By - {blog.author}</p>
                        <div className="blog_body">{blog.body}</div>
                    </article>
                    <button className="delete" onClick={handleDelete}>Delete</button>
                </div>)}
        </div>
    );
}
 
export default BlogDetails;