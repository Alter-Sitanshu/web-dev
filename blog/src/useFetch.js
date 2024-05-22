import { useEffect, useState } from "react";

const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setPending] = useState(true);
    const [err, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            fetch(url)
            .then((response) => {
                if(!response.ok){
                    setPending(false);
                    throw Error('Could Not Fetch')
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setPending(false);
                setError(null);
            })
            .catch((err) => {
                if(err.name === 'AbortError'){
                    console.log('Fetch Aborted');
                }else{
                    setPending(false);
                    setError(err.message);
                }
            })
        },1000);
    },[url])
    return {data, isPending, err}
}

export default useFetch;