import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const NewBlog = () => {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Anonymous');
    const [body, setBody] = useState('');
    const [isPending, setPending] = useState(false);
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        setPending(true);
        const blog = {title, body, author};
        fetch('http://localhost:8000/data',{
            method:'POST',
            headers:{"content-type":"application/json"},
            body: JSON.stringify(blog)
        })
        .then(() => {
            setPending(false);
            history.push('/');
        })
    }

    return (
        <div className="newblog">
            <h2>New Blog</h2>
            <form onSubmit={handleSubmit}>
                <label>Blog Title</label>
                <input 
                    type="text" 
                    required 
                    value = {title}
                    onChange={(e)=>setTitle(e.target.value)} 
                />
                <label>Blog Body</label>
                <textarea
                    value={body}
                    required 
                    onChange={(e)=>setBody(e.target.value)} 
                ></textarea>
                <label>Blog Author</label>
                <select
                    value={author}
                    required 
                    onChange={(e)=>setAuthor(e.target.value)} 
                >
                    <option value="Sitanshu">Sitanshu</option>
                    <option value="Rahul">Rahul</option>
                    <option value="Anonymous">Anonymous</option>
                </select>
                {!isPending && <button className="submit">Add Blog</button>}
            </form>
            
        </div>
    );
}
 
export default NewBlog;