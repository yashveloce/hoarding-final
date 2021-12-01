import React, { useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import {
    gql,
    useQuery,
    useMutation,
    useSubscription,
} from "@apollo/client";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Modal, Button } from 'react-bootstrap';
import { Card } from '@material-ui/core';
import { toast } from 'react-toastify';

const LABOUR_MASTER_QUERY = gql`
subscription MyQuery($_eq: String = "false"){
    labor_master(where: {isDeleted: {_eq: $_eq}}){
      address
      gst_no
      id
      labor_type
      mobile_no
      name
      pan
      labour_category_master {
        labour_category
      }
      bank_master {
        account_no
        bank_name
        ifsc_code
        branch_name
      }
      bank_id 
    }



}      
`;
const LABOUR_MASTER_Insertion = gql`
mutation MyMutation($account_no: String = "", $bank_name: String = "", $branch_name: String = "", $ifsc_code: String = "", $address: String = "", $gst_no: String = "", $labor_type: Int!, $mobile_no: String = "", $name: String = "", $pan: String = "") {
    insert_labor_master(objects: {address: $address, gst_no: $gst_no, labor_type: $labor_type, mobile_no: $mobile_no, name: $name, pan: $pan, bank_master: {data: {account_no: $account_no, bank_name: $bank_name, branch_name: $branch_name, ifsc_code: $ifsc_code}}}) {
      affected_rows
    }
  }        
`;

const LABOUR_MASTER_Update = gql`
mutation MyMutation($id: Int = 10, $address: String = "", $gst_no: String = "", $labor_type: Int!, $mobile_no: String = "", $name: String = "", $pan: String = "") {
    update_labor_master_by_pk(pk_columns: {id: $id}, _set: {address: $address, gst_no: $gst_no, labor_type: $labor_type, mobile_no: $mobile_no, name: $name, pan: $pan}) {
      id
    }
  }            
`
// const LABOUR_MASTER_Delete = gql`
// mutation MyMutation($id: Int = 0) {
//     delete_labor_master_by_pk(id: $id) {
//       id
//     }
//   }
// `

const LABOUR_MASTER_Delete = gql`
mutation MyMutation($id: Int = 0, $isDeleted: String = "true") {
    update_labor_master_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }   
`

const Read_Labour_Master=gql`
query MyQuery($_eq: String = "false"){
    labour_category_master(where: {isDeleted: {_eq: $_eq}}){
      id
      labour_category
    }
  }
  
`






export default function Labour_Master() {
    const [id, setId] = useState()
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [labour, setLabour] = useState({
        address: '',
        gst_no: '',
        labor_type: '',
        mobile_no: '',
        name: '',
        pan: '',
        account_no: '',
        bank_name: '',
        ifsc_code: '',
        branch_name: '',
    })
    const [updateLabor, setUpdateLabor] = useState({
        id: id,
        address: '',
        gst_no: '',
        labor_type: '',
        mobile_no: '',
        name: '',
        pan: '',
        account_no: '',
        bank_name: '',
        ifsc_code: '',
        branch_name: '',
    })
   





    const Datatable = useSubscription(LABOUR_MASTER_QUERY);
    const [insertLabourMaster] = useMutation(LABOUR_MASTER_Insertion);
    const [updateLabourMaster] = useMutation(LABOUR_MASTER_Update);
    const [deleteLabourMaster] = useMutation(LABOUR_MASTER_Delete);


    const read_labour =useQuery(Read_Labour_Master);


    if (Datatable.loading||read_labour.loading) {
        return (
            <div className='App' style={{ marginTop: '20%', }}><CircularProgress /></div>
        )
    }
    if (Datatable.error) {
        return "Error"+Datatable.error;
    }
    //const rows = Datatable.data.labor_master;
    const rows = Datatable.data.labor_master;
    let newData=[]
    rows.map((item,index)=>{
        newData.push({sno:index+1,...item})
    })

    const onInputChange = (e) => {
        console.log(e.target.value)
        e.preventDefault();
        setLabour({ ...labour, [e.target.name]: e.target.value })
    }
    const onModalInputChange = (e) => {
        e.preventDefault();
        setUpdateLabor({ ...updateLabor, [e.target.name]: e.target.value })
    }

    const onModalSubmit = (e) => {
        console.log(updateLabor)
        e.preventDefault();
        updateLabourMaster({
            variables: updateLabor,
        });
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(labour);
        insertLabourMaster(
            { variables: labour }
        )
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const editVehicle = (row) => {
        setId(row.id);
        setUpdateLabor({
            id: row.id,
            address: row.address,
            gst_no: row.gst_no,
            labor_type: row.labor_type,
            mobile_no: row.mobile_no,
            name: row.name,
            pan: row.pan,
            account_no: row.account_no,
            bank_name: row.bank_name,
            ifsc_code: row.ifsc_code,
            branch_name: row.branch_name,
        });
        handleShow();
    }

    const deleteVehicle = (id) => {
        console.log(id);
        deleteLabourMaster({variables: {id: id}})
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
            width: 100,
            hide: false,
        },
        {
            field: 'labor_type',
            headerName: 'Labour Type',
            width: 190,
            valueGetter: (params) => {
                return params.row.labour_category_master.labour_category;
            },
            editable: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 160,
            editable: false,
        },
        {
            field: 'mobile_no',
            headerName: 'Contact Number',
            width: 190,
            editable: false,
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 190,
            editable: false,
        },
        {
            field: 'gst_no',
            headerName: 'GST Number',
            width: 160,
            editable: false,
        },
        {
            field: 'pan',
            headerName: 'PAN Number',
            width: 160,
            editable: false,
        },
        {
            field: 'bank_name',
            headerName: 'Bank Name',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.bank_name;
            },
            editable: false,
        },
        {
            field: 'branch_name',
            headerName: 'Branch Name',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.branch_name;
            },
            editable: false,
        },
        {
            field: 'ifsc_code',
            headerName: 'IFSC',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.ifsc_code;
            },
            editable: false,
        },
        {
            field: 'account_no',
            headerName: 'Account Number',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.account_no;
            },
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "150%", textAlign: 'center' }}>
                        <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" style={{ marginRight: '20%' }} onClick={() => { editVehicle(params.row) }} ><i className="bi bi-pencil-fill"></i></button>
                        <button style={{ marginRight: '30%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                console.log("----"+params.row.id);
                                deleteVehicle(params.row.id)
                            }
                        }}><i className="bi bi-trash-fill"></i></button>
                    </div>
                );
            }
        },
    ];

    

    return (
        <>
            <div>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Edit Labour Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='card card-primary card-outline' style={{ padding: '20px' }}>
                            <form className="form-group" onSubmit={onModalSubmit}>
                                <div className="row">
                                    <div className="field col-md-6">
                                        <label className="required">Labour_Category</label>
                                        <select placeholder="enter labour category" onChange={onModalInputChange} defaultValue={updateLabor.labor_type} type="text" name="labor_type" className="form-control mt-1" placeholder="enter labour category" required>
                                <option>--SELECT--</option>
                                {read_labour.data.labour_category_master.map(Labour_Category => (
                                    <option key={Labour_Category.id} value={Labour_Category.id}>{Labour_Category.labour_category}</option>
                                ))}
                            </select>
                                    </div>
                                    <div className="field col-md-6">
                                        <label className="required">Name</label>
                                        <input placeholder="enter name" defaultValue={updateLabor.name} className="form-control mt-1" name="name" type="text" onChange={onModalInputChange} pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="field col-md-6">
                                        <label className="required">Contact Number</label>
                                        <div style={{ display: 'flex' }}>
                                            <input placeholder="enter contact number" defaultValue={updateLabor.mobile_no} className="form-control mt-1" name="mobile_no" type="tel" onChange={onModalInputChange} required  pattern="[789][0-9]{9}" title="Please enter valid mobile no"/>
                                            {/* <button className="btn btn-primary" style={{ margin: '0 20px' }} type='button'>Get OTP</button> */}
                                        </div>
                                    </div>
                                
                                    <div className="field col-md-6">
                                        <label className="required">GST Number</label>
                                        <input defaultValue={updateLabor.gst_no} className="form-control mt-1" name="gst_no" placeholder="enter gst number" type="text" onChange={onModalInputChange} required />
                                    </div>
                                    {/* <div className="field col-md-6">
                                        <label>Enter OTP</label>
                                        <input className="form-control" name="otp" type="text" placeholder='Please Enter Your OTP' />
                                    </div> */}
                                </div>
                                <div className="row">
                                    <div className="field col-md-6">
                                        <label className="required">PAN Number</label>
                                        <input defaultValue={updateLabor.pan} className="form-control mt-1" name="pan" placeholder="enter pan number" type="text" onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-6">
                                        <label className="required">Address</label>
                                        <input defaultValue={updateLabor.address} className="form-control mt-1" name="address" placeholder="enter address" type="text" onChange={onModalInputChange} required />
                                    </div>

                                </div>
                                {/* <h5 style={{ width: '100%', textAlign: 'center' }}>BANK DETAILS</h5> */}
                                {/* <span style={{ fontSize: '25px', fontFamily: 'Open Sans, sans-serif', width: '100%', textAlign: 'center', marginTop: '30px' }}>BANK DETAILS</span> */}
                                {/* <div className="row mt-3" >
                                    <div className="field col-md-4">
                                        <label>Bank Name</label>
                                        <input className="form-control" name="bank_name" type="text" placeholder='enter your bank name' onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4">
                                        <label>Branch Name</label>
                                        <input className="form-control" name="branch_name" type="text" placeholder='enter branch name' onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4">
                                        <label>IFSC</label>
                                        <input className="form-control" name="ifsc_code" type="text" placeholder='enter your IFSC number' onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4 mt-3">
                                        <label>Account Number</label>
                                        <input className="form-control" name="account_no" type="text" placeholder='enter your account number' onChange={onModalInputChange} required />
                                    </div>
                                </div> */}
                                <br />
                                {/* <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}> */}
                                    <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Update</button>
                                    {/* <button className="btn btn-primary" type='reset'>Reset</button> */}
                                {/* </div> */}
                            </form>
                        </div>
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
                    <br/>
                            <h4 style={{ width: '100%', textAlign: 'center' }}>LABOUR MASTER</h4>

                            <br/>
                         
                                <form className="form-group" onSubmit={onSubmit}>
                                    <div className="row">
                                        <div className="field col-md-4">
                                            <label className="required">Labour Category</label>
                                            <select onChange={onInputChange}  type="text" name="labor_type" className="form-control mt-1" placeholder="enter labour category" required>
                                <option>--SELECT--</option>
                                {read_labour.data.labour_category_master.map(Labour_Category => (
                                    <option key={Labour_Category.id} value={Labour_Category.id}>{Labour_Category.labour_category}</option>
                                ))}
                            </select>
                                        </div>
                                        <div className="field col-md-4">
                                            <label className="required">Name</label>
                                            <input className="form-control mt-1" name="name" type="text"  onChange={onInputChange} placeholder="enter name" pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets."  required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label className="required">Contact Number</label>
                                            <div style={{ display: 'flex' }}>
                                                <input className="form-control mt-1" name="mobile_no" type="tel"  onChange={onInputChange} placeholder="enter contact number" required  pattern="[789][0-9]{9}" title="Please enter valid mobile no"/>
                                                {/* <button className="btn btn-primary" style={{ margin: '0 20px' }} type='button'>Get OTP</button> */}
                                            </div>
                                        </div>
                                    </div><br />
                                    <div className="row mt-3">
                                        <div className="field col-md-4">
                                        <label className="required">GST Number</label>
                            <input onChange={onInputChange} placeholder="enter gst number" type="text" name="gst_no" className="form-control mt-1" pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" title="Please enter valid gst number" required />
                                        </div>
                                        {/* <div className="field col-md-6">
                                        <label>Enter OTP</label>
                                        <input className="form-control" name="otp" type="text" placeholder='Please Enter Your OTP' />
                                    </div> */}

                                        <div className="field col-md-4">
                                        <label className="required">PAN Number</label>
                            <input onChange={onInputChange} placeholder="enter pan number" type="text" name="pan" className="form-control mt-1" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Please enter valid pan number" required />
                                        </div>
                                        <div className="field col-md-4 mb-4">
                                            <label className="required">Address</label>
                                            <input className="form-control mt-1" name="address" placeholder="enter address" type="text"  onChange={onInputChange} required />
                                        </div>

                                    </div><br />
                                    <h5 style={{ width: '100%', textAlign: 'center' }}>BANK DETAILS</h5>
                                    <br/>
                                    {/* <span style={{ fontSize: '25px', fontFamily: 'Open Sans, sans-serif', width: '100%', textAlign: 'center', marginTop: '30px' }}>BANK DETAILS</span> */}
                                    <div className="row mt-3" >
                                        <div className="field col-md-4">
                                            <label className="required">Bank Name</label>
                                            <input className="form-control mt-1" name="bank_name" type="text"  placeholder="enter bank name" pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label className="required">Branch Name</label>
                                            <input className="form-control mt-1" name="branch_name" type="text"  placeholder="enter branch name" pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label className="required">IFSC</label>
                                            <input className="form-control mt-1" maxlength="11" minlength="11" name="ifsc_code" type="text"placeholder="enter ifsc"  onChange={onInputChange} required />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="field col-md-4 mt-3">
                                            
                                            <label className="required">Account Number</label>
                                            <input className="form-control mt-1" name="account_no" placeholder="enter account number" type="number"  onChange={onInputChange} required />
                                        </div>
                                    </div>
                                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                                        <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>

                                        <button className="btn btn-primary" type='reset'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Reset</button>
                                        <br/>
                                        <br/>
                                       
                                    </div>
                                </form>
                         
                        
                </Card>
            </div>
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
                    />
                </div>
            </Card>
        </>
    )
}