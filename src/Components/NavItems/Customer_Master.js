import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'

const INSERT_CUSTOMER = gql`
mutation MyMutation( $contact_person: String = "", $email_id: String = "", $gst_no: String = "", $mobile_no: String = "", $name: String = "", $pan: String = "", $res_address: String = "") {
    insert_customer_master_one(object: {contact_person: $contact_person, email_id: $email_id, gst_no: $gst_no, mobile_no: $mobile_no, name: $name, pan: $pan, res_address: $res_address}) {
      id
    }
  }  
`
const READ_CUSTOMER = gql`
subscription MySubscription($_eq: String = "false"){
    customer_master(where: {isDeleted: {_eq: $_eq}}){ 
      contact_person
      email_id
      gst_no
      id
      mobile_no
      name
      pan
      res_address
    }
  }
  
`
const UPDATE_CUSTOMER = gql`
mutation MyMutation($id: Int = 10, $contact_person: String = "",  $email_id: String = "", $gst_no: String = "", $mobile_no: String = "", $name: String = "", $pan: String = "", $res_address: String = "") {
    update_customer_master_by_pk(pk_columns: {id: $id}, _set: {cities: $cities, contact_person: $contact_person, email_id: $email_id, gst_no: $gst_no, mobile_no: $mobile_no, name: $name, pan: $pan, res_address: $res_address}) {
      id
    }
  }
  
`

// const DELETE_CUSTOMER = gql`
// mutation MyMutation($id: Int = 10) {
//     delete_customer_master_by_pk(id: $id) {
//       id
//     }
//   }
  
// `

const DELETE_CUSTOMER = gql`
mutation MyMutation($isDeleted: String = "", $id: Int = 0) {
    update_customer_master_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }
  
`
const READ_LOCATION = gql`
query MyQuery {
    location_master{
      city
      country
      id
      state
      taluka
      district
      cityByCity {
        id
        name
        state_id
      }
      countryByCountry {
        id
        name
        phonecode
        sortname
      }
      stateByState {
        country_id
        id
        name
      }
    }
  }  
`






export default function Customer_Master() {
    const [customValidity, setCustomValidity] = useState();
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState();
    const [contact_person, setContact_person] = useState();
    const [mobile_no, setMobile_no] = useState();
    const [email_id, setEmail_id] = useState();
    const [gst_no, setGst_no] = useState();
    const [pan, setPan] = useState();
    const [res_address, setRes_address] = useState();
    

    const [modalId, setModalId] = useState();
    const [modalName, setModalName] = useState();
    const [modalContact_person, setModalContact_person] = useState();
    const [modalMobile_no, setModalMobile_no] = useState();
    const [modalEmail_id, setModalEmail_id] = useState();
    const [modalGst_no, setModalGst_no] = useState();
    const [modalPan, setModalPan] = useState();
    const [modalRes_address, setModalRes_address] = useState();
    

    //Queries
    const [insert_customer] = useMutation(INSERT_CUSTOMER);
    const [update_customer] = useMutation(UPDATE_CUSTOMER);
    const [delete_customer] = useMutation(DELETE_CUSTOMER);
    const read_customer = useSubscription(READ_CUSTOMER);
    //Loader
    if (read_customer.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;

    // const onInputChange = (e) => {
    //     setCustomer({ ...customer, [e.target.name]: e.target.value });
    // }
    const onNameChange = (e) => {
        setName(e.target.value);
    }
    const onContact_personChange = (e) => {
        setContact_person(e.target.value);
    }
    const onMobile_noChange = (e) => {
        setMobile_no(e.target.value);
    }
    const onEmail_idChange = (e) => {
        setEmail_id(e.target.value);
    }
    const onGst_noChange = (e) => {
        setGst_no(e.target.value);
    }
    const onPanChange = (e) => {
        setPan(e.target.value);
    }
    
    const onRes_addressChange = (e) => {
        setRes_address(e.target.value);
    }
    //Modal Form Data
    const onModalIdChange = (e) => {
        setModalId(e.target.value);
    }
    const onModalNameChange = (e) => {
        setModalName(e.target.value);
    }
    const onModalContact_personChange = (e) => {
        setModalContact_person(e.target.value);
    }
    const onModalMobile_noChange = (e) => {
        setModalMobile_no(e.target.value);
    }
    const onModalEmail_idChange = (e) => {
        setModalEmail_id(e.target.value);
    }
    const onModalGst_noChange = (e) => {
        setModalGst_no(e.target.value);
    }
    const onModalPanChange = (e) => {
        setModalPan(e.target.value);
    }
    
    const onModalRes_addressChange = (e) => {
        setModalRes_address(e.target.value);
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        //console.log(customer);
        insert_customer({ variables: { name: name, res_address: res_address, contact_person: contact_person, mobile_no: mobile_no, email_id: email_id, gst_no: gst_no, pan: pan } })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit = (row) => {
        handleShow();
        setModalId(row.id)
        setModalName(row.name)
        setModalContact_person(row.contact_person)
        setModalMobile_no(row.mobile_no)
        setModalEmail_id(row.email_id)
        setModalGst_no(row.gst_no)
        setModalPan(row.pan)
        setModalRes_address(row.res_address)
    }
    // const onModalInputChange = (e) => {
    //     setModalCustomer({ ...modalCustomer, [e.target.name]: e.target.value })
    // }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_customer({ variables: { id: modalId, name: modalName, res_address: modalRes_address, contact_person: modalContact_person, mobile_no: modalMobile_no, email_id: modalEmail_id, gst_no: modalGst_no, pan: modalPan } })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete = (id) => {
        delete_customer({ variables: { id: id } })
        toast.configure();
        toast.error('Successfully Deleted')
    }
    const columns = [
        {
            field: 'sno',
            headerName: 'Serial No',
            width: 150,
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 160,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 160
        },
        
        {
            field: 'mobile_no',
            headerName: 'Mobile Number',
            width: 190
        },
        {
            field: 'email_id',
            headerName: 'Email ID',
            width: 160
        },
        {
            field: 'contact_person',
            headerName: 'Contact Person',
            width: 190
        },
        {
            field: 'gst_no',
            headerName: 'GST Number',
            width: 160
        },
        {
            field: 'pan',
            headerName: 'PAN Number',
            width: 160
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button onClick={() => onEdit(params.row)} data-toggle="tooltip" title="Edit" type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"></i></button>
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
    ];
    const rows = read_customer.data.customer_master;
    let newData=[]
    rows.map((item,index)=>{
        newData.push({sno:index+1,...item})
    })
    //console.log(rows);
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={onModalFormSubmit} className="form-group">
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">ID</label>
                                <input defaultValue={modalId} onChange={onModalIdChange} className="form-control mt-1" name="id" type="text" required />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Name</label>
                                <input defaultValue={modalName} onChange={onModalNameChange} className="form-control mt-1" name="name" type="text" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                            </div>
                        </div>

                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Contact Person</label>
                                <input defaultValue={modalContact_person} onChange={onModalContact_personChange} className="form-control mt-1" name="contact_person" type="text" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Mobile Number</label>
                                <input defaultValue={modalMobile_no} onChange={onModalMobile_noChange} className="form-control mt-1" name="mobile_no" type="tel" required pattern="[789][0-9]{9}" title="Please enter valid mobile no" />
                            </div>
                        </div>
                        <div className="row">

                            <div className="field col-md-6">
                                <label className="required">Email ID</label>
                                <input defaultValue={modalEmail_id} onChange={onModalEmail_idChange} className="form-control mt-1" name="email_id" type="email" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" title="Please enter valid email address" required />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">PAN Number</label>
                                <input defaultValue={modalPan} onChange={onModalPanChange} className="form-control mt-1" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Please enter valid pan" name="pan" type="text" required />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">GST Number</label>
                                <input defaultValue={modalGst_no} onChange={onModalGst_noChange} className="form-control mt-1" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Please enter valid pan" name="pan" type="text" required />
                            </div>
                        </div>
                        <div className="row">
                            
                            <div className="field col-md-6">
                                <label className="required">Resident Address</label>
                                <input defaultValue={modalRes_address} onChange={onModalRes_addressChange} className="form-control" name="res_address" type="text" />
                            </div>
                        </div>
                        <br />
                        <div className="field">
                            <button className="btn btn-primary"style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>
                        </div>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <h4 className="text-center">CUSTOMER MASTER</h4>

                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Name</label>
                            <input placeholder="enter name" onChange={onNameChange} type="text" name="name" className="form-control mt-1" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                            <span ></span>
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Contact Person</label>
                            <input onChange={onContact_personChange} placeholder="enter contact person" type="text" name="contact_person" className="form-control mt-1" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Mobile Number</label>
                            <input onChange={onMobile_noChange} placeholder="enter mobile number" type="tel" name="mobile_no" className="form-control mt-1" required pattern="[789][0-9]{9}" title="Please enter valid mobile no" />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Email ID</label>
                            <input onChange={onEmail_idChange} placeholder="enter email id" type="email" name="email_id" className="form-control mt-1" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" title="Please enter valid email address" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">GST Number</label>
                            <input onChange={onGst_noChange} placeholder="enter gst number" type="text" name="gst_no" className="form-control mt-1" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Please enter valid gstin" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">PAN Number</label>
                            <input onChange={onPanChange} placeholder="enter pan number" type="text" name="pan" className="form-control mt-1" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Please enter valid pan" required />
                        </div>
                    </div><br />
                    {/* <h5 style={{ textAlign: 'center' }}>Address</h5> */}
                    {/* <div className="row">
                        <div className="field col-md-4">
                            <label className="required">Country</label>
                            
                            <Select
                                name="country"
                                options={read_countries.data.countries}
                                onChange={onCountryChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">State</label>
                           
                            <Select
                                name="state"
                                options={read_states.data.states}
                                onChange={onStateChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">City</label>
                            
                            <Select
                                name="city"
                                options={read_cities.data.cities}
                                onChange={onCityChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                    </div><br /> */}
                    <div className="row">
                        
                        <div className="field col-md-6">
                            <label className="required">Residential Address</label>
                            <input onChange={onRes_addressChange} type="text" name="res_address" className="form-control" placeholder="enter residential address"/>
                        </div>
                    </div><br />
                    <br />
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>

                        <button className="btn btn-primary" type="reset"style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Reset</button>
                        <br />
                        <br />

                    </div>
                    <br />
                </form>
            </Card>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>

                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={newData} 
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection={false}
                        disableSelectiononChange
                        components={{
                            Toolbar: GridToolbar,
                          }}
                    />
                </div>
            </Card>
        </div>
    )
}
