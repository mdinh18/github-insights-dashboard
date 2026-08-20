import {useState, useEffect} from "react"

const STORAGE_KEY = "github-pat";

export function useGitHubToken(){
    const [token, setToken] = useState<string>(() => {
        return localStorage.getItem(STORAGE_KEY) ?? "";
    });

    useEffect(() => {
        if(token){
            localStorage.setItem(STORAGE_KEY, token);
        }else{
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [token]);

    function clearToken() {
        setToken("");
    }

    return { token, setToken, clearToken };
}