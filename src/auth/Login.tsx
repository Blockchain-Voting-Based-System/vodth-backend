import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

const SignInWithGoogle = () => {

    const [user, setUser] = useState<User | null>(null);

    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result.user);
                console.log(result.user)
            })
            .catch((error) => console.log(error));
    };
    const handleLogout = () => {
        setUser(null);
        auth.signOut();
    }

    useEffect(()=>{
        console.log(user)
    },[user])

    return (
        <div>
            {!user && (
                <img
                    className="btn"
                    onClick={() => handleLogin()}
                    src="https://media.geeksforgeeks.org/wp-content/uploads/20240520175106/Google_SignIn_Logo.png"
                    alt="NA"
                />
            )}
            {user  && (
                <>
                    <div className="user">
                        <h1>Your Successfully Loged In</h1>
                        <h2>Name: {user.displayName ?? "N/A"}</h2>
                        <h2>Email: {user.email}</h2>
                        <img src={user.photoURL ?? "https://avatars.githubusercontent.com/u/109834020?v=4"} />
                        <button onClick={() => handleLogout()} className="logout">Log Out</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SignInWithGoogle;
