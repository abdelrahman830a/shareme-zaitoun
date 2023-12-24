import logo from '../assets/logowhite.png'
import shareVideo from '../assets/share.mp4'
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { jwtDecode } from "jwt-decode";
import { client } from '../client';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const responseDecoded = jwtDecode(response.credential);

     localStorage.setItem('user', JSON.stringify(responseDecoded));

    const {name, picture, sub} = responseDecoded;
    
    

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,

    }
    client.createIfNotExists(doc)
    .then(() => {
      navigate('/', {replace: true})
    })
  
}

  return (
    <div className="flex justify-start items-center flex-col h-screen hide-scrollbar">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              render={(renderProps) => (
                <button 
                type='button'
                onClick={renderProps.onClick} disabled={renderProps.disabled} className="bg-white text-black px-5 py-3 rounded-lg cursor-pointer outline-none shadow-md">
                  <FcGoogle className="inline-block mr-2" />
                  Login with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onError={responseGoogle}
              cookiePolicy={'single_host_origin'}
           />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;