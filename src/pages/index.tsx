import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router) return; //wait until router is loaded, fix for error
    router.replace("/dashboard");
  }, [router]);

  return null;
};

export default Home;
