import React,{useState} from 'react';
import { useHistory } from 'react-router';
import auth from '../auth';
import {
    useQuery,
    gql,
    useMutation
  } from "@apollo/client";
//import Header from '../components/Header';

const LOGIN_MUTATION = gql`
query MyQuery {
    User {
      username
      password
      role
    }
  }
`;

const Login=() =>
{
    const history = useHistory();
    const [formState, setFormState] = useState({
        username:'',
        password: '',
        role:''
    });
    const {loading,error,data} = useQuery(LOGIN_MUTATION);
    //console.log(data.User);
    const FormSubmit=(e)=>
    {
        e.preventDefault();
        //console.log(formState);
        Array.isArray(data.User) && data.User.map((user)=>{
            if(formState.username === user.username && formState.password === user.password)
            {
                //console.log("-----------------"+localStorage.getItem("authenticated"));
                auth.login(()=>{
                    localStorage.setItem("userrole",user.role)
                    localStorage.setItem("userdata",formState.username);
                    history.push("/Dashboard")
                })
                //console.log("-----------------"+localStorage.getItem("authenticated"));
            }
            else
            {
                console.log("Fail");
            }
        })
    }
    
    
    const onInputChange=(e)=>{
        setFormState({...formState,[e.target.name]:e.target.value})
    }
    //const authToken = localStorage.getItem(AUTH_TOKEN);
    
    //console.log(data)
    return (
        // <div className="container">
        //     <div>
        //         <form onSubmit={(e)=>{FormSubmit(e)}}>
        //         <div class="form-group">
        //             <label>Username</label>
        //             <input type="text" defaultValue={formState.username} onChange={(e)=>{onInputChange(e)}} name="username" className="form-control" placeholder="Enter Username" />
        //         </div>
        //         <div class="form-group">
        //             <label>Password</label>
        //             <input type="text" defaultValue={formState.password} onChange={(e)=>{onInputChange(e)}} name="password" className="form-control" placeholder="Enter Password" />
        //         </div>
        //         <button type="submit" class="btn btn-primary">Submit</button>
        //         </form>
        //     </div>
        // </div>
        <section class="vh-100">
  <div class="container-fluid h-custom">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbootstrap.com/img/Photos/new-templates/bootstrap-login-form/draw2.png" class="img-fluid"
          alt="Sample image" />
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form onSubmit={(e)=>{FormSubmit(e)}}>
          {/* <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
            <p class="lead fw-normal mb-0 me-3">Sign in with</p>
            <button type="button" class="btn btn-primary btn-floating mx-1">
              <i class="fab fa-facebook-f"></i>
            </button>

            <button type="button" class="btn btn-primary btn-floating mx-1">
              <i class="fab fa-twitter"></i>
            </button>

            <button type="button" class="btn btn-primary btn-floating mx-1">
              <i class="fab fa-linkedin-in"></i>
            </button>
          </div> */}

          {/* <div class="divider d-flex align-items-center my-4">
            <p class="text-center fw-bold mx-3 mb-0">Or</p>
          </div> */}

        
          <div class="form-outline mb-4">
            <label class="form-label" for="form3Example3">Username</label>
            <input  defaultValue={formState.username} onChange={(e)=>{onInputChange(e)}} name="username" class="form-control form-control-lg"
              placeholder="Enter a valid username" />
          </div>

       
          <div class="form-outline mb-3">
            <label class="form-label" for="form3Example4">Password</label>
            <input type="text" defaultValue={formState.password} onChange={(e)=>{onInputChange(e)}} name="password" class="form-control form-control-lg"
              placeholder="Enter password" />
          </div>

          
          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="submit" class="btn btn-primary btn-lg"
              style={{paddingLeft: "2.5rem", paddingRight: "2.5rem"}}>Login</button>
            {/* <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!"
                class="link-danger">Register</a></p> */}
          </div>

        </form>
      </div>
    </div>
  </div>
  {/* <div class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
    
    <div class="text-white mb-3 mb-md-0">
      Copyright © 2020. All rights reserved.
    </div>
    
    <div>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-facebook-f"></i>
      </a>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="#!" class="text-white me-4">
        <i class="fab fa-google"></i>
      </a>
      <a href="#!" class="text-white">
        <i class="fab fa-linkedin-in"></i>
      </a>
    </div>
    
  </div> */}
</section>
        
    )
}

export default Login;