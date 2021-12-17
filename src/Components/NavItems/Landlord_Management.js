import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';


const getlandloard_Master = gql`
subscription MySubscription($_eq: String = "false"){
    landlord_management(where: {isDeleted: {_eq: $_eq}}){
      account_no
      address
      agreement_from
      agreement_to
      bank_name
      branch_name
      height
      id
      ifsc
      location
      mobile_number
      name
      rent_amount
      rent_increment_reminder
      site_address
    
      width
    }
  }
`


const Insertlanloard_Master = gql`
mutation MyMutation($account_no: String = "", $address: String = "", $agreement_from: date!, $agreement_to: date!, $bank_name: String = "", $branch_name: String = "", $height: String = "", $ifsc: String = "", $location: String = "", $mobile_number: String = "", $name: String = "", $rent_amount: String = "", $rent_increment_reminder: String = "", $site_address: String = "", $width: String = "") {
    insert_landlord_management_one(object: {account_no: $account_no, address: $address, agreement_from: $agreement_from, agreement_to: $agreement_to, bank_name: $bank_name, branch_name: $branch_name, height: $height, ifsc: $ifsc, location: $location, mobile_number: $mobile_number, name: $name, rent_amount: $rent_amount, rent_increment_reminder: $rent_increment_reminder, site_address: $site_address,  width: $width}) {
      id
    }
  }
`

const Updatelandloard_Master = gql`
mutation MyMutation($id: Int = 0, $account_no: String = "", $address: String = "", $agreement_from: date = "", $agreement_to: date = "", $bank_name: String = "", $branch_name: String = "", $height: String = "", $id1: Int = 10, $ifsc: String = "", $location: String = "", $mobile_number: String = "", $name: String = "", $rent_amount: String = "", $rent_increment_reminder: String = "", $site_address: String = "", $width: String = "") {
    update_landlord_management_by_pk(pk_columns: {id: $id}, _set: {account_no: $account_no, address: $address, agreement_from: $agreement_from, agreement_to: $agreement_to, bank_name: $bank_name, branch_name: $branch_name, height: $height, ifsc: $ifsc, location: $location, mobile_number: $mobile_number, name: $name, rent_amount: $rent_amount, rent_increment_reminder: $rent_increment_reminder, site_address: $site_address,width: $width}) {
      account_no
      address
      agreement_from
      agreement_to
      bank_name
      branch_name
      height
      id
      ifsc
      location
      mobile_number
      name
      rent_amount
      rent_increment_reminder
      site_address
      
      width
    }
  }
  

`
const Deletelandloard_Master = gql`
mutation MyMutation($id: Int = 10, $isDeleted: String = "true") {
    update_landlord_management_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }  
`
// const Deletelandloard_Master=gql`

// mutation MyMutation($id: Int = 10) {
//     delete_landlord_management_by_pk(id: $id) {
//       account_no
//       address
//       agreement_from
//       agreement_to
//       bank_name
//       branch_name
//       height
//       id
//       ifsc
//       location
//       mobile_number
//       name
//       rent_amount
//       rent_increment_reminder
//       site_address

//       width
//     }
//   }
// `






function Landloard_Management() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [landloard, setlandloard] = useState({
        name: '',
        address: '',
        mobile_number: '',
        location: '',
        bank_name: '',
        branch_name: '',
        ifsc: '',
        account_no: '',
        rent_amount: '',
        width: '',
        height: '',
        site_address: '',
        agreement_from: '',
        agreement_to: '',
        rent_increment_reminder: '',


    });

    const [modallandloard, setModallandloard] = useState({
        id: '',
        name: '',
        address: '',
        mobile_number: '',
        location: '',
        bank_name: '',
        branch_name: '',
        ifsc: '',
        account_no: '',
        rent_amount: '',
        width: '',
        height: '',
        site_address: '',
        agreement_from: '',
        agreement_to: '',
        rent_increment_reminder: '',

    });

    const [Insert_landloardmanagementData] = useMutation(Insertlanloard_Master);
    const [update_landloardmanagementData] = useMutation(Updatelandloard_Master);
    const [delete_landloardmanagementData] = useMutation(Deletelandloard_Master);

    const onModalInputChange = (e) => {
        setModallandloard({ ...modallandloard, [e.target.name]: e.target.value })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_landloardmanagementData({ variables: modallandloard })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onInputChange = (e) => {
        setlandloard({ ...landloard, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(landloard)
        Insert_landloardmanagementData({ variables: landloard })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onDelete = (id) => {
        delete_landloardmanagementData({ variables: { id: id } })
        toast.configure();
        toast.error('Successfully Deleted')
    }
    const onEdit = (row) => {
        handleShow();
        setModallandloard({
            id: row.id,
            name: row.name,
            address: row.address,
            mobile_number: row.mobile_number,
            site_address: row.site_address,
            bank_name: row.bank_name,
            branch_name: row.branch_name,
            ifsc: row.ifsc,
            account_no: row.account_no,
            location: row.location,
            width: row.width,
            height: row.height,
            rent_amount: row.rent_amount,
            agreement_from: row.agreement_from,
            agreement_to: row.agreement_to,
            rent_increment_reminder: row.rent_increment_reminder


        })
        console.log(modallandloard);
    }
    const getlandloard_management = useSubscription(getlandloard_Master);
    if (getlandloard_management.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    if (getlandloard_management.error) {
        return "error" + getlandloard_management.error;
    }
    console.log(getlandloard_management.data);

    const columns = [
        {
            field: 'sno',
            headerName: 'Serial No',
            width: 150,
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },
        {
            field: 'name',
            headerName: 'Name ',
            width: 200,
            editable: false,
        },
        {
            field: 'address',
            headerName: 'Address ',
            width: 200,
            editable: false,
        },
        {
            field: 'mobile_number',
            headerName: 'Mobile Number ',
            width: 200,
            editable: false,
        },

        {
            field: 'site_address',
            headerName: 'Site Address',
            width: 200,
            editable: false,
        },
        {
            field: 'location',
            headerName: 'Location ',
            width: 200,
            editable: false,
        },
        {
            field: 'rent_amount',
            headerName: 'Rent Amount ',
            width: 200,
            editable: false,
        },
        {
            field: 'rent_increment_reminder',
            headerName: 'Rent Increment Remainder ',
            width: 200,
            editable: false,
        },
        {
            field: 'agreement_from',
            headerName: 'Agreement From ',
            width: 200,
            editable: false,
        },
        {
            field: 'agreement_to',
            headerName: 'Agreement To ',
            width: 200,
            editable: false,
        },


        {
            field: 'width',
            headerName: 'Width ',
            width: 200,
            editable: false,
        },
        {
            field: 'height',
            headerName: 'Height ',
            width: 200,
            editable: false,
        },
        {
            field: 'bank_name',
            headerName: 'Bank Name ',
            width: 200,
            editable: false,
        },
        {
            field: 'branch_name',
            headerName: 'Branch Name ',
            width: 200,
            editable: false,
        },
        {
            field: 'ifsc',
            headerName: 'IFSC ',
            width: 200,
            editable: false,
        },
        {
            field: 'account_no',
            headerName: 'Account Number ',
            width: 200,
            editable: false,
        },

        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "250%", textAlign: 'center' }}>
                        <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" style={{ marginRight: '10%' }} ><i className="bi bi-pencil-fill" onClick={() => { onEdit(params.row) }}></i></button>

                        <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }}><i className="bi bi-trash-fill"></i></button>

                    </div>
                );
            }
        },
    ];
    const rows = getlandloard_management.data.landlord_management;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })

    return (
        <div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Landloard Master</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={onModalFormSubmit} className="form-group" padding="2px">
                        <div className="row">
                            <div className="field col-md-3">
                                <label className="required">ID</label>
                                <input defaultValue={modallandloard.id} onChange={onModalInputChange} className="form-control mt-1" name="id" type="text" placeholder="enter id" />
                            </div>
                            <div className="field col-md-3">
                                <label className="required">landloard Name</label>
                                <input placeholder="enter name" defaultValue={modallandloard.name} onChange={onModalInputChange} type="text" name="name" className="form-control mt-1" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                                <span ></span>
                            </div>
                            <div className="field col-md-3">
                                <label className="required">landloard Address</label>
                                <input placeholder="enter address" defaultValue={modallandloard.address} onChange={onModalInputChange} type="text" name="address" className="form-control mt-1" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                            </div>
                            <div className="field col-md-3">
                                <label className="required">Mobile Number</label>
                                <input placeholder="enter contact " defaultValue={modallandloard.mobile_number} onChange={onModalInputChange} type="text" name="mobile_number" className="form-control mt-1" required />
                            </div>
                        </div><br />
                        <div className="row">

                            <div className="field col-md-4">
                                <label className="required">Width</label>
                                <input placeholder="enter Width" defaultValue={modallandloard.width} onChange={onModalInputChange} type="number" name="width" className="form-control mt-1" title="Please enter valid email address" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Height</label>
                                <input placeholder="enter height" defaultValue={modallandloard.height} onChange={onModalInputChange} type="number" name="height" className="form-control mt-1" title="Please enter valid email address" required />
                            </div>
                        </div><br />
                        <div className="row">
                            <div className="field col-md-4">
                                <label className="required">Location</label>
                                <input placeholder="enter location" defaultValue={modallandloard.location} onChange={onModalInputChange} type="text" name="location" className="form-control mt-1" title="Please enter valid gstin" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Rent Amount Yearly</label>
                                <input placeholder="enter rent amount yearly " defaultValue={modallandloard.rent_amount} onChange={onModalInputChange} type="number" name="rent_amount" className="form-control mt-1" title="Please enter valid pan" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Rent Increment Remainder</label>
                                <input type="text" name="rent_increment_reminder" defaultValue={modallandloard.rent_increment_reminder} onChange={onModalInputChange} className="form-control mt-1" title="Please enter valid pan" required />
                            </div>
                        </div><br />
                        <div className="row">
                            <div className="field col-md-4">
                                <label className="required">Agreement Tenure  From</label>
                                <input type="date" name="agreement_from" defaultValue={modallandloard.agreement_from} onChange={onModalInputChange} className="form-control mt-1" title="Please enter valid gstin" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Agreement Tenure  To</label>
                                <input type="date" name="agreement_to" defaultValue={modallandloard.agreement_to} onChange={onModalInputChange} className="form-control mt-1" title="Please enter valid gstin" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Site Address</label>
                                <input type="text" name="site_address" defaultValue={modallandloard.site_address} onChange={onModalInputChange} className="form-control mt-1" title="Please enter valid gstin" required />
                            </div>
                        </div>
                        <br />
                        <h5 style={{ textAlign: 'center' }}>Bank Details</h5><br />
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Bank Name</label>
                                <input placeholder="enter Bank Name" defaultValue={modallandloard.bank_name} onChange={onModalInputChange} type="text" name="bank_name" className="form-control mt-1" title="Please enter valid gstin" required />

                            </div>
                            <div className="field col-md-6">
                                <label className="required">Branch Name</label>
                                <input placeholder="enter Branch Name" defaultValue={modallandloard.branch_name} onChange={onModalInputChange} type="text" name="branch_name" className="form-control mt-1" title="Please enter valid gstin" required />

                            </div>

                        </div><br />
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">IFSC</label>
                                <input type="text" name="ifsc" defaultValue={modallandloard.ifsc} onChange={onModalInputChange} className="form-control" placeholder="enter IFSC" />

                            </div>
                            <div className="field col-md-6">
                                <label className="required">Account Number</label>
                                <input type="text" name="account_no" defaultValue={modallandloard.account_no} onChange={onModalInputChange} className="form-control" placeholder="enter Account Number" />
                            </div>

                        </div><br />
                        <br />
                        <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>


                            <br />
                            <br />

                        </div>
                        <br />
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
                <h4 className="text-center">Landloard Management</h4><br />

                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-4">
                            <label className="required">Landloard Name</label>
                            <input placeholder="enter name" onChange={onInputChange} type="text" name="name" className="form-control mt-1" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                            <span ></span>
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Landloard Address</label>
                            <input placeholder="enter address" onChange={onInputChange} type="text" name="address" className="form-control mt-1" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Mobile Number</label>
                            <input placeholder="+91 " onChange={onInputChange} type="tel" name="mobile_number" className="form-control mt-1" required pattern="[789][0-9]{9}" title="Please enter Alphabets." />
                        </div>
                    </div><br />

                    <div className="row">
                        <div className="field col-md-4">
                            <label className="required">Location</label>
                            <input placeholder="enter location" onChange={onInputChange} type="text" name="location" className="form-control mt-1" title="Please enter valid gstin" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Rent Amount Yearly</label>
                            <input placeholder="enter rent amount yearly " onChange={onInputChange} type="text" name="rent_amount" className="form-control mt-1" title="Please enter valid pan" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Rent Increment Reminder</label>
                            <select name="rent_increment_reminder" onChange={onInputChange} className="form-control mt-1" required>
                                <option value="">Select...</option>
                                <option key="1" value="1">1 month</option>
                                <option key="2" value="2">2 month</option>
                                <option key="3" value="3">3 month</option>
                                <option key="4" value="4">4 month</option>
                            </select>
                            {/* <input   type="text" name="rent_increment_reminder" onChange={onInputChange}className="form-control mt-1"  title="Please enter valid pan" required /> */}
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-4">
                            <label className="required">Agreement Tenure  From</label>
                            <input type="date" name="agreement_from" onChange={onInputChange} className="form-control mt-1" title="Please enter valid gstin" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Agreement Tenure  To</label>
                            <input type="date" name="agreement_to" onChange={onInputChange} className="form-control mt-1" title="Please enter valid gstin" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Site Address</label>
                            <input type="text" name="site_address" onChange={onInputChange} className="form-control mt-1" title="Please enter valid gstin" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-4">
                            <label className="required">Width</label>
                            <input placeholder="enter Width" onChange={onInputChange} type="number" name="width" className="form-control mt-1" title="Please enter valid email address" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Height</label>
                            <input placeholder="enter height" onChange={onInputChange} type="number" name="height" className="form-control mt-1" title="Please enter valid email address" required />
                        </div>
                    </div>
                    <br />
                    <h5 style={{ textAlign: 'center' }}>Bank Details</h5><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Bank Name</label>
                            <input placeholder="enter bank Name" onChange={onInputChange} type="text" name="bank_name" className="form-control mt-1" title="Please enter valid gstin" required />

                        </div>
                        <div className="field col-md-6">
                            <label className="required">Branch Name</label>
                            <input placeholder="enter branch Name" onChange={onInputChange} type="text" name="branch_name" className="form-control mt-1" title="Please enter valid gstin" required />

                        </div>

                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">IFSC</label>
                            <input type="text" name="ifsc" onChange={onInputChange} className="form-control" maxlength="11" minlength="11" placeholder="enter IFSC" />

                        </div>
                        <div className="field col-md-6">
                            <label className="required">Account Number</label>
                            <input type="number" name="account_no" onChange={onInputChange} className="form-control" placeholder="enter account number" />
                        </div>

                    </div><br />
                    <br />
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>

                        <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Reset</button>
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
    );
}

export default Landloard_Management;
