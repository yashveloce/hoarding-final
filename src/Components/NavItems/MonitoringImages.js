import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
const GET_MONITORING = gql`
query MyQuery {
    monitoring_images {
      id
      upload_image
      status
      geo_location
      date
      clients_name
      brand_name
    }
  }
`
const READ_MONITORING = gql`
subscription MySubscription($_eq: String = "false"){
    monitoring_images(where: {isDeleted: {_eq: $_eq}}) {
      id
      upload_image
      status
      geo_location
      date
      clients_name
      brand_name
    }
  }  
`
const INSERT_MONITORING = gql`
mutation MyMutation($brand_name: String = "", $clients_name: String = "", $date: String = "", $geo_location: String = "", $status: String = "", $upload_image: String = "") {
    insert_monitoring_images_one(object: {brand_name: $brand_name, clients_name: $clients_name, date: $date, geo_location: $geo_location, status: $status, upload_image: $upload_image}) {
      id
    }
  }
`
const UPDATE_MONITORING = gql`
mutation MyMutation($id: Int = 1, $brand_name: String = "", $clients_name: String = "", $date: String = "", $geo_location: String = "", $status: String = "", $upload_image: String = "", $id1: Int = 10) {
    update_monitoring_images_by_pk(pk_columns: {id: $id}, _set: {brand_name: $brand_name, clients_name: $clients_name, date: $date, geo_location: $geo_location, status: $status, upload_image: $upload_image}) {
      brand_name
      clients_name
      date
      geo_location
      id
      status
      upload_image
    }
  }  
`
// const DELETE_MONITORING = gql`
// mutation MyMutation($id: Int = 10) {
//     delete_monitoring_images_by_pk(id: $id) {
//       id
//     }
//   }  
// `

const DELETE_MONITORING = gql`
mutation MyMutation($isDeleted: String = "true", $id: Int = 0) {
    update_monitoring_images_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }
  
`
export default function MonitoringImages() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [monitoring, setMONITORING] = useState({
        brand_name: '',
        clients_name: '',
        date: '',
        geo_location: '',
        status: '',
        upload_image: '',
    });

    const [modalMONITORING, setModalMONITORING] = useState({
        id: '',
        brand_name: '',
        clients_name: '',
        date: '',
        geo_location: '',
        status: '',
        upload_image: '',
    });
    const [insert_monitoring, insert_data] = useMutation(INSERT_MONITORING);
    const [update_monitoring, update_data] = useMutation(UPDATE_MONITORING);
    const [delete_monitoring, delete_data] = useMutation(DELETE_MONITORING);
    const monitoring_data = useSubscription(READ_MONITORING);
    if (monitoring_data.loading || monitoring_data.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    const onInputChange = (e) => {
        setMONITORING({ ...monitoring, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        insert_monitoring({ variables: monitoring })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit = (row) => {
        handleShow();
        setModalMONITORING({
            id: row.id,
            brand_name: row.brand_name,
            clients_name: row.clients_name,
            date: row.date,
            geo_location: row.geo_location,
            status: row.status,
            upload_image: row.upload_image
        })
        console.log(modalMONITORING);
    }
    const onModalInputChange = (e) => {
        setModalMONITORING({ ...modalMONITORING, [e.target.name]: e.target.value })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_monitoring({ variables: modalMONITORING })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete = (id) => {
        delete_monitoring({ variables: { id: id } })
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
        },
        {
            field: 'upload_image',
            headerName: 'Upload Image',
            width: 190
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 190
        },
        {
            field: 'geo_location',
            headerName: 'Location',
            width: 250
        },
        {
            field: 'clients_name',
            headerName: 'Client Name',
            width: 160
        },
        {
            field: 'brand_name',
            headerName: 'Brand Name',
            width: 180
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 110
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button onClick={() => onEdit(params.row)} data-toggle="tooltip" title="Edit" style={{ marginLeft: '5%' }} type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"></i></button>
                        <button onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }} data-toggle="tooltip" title="Delete" style={{ marginLeft: '50%' }} className="btn btn-danger" ><i className="bi bi-trash-fill"></i></button>
                    </div>
                );
            }
        },
    ];
    const rows = monitoring_data.data.monitoring_images;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={onModalFormSubmit} className="form-group">
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">ID</label>
                                <input defaultValue={modalMONITORING.id} onChange={onModalInputChange} className="form-control mt-1" name="id" type="text" placeholder="enter id" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Upload Images</label>
                                <input defaultValue={modalMONITORING.upload_image} onChange={onModalInputChange} className="form-control mt-1" name="upload_image" type="text" placeholder="enter address" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Status</label>
                                <input defaultValue={modalMONITORING.status} onChange={onModalInputChange} className="form-control mt-1" name="status" type="text" placeholder="enter status" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Location</label>
                                <input defaultValue={modalMONITORING.geo_location} onChange={onModalInputChange} className="form-control mt-1" name="geo_location" type="text" placeholder="enter location" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Client Name</label>
                                <input defaultValue={modalMONITORING.clients_name} onChange={onModalInputChange} className="form-control mt-1" name="clients_name" type="text" placeholder="enter clients name" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Display Brand Name</label>
                                <input defaultValue={modalMONITORING.brand_name} onChange={onModalInputChange} className="form-control mt-1" name="brand_name" type="text" placeholder="enter brand name" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Date</label>
                                <input defaultValue={modalMONITORING.date} onChange={onModalInputChange} className="form-control mt-1" name="date" type="date" placeholder="enter brand name" />
                            </div>

                        </div>
                        <br />
                        <div className="field col-md-6">
                            <button className="btn btn-primary"style={{ marginRight: '50px', width:'22%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>
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

                <br />
                <h4 className="text-center">MONITORING IMAGES</h4>
                <br />
                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Upload Image</label>
                            <input type="text" name="upload_image" onChange={onInputChange} className="form-control mt-1" placeholder="upload your image" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Status</label>
                            <input type="text" name="status" onChange={onInputChange} className="form-control mt-1" placeholder="enter status" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Location</label>
                            <input type="text" name="geo_location" onChange={onInputChange} className="form-control mt-1" placeholder="enter location" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Client Name</label>
                            <input type="text" name="clients_name" onChange={onInputChange} className="form-control mt-1" placeholder="enter client's name" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Display Brand Name</label>
                            <input type="text" name="brand_name" onChange={onInputChange} className="form-control mt-1" placeholder="enter brand name" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Date</label>
                            <input type="date" name="date" onChange={onInputChange} className="form-control mt-1" placeholder="enter date" required />
                        </div>
                    </div><br />

                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>
                        <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Reset</button>
                        <br /><br />
                    </div>
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
