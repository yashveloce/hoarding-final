import React from 'react'

function Login() {
    return (
        <div>
            <form>
                <div class="form-group">
                    <label>Username:</label>
                    <input type="text" class="form-control" placeholder="Enter username" id="username" />
                </div>
                <div class="form-group">
                    <label for="pwd">Password:</label>
                    <input type="password" class="form-control" placeholder="Enter password" id="password" />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
