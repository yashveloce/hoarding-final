import React, { Component } from "react";
import { Route, Redirect } from "react-router";
import auth from "./auth";

export const ProtectedRoute=({component:Component,...rest})=>{
    const auth = localStorage.getItem("authenticated");
    // console.log("=================================="+auth)
   
    return (
        <Route
        {...rest}
        render={props=>{
            // console.log("Success")
            // console.log("=================================="+auth)
            // auth ? return (<Component {...props} />) : return(
            //     <Redirect
            //     to={{
            //         pathname:"/",
            //         state:{
            //             from:props.location
            //         }
            //     }} />
            // )

            if (auth==="true"){
                //console.log("Login")
                return <Component {...props} />
            }
            else
            {
                return(
                    <Redirect
                    to={{
                        pathname:"/hoarding-final/Login",
                        state:{
                            from:props.location
                        }
                    }} />
                )
            }
        }} />
    )
}