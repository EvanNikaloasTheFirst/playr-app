import Navbar from "@/components/Utils/Navbar";
import { useSession, signIn } from "next-auth/react";

export default function performances(){

     const { data: session } = useSession();
    
    return (
    <div>
        <Navbar/>

    </div>)
}