import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Category } from '@material-ui/icons';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
    gql,
    useQuery,
    useSubscription,
    useMutation
} from '@apollo/client';

const getPayment_master = gql`
subscription MySubscription($_eq: String = "false"){
    payment_type(where: {isDeleted: {_eq: $_eq}}){
      id
      payment_type
    }
  }
  
  

`


const InsertPayment_Master = gql`
mutation MyMutation($payment_type: String = "") {
    insert_payment_type_one(object: {payment_type: $payment_type}) {
      id
    }
  }
  

`

const UpdatePayment_Master = gql`
mutation MyMutation($id: Int = "", $payment_type: String = "") {
    update_payment_type_by_pk(pk_columns: {id: $id}, _set: { payment_type: $payment_type}) {
      id
      payment_type
    }
  }
  


`

// const DeletePayment_Master = gql`
// mutation MyMutation($id: Int = 10) {
//     delete_payment_type_by_pk(id: $id) {
//       id
//       payment_type
//     }
//   }
  
// `

const DeletePayment_Master = gql`
mutation MyMutation($isDeleted: String = "", $id: Int = 0) {
    update_payment_type_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      isDeleted
    }
  }
  
`


export default function Payment_Type() {

    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [modalpayment, setmodalpayment] = useState({
        id: '',
        payment_type: '',
    })


    const onModalInputChange = (e) => {
        setmodalpayment({ ...modalpayment, [e.target.name]: e.target.value });
    }

    const onModalFormSubmit = (e) => {
        e.preventDefault();
        console.log(modalpayment);
        Update_paymenttypeData({ variables: { id: modalpayment.id, payment_type: modalpayment.payment_type } })

        handleClose();
    }
    const [Insert_paymenttypeData] = useMutation(InsertPayment_Master);
    const [Update_paymenttypeData] = useMutation(UpdatePayment_Master);
    const [delete_paymenttypeData] = useMutation(DeletePayment_Master);

    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(e.target)
        Insert_paymenttypeData({ variables: { payment_type: e.target[0].value } })
        toast.configure();
        toast.success('Successfully Inserted')
    }


    const onEdit = (row) => {
        handleShow();
        console.log(row);
        setmodalpayment({
            id: row.id,
            payment_type: row.payment_type
        })
    }




    const onDelete = (id) => {
        console.log(id);
        delete_paymenttypeData({ variables: { id: id } });
        toast.configure();
        toast.error('Successfully Deleted')
    }

    const getpayment_type = useSubscription(getPayment_master);
    if (getpayment_type.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    if (getpayment_type.error) {
        return "error" + getpayment_type.error;
    }
    console.log(getpayment_type.data);
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
            field: 'payment_type',
            headerName: 'Payment Type ',
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



    const rows = getpayment_type.data.payment_type;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    return (
        <>
            <div>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Payment Type Master</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <form className="form-group" onSubmit={onModalFormSubmit}>
                            <div className="row">
                                <div className="field col-md-6 text-right">
                                    <label className="required">ID</label>
                                    <input defaultValue={modalpayment.id} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="id" type="text" placeholder='Enter payment type' required />
                                </div>
                                <div className="field col-md-6 text-right">
                                    <label className="required">labour Category master</label>
                                    <input defaultValue={modalpayment.payment_type} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="payment_type" type="text" placeholder='Enter payment' required />
                                </div>
                            </div><br />

                            <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>


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
                    <div className="container">
                        <div className="col-md-12">
                            <br />
                            <h3 style={{ width: '100%', textAlign: 'center' }}>Payment Type</h3>

                            <br />
                            <form onSubmit={onFormSubmit} className="form-group" >
                                <div className="row mt-2">
                                    <div className="field col-md-4" style={{ marginRight: '40px' }}>
                                    </div>
                                    <div className="field col-md-4 text-right">
                                        <label className="required">Payment_Type</label>
                                        <input placeholder="enter Payment Type" className="form-control mt-2" style={{ marginTop: '10px', width: '80%' }} name="payment_type" type="text" required />
                                    </div>
                                </div>
                                <br />
                                <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                    <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>

                                    <button className="btn btn-primary" type='reset'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }} >Reset</button>
                                </div>
                            </form>

                        </div><br />
                    </div>
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
                        components={{
                          Toolbar: GridToolbar,
                        }}

                        disableSelectionOnClick
                    />
                </div>
            </Card>
        </>

    )
}