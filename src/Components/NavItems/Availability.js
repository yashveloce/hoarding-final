import React, { useState } from 'react';
import Card from '@mui/material/Card'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Modal, Button } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
// import Button from '@restart/ui/esm/Button';
import {
    gql,
    useQuery,
    useSubscription,
    useMutation
} from '@apollo/client';
const getAVAILABILITY = gql`
subscription MySubscription {
    availability {
      id
      availability
    }
  } 
`
const DELETE_AVAILABILITY = gql`
  mutation MyMutation($id: Int = 10) {
    delete_availability_by_pk(id: $id) {
      id
      availability
    }
  }
`
const INSERT_AVAILABILITY = gql`
mutation MyMutation($availability: String = "") {
    insert_availability_one(object: {availability: $availability}) {
      id
      availability
    }
  }  
`
const UPDATE_AVAILABILITY = gql`
mutation MyMutation($id: Int!, $availability: String!) {
    update_availability_by_pk(pk_columns: {id: $id}, _set: {availability: $availability}) {
      availability
    }
  }
  
  
    
`
function Availability() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [availability, setAvailability] = useState({
        availability: '',
    }
    )

    const [modelAvailability, setModelAvailability] = useState({
        id: '',
        availability: '',
    }
    )
    const onInputChange = (e) => {
        setAvailability({ ...availability, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(e.target[0].value)
        insert_availability({ variables: { availability: e.target[0].value } })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit = (row) => {
        handleShow();
        console.log(row);
        setModelAvailability({
            id: row.id,
            availability: row.availability
        })
    }
    const onModalInputChange = (e) => {
        setModelAvailability({ ...modelAvailability, [e.target.name]: e.target.value })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        console.log(modelAvailability)
        update_availability({ variables: { id: modelAvailability.id, availability: modelAvailability.availability } })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const [insert_availability] = useMutation(INSERT_AVAILABILITY);
    const [update_availability] = useMutation(UPDATE_AVAILABILITY);
    const [delete_availability] = useMutation(DELETE_AVAILABILITY);
    const onDelete = (id) => {
        console.log(id);
        delete_availability({ variables: { id: id } });
        toast.configure();
        toast.error('Successfully Deleted')
    }
    const getAvailability = useSubscription(getAVAILABILITY);
    if (getAvailability.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    if (getAvailability.error) {
        return "error" + getAvailability.error;
    }
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },
        {
            field: 'availability',
            headerName: 'Availability',
            width: 200,
            editable: false,
        },

        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "250%", textAlign: 'center'  }}>
                        <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" style={{marginRight: '10%' }} onClick={() => { onEdit(params.row) }} ><i className="bi bi-pencil-fill"></i></button>

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



    //console.log(getAvailability.data);
    const rows = getAvailability.data.availability;

    return (
        <>
            <div>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Availability</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      
                            <form className="form-group" onSubmit={onModalFormSubmit}>
                                <div className="row">
                                    <div className="field col-md-6 text-right">
                                        <label className="required">ID</label>
                                        <input defaultValue={modelAvailability.id} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="id" type="text" placeholder='Enter media type' required />
                                    </div>
                                    <div className="field col-md-6 text-right">
                                        <label className="required">Availability Master</label>
                                        <input defaultValue={modelAvailability.availability} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="availability" type="text" placeholder='Enter media type' required />
                                    </div>
                                </div><br />
                               
                                    <button className="btn btn-primary" type='submit' style={{ marginLeft: '80px' }}>Save</button>  
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
                            <br/>
                            <h3 style={{ width: '100%', textAlign: 'center' }}>Availability Master</h3>

<br/>
                            <form className="form-group" onSubmit={onFormSubmit}>
                                <div className="row mt-2">
                                    <div className="field col-md-4" style={{ marginRight: '40px' }}>
                                    </div>
                                    <div className="field col-md-4 text-right">
                                        <label className="required">Availability</label>
                                        <input placeholder="enter availability" onChange={onInputChange} className="form-control mt-2" style={{ marginTop: '10px', width:'80%' }} name="availability" type="text" required />
                                    </div>
                                </div>
                               <br/>
                                <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                    <button className="btn btn-primary" type='submit' style={{ marginRight: '20px', width:'8%' }}>Save</button>

                                    <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width:'8%' }} >Reset</button>
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
                        rows={rows}
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
export default Availability;