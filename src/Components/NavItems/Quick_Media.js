import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'
import { CSVLink, CSVDownload } from "react-csv";

const INSERT_QUICK_MEDIA=gql`
mutation MyMutation($inquiry: Int = 0, $mobile_no: String = "",$proposal_no:Int!) {
    insert_quick_media_one(object: {inquiry: $inquiry, mobile_no: $mobile_no,proposal_no:$proposal_no}) {
      id
    }
  }
`

// const DELETE_QUICK_MEDIA=gql`
// mutation MyMutation($id: Int = 0) {
//     delete_quick_media_by_pk(id: $id) {
//       id
//     }
//   }
  
// `

const DELETE_QUICK_MEDIA=gql`
mutation MyMutation($id: Int = 0, $isDeleted: String = "true") {
    update_quick_media_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }
  
`
const READ_QUICK=gql`
subscription MySubscription($_eq: String = "false"){
    quick_media(where: {isDeleted: {_eq: $_eq}}) {
      inquiry
      inquiry_master {
        id
        Inventory_Master {
          Location
        }
      }
      id
      mobile_no
      proposal_no
    }
  }
  
`
const SEARCH_INQUIRY=gql`
query MyQuery($number: String!, $_eq: String = "false") {
    inquiry_master(where: {number: {_eq: $number}, isDeleted: {_eq: $_eq}}) {
      Inventory_Master {
        AvailabilityFrom
        AvailabilityTo
        City_Village
        Country
        DisplayRatePM
        District
        DrpmRate
        Height
        Illumination
        Location
        Media_Type
        NoofDisplay
        OneTimeMountingCost
        OneTimePrintingCost
        OtmcRate
        OtpcRate
        State
        Status
        Taluka
        Total
        Totalsqft
        Width
        city {
          id
          name
          state_id
        }
        country {
          id
          name
          phonecode
          sortname
        }
        hoarding_insurance
        id
        media_type_master {
          id
          media_type
        }
        state {
          country_id
          id
          name
        }
      }
      email_id
      id
      inventory
      media_type
      media_type_master {
        id
        media_type
      }
      name
      number
      sol
      start_date
      status
      whatsapp_number
    }
  }
    
`
const GET_MOBILE=gql`
query MyQuery($mobile_no: String!, $_eq: String = "false") {
    quick_media(where: {mobile_no: {_eq: $mobile_no}, isDeleted: {_eq: $_eq}}) {
      id
      inquiry
      mobile_no
      proposal_no
    }
  }
  
  
  
`

function Quick_Media() {
    //States
    const [get_data,setGet_data] = useState();
    const [mobile_no,setMobile_no] = useState();
    const [selected,setSelected] = useState();
    //Queries
    const [delete_quick_media] = useMutation(DELETE_QUICK_MEDIA);
    const [insert_quick_media] = useMutation(INSERT_QUICK_MEDIA);
    const [search_inquiry,return_inquiry] = useLazyQuery(SEARCH_INQUIRY);
    const [get_mobile,mobile_no_exists] = useLazyQuery(GET_MOBILE,{
        onCompleted: data => {
            console.log('data ', data);
            setGet_data(data);
          }
    });
    const read_quick = useSubscription(READ_QUICK)
    //functions
    const onSearch=(e)=>{
        e.preventDefault();
        //console.log(e.target[0].value)
        get_mobile({variables:{mobile_no:e.target[0].value}})
        search_inquiry({variables:{number:e.target[0].value}})
    }
    const onMobileNoChange=(e)=>{
        setMobile_no(e.target.value);
    }
    const saveData=(e)=>{
        console.log(get_data.quick_media);
        // if(get_data.quick_media)
        // {
        //     var counter = "";
        // }
        // else
        // {
        //     var counter=get_data.quick_media.at(-1);
        // }
        //console.log(get_data.quick_media==="[]"?"":console.log("Hello"));
        //console.assert()
        
        console.log(get_data===undefined?"":get_data.quick_media.at(-1))
        const counter=get_data.quick_media===undefined?"":get_data.quick_media.at(-1)
        console.log(counter);
        if(counter==="")
        {
            var counter_proposal=0;
        }
        else
        {
            var counter_proposal=counter.proposal_no
        }
        for(var i=0;i<selected.length;i++)
        {
            insert_quick_media({variables:{inquiry:selected[i],mobile_no:mobile_no,proposal_no:counter_proposal+1}});
        }
        
    }
    const onDelete=(id)=>{
        delete_quick_media({variables:{id:id}})
        toast.configure();
        toast.error('Successfully Deleted')
    }
    //Loader
    if (return_inquiry.loading||read_quick.loading||mobile_no_exists.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    const emptyarr = [
        {
            id:"",
            number:"",
            name:"",
            sol:"",
            start_date:"",
            status:"",
            whatsapp_number:"",
            Inventory_Master:
            {
                id:"",
                AvailabilityFrom: "",
                AvailabilityTo: "",
                City_Village: "",
                Country: "",
                DisplayRatePM: "",
                District: "",
                DrpmRate: "",
                Height: "",
                Illumination: "",
                Location: "",
                Media_Type: "",
                NoofDisplay: "",
                OneTimeMountingCost: "",
                OneTimePrintingCost: "",
                OtmcRate: "",
                OtpcRate: "",
                State: "",
                Taluka: "",
                Total: "",
                Totalsqft: "",
                Width: "",
                city:{
                    id: "",
                    name: ""
                },
                country:{
                    id: "",
                    name: ""
                },
                media_type_master:{
                    id: "",
                    media_type: ""
                },
                state:{
                    id: "",
                    name: ""
                }
            }
        }
    ]
    //console.log("-------------------------------",mobile_no_exists===undefined?"":mobile_no_exists.data);
    
    var rows = emptyarr;
    //console.log(data);
    if(return_inquiry.data)
    {
       rows=return_inquiry.data.inquiry_master;
    }
    const rows1=read_quick.data.quick_media;
    let newData1 = []
    rows1.map((item, index) => {
        newData1.push({ sno: index + 1, ...item })
    })
    const columns1=[
        {
            field: 'sno',
            headerName: 'Serial No',
            width: 150,
        },
        {
            field:'id',
            headerName:'ID',
            width:200
        },
        {
            field:'mobile_no',
            headerName:'Mobile No',
            width:200
        },
        {
            field: 'inventory',
            headerName: 'Location',
            width: 190,
            valueGetter: (params) => {
                return params.row.inquiry_master.Inventory_Master.Location;
            }
        },
        {
            field:'proposal_no',
            headerName:'Proposal No',
            width:200
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="">
                        {/* <button onClick={() => onDownload(params.row)} data-toggle="tooltip" title="Download" type="button" className="btn btn-primary"  ><i className="bi bi-pencil-fill"></i></button> */}
                        <button onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }} data-toggle="tooltip" title="Delete" style={{ marginLeft: '20%' }} className="btn btn-danger" ><i className="bi bi-trash-fill"></i></button>
                    </div>
                );
            }
        },
        
    ]
    const columns=[
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 200 
        },
        { 
            field: 'name', 
            headerName: 'Name', 
            width: 200 
        },
        { 
            field: 'number', 
            headerName: 'Number', 
            width: 200 
        },
        { 
            field: 'sol', 
            headerName: 'Source Of Lead', 
            width: 200 
        },
        { 
            field: 'sol', 
            headerName: 'Source Of Lead', 
            width: 200 
        },
        { 
            field: 'start_date', 
            headerName: 'Start Date', 
            width: 200 
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 200 
        },
        { 
            field: 'whatsapp_number', 
            headerName: 'Whatsapp Number', 
            width: 200 
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.country.name;
            }
        },
        {
            field: 'state',
            headerName: 'State',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.state.name;
            }
        },
        {
            field: 'city',
            headerName: 'City',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.city.name;
            }
        },
        {
            field: 'media',
            headerName: 'Media',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.media_type_master.media_type;
            }
        },
        {
            field: 'Illumination',
            headerName: 'Illumination',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.Illumination;
            }
        },
        {
            field: 'Width',
            headerName: 'Width',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.Width;
            }
        },
        {
            field: 'Height',
            headerName: 'Height',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.Height;
            }
        },
        {
            field: 'NoofDisplay',
            headerName: 'No Of Display',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.NoofDisplay;
            }
        },
        {
            field: 'TotalSqft',
            headerName: 'Total Sq Ft',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.Totalsqft;
            }
        },
        {
            field: 'DrpmRate',
            headerName: 'DRPM Rate',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.DrpmRate;
            }
        },
        {
            field: 'inventory',
            headerName: 'Location',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.Location;
            }
        },
        {
            field: 'availability_from',
            headerName: 'Availability From',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.AvailabilityFrom;
            }
        },
        {
            field: 'availability_to',
            headerName: 'Availability To',
            width: 190,
            valueGetter: (params) => {
                return params.row.Inventory_Master.AvailabilityTo;
            }
        },
        
    ]
    return (
        <div>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "4%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <form className="form-group" onSubmit={onSearch}>
                    <h4 className="text-center">Quick Media Proposal</h4><br />
                    <div className="row">
                        <div className="field col-md-4"></div>
                        <div className="field col-md-4">
                            <label className="required">Mobile Number</label>
                            <input onChange={onMobileNoChange} type="text" className="form-control" />
                        </div>
                        <div className="field col-md-4"></div><br />
                    </div><br />
                    <div className="row">
                        <div className="field col-md-4"></div>
                        <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Search</button>
                        <div className="field col-md-4"></div>
                    </div>
                </form><br />
                <div style={{ height: 500, width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection={true}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        onSelectionModelChange={itm => setSelected(itm)}
                        
                    />
                    <button className="btn btn-primary" onClick={saveData} style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>
                    <br/>
                </div>
            </Card>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <div style={{ height: 500, width: '100%'}}>
                <DataGrid
                    rows={newData1}
                    columns={columns1}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection={true}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                        
                        
                    /> 
                </div>
            </Card>
        </div>
    )
}

export default Quick_Media