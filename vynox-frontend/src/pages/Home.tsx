import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <div>home</div>
      <Link to={"/user/login"}>Login</Link>
    </>
  )
}

export default Home