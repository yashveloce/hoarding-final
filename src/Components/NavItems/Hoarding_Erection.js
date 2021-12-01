import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
const GET_HOARDING = gql`
query MyQuery {
  hoarding_errection {
    id
    errection_cost
    errection_year
    fabricator
    inventory
  }
}
`
const READ_HOARDING = gql`
subscription MySubscription {
    hoarding_errection {
        Inventory_Master {
          Location
        }
        inventory
        fabricator
        errection_year
        errection_cost
        id
        labor_master {
          name
          id
        }
      }
}
`
const INSERT_HOARDING = gql`
mutation MyMutation($errection_cost: String = "", $errection_year: String = "", $fabricator: Int!, $inventory: Int!) {
  insert_hoarding_errection_one(object: {errection_cost: $errection_cost, errection_year: $errection_year, fabricator: $fabricator, inventory: $inventory}) {
    id
  }
}
`
const UPDATE_HOARDING = gql`
mutation MyMutation($id: Int = 10, $errection_cost: String = "", $errection_year: String = "", $fabricator: Int = 10, $inventory: Int = 10) {
  update_hoarding_errection_by_pk(pk_columns: {id: $id}, _set: {errection_cost: $errection_cost, errection_year: $errection_year, fabricator: $fabricator, inventory: $inventory}) {
    id
    errection_cost
    errection_year
    fabricator
    inventory
  }
}
`
const DELETE_HOARDING = gql`
mutation MyMutation($id: Int = 10) {
  delete_hoarding_errection_by_pk(id: $id) {
    id
  }
}
`
const READ_LABOR = gql`
query MyQuery {
    labor_master(where: {labor_type: {_eq: 21}}) {
      address
      bank_id
      gst_no
      id
      labor_type
      mobile_no
      pan
      name
    }
  }
  
`
const READ_INVENTORY = gql`
query MyQuery {
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
      Taluka
      Total
      Totalsqft
      Width
      city {
        id
        name
      }
      country {
        id
        name
      }
      errection_cost
      errection_year
      fabrication_selection
      hoarding_insurance
      id
      media_type_master {
        id
        media_type
      }
      state {
        id
        name
      }
    }
  }
  
`
export default function HoardingErrection() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [hoarding, setHOARDING] = useState({
        errection_cost: '',
        errection_year: '',
        fabricator: '',
        inventory: '',
    });

    const [modalHOARDING, setModalHOARDING] = useState({
        id: '',
        errection_cost: '',
        errection_year: '',
        fabricator: '',
        inventory: '',
    });
    const [insert_hoarding, insert_data] = useMutation(INSERT_HOARDING);
    const [update_hoarding, update_data] = useMutation(UPDATE_HOARDING);
    const [delete_hoarding, delete_data] = useMutation(DELETE_HOARDING);
    const read_labor = useQuery(READ_LABOR);
    const read_inventory = useQuery(READ_INVENTORY);
    const hoarding_data = useSubscription(READ_HOARDING);
    if (hoarding_data.loading || hoarding_data.loading || read_labor.loading || read_inventory.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    const onInputChange = (e) => {
        setHOARDING({ ...hoarding, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(hoarding)
        insert_hoarding({ variables: hoarding })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit = (row) => {
        handleShow();
        setModalHOARDING({
            id: row.id,
            errection_cost: row.errection_cost,
            errection_year: row.errection_year,
            fabricator: row.fabricator,
            inventory: row.inventory
        })
        console.log(modalHOARDING);
    }
    const onModalInputChange = (e) => {
        setModalHOARDING({ ...modalHOARDING, [e.target.name]: e.target.value })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_hoarding({ variables: modalHOARDING })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete = (id) => {
        delete_hoarding({ variables: { id: id } })
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
            field: 'errection_cost',
            headerName: 'Errection Cost',
            width: 190
        },
        {
            field: 'errection_year',
            headerName: 'Errection Year',
            width: 190
        },
        {
            field: 'fabricator',
            headerName: 'Fabricator',
            width: 250
        },
        {
            field: 'fabricator',
            headerName: 'Fabricator',
            width: 190,
            valueGetter: (params) => {
                return params.row.labor_master.name;
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
    const rows = hoarding_data.data.hoarding_errection;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Hoarding Errection</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={onModalFormSubmit} className="form-group">
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">ID</label>
                                <input defaultValue={modalHOARDING.id} onChange={onModalInputChange} className="form-control mt-1" name="id" type="text" placeholder="enter id" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Errection Cost</label>
                                <input defaultValue={modalHOARDING.errection_cost} onChange={onModalInputChange} className="form-control mt-1" name="errection_cost" type="text" placeholder="enter errection cost" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Errection Year</label>
                                <input defaultValue={modalHOARDING.errection_year} onChange={onModalInputChange} className="form-control mt-1" name="errection_year" type="text" placeholder="enter errection year" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Fabricator</label>
                                <input defaultValue={modalHOARDING.fabricator} onChange={onModalInputChange} className="form-control mt-1" name="fabricator" type="text" placeholder="enter location" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Inventory</label>
                                <input defaultValue={modalHOARDING.inventory} onChange={onModalInputChange} className="form-control mt-1" name="inventory" type="text" placeholder="enter location" />
                            </div>
                        </div>
                        <br />
                        <div className="field col-md-6">
                            <button className="btn btn-primary" style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>
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
                <h4 className="text-center">HOARDING ERECTION</h4>
                <br />
                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Errection Cost</label>
                            <input type="text" name="errection_cost" onChange={onInputChange} className="form-control mt-1" placeholder="enter errection cost" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Errection Year</label>
                            <input type="text" name="errection_year" onChange={onInputChange} className="form-control mt-1" placeholder="enter errection year" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Fabricator</label>
                            {/* <input type="text" name="status" onChange={onInputChange} className="form-control mt-1" placeholder="enter fabricator cost" required /> */}
                            <select className="form-control" name="fabricator" onChange={onInputChange} >
                                <option>Select...</option>
                                {read_labor.data.labor_master.map(labor => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Inventory</label>
                            {/* <input type="text" name="status" onChange={onInputChange} className="form-control mt-1" placeholder="enter fabricator cost" required /> */}
                            <select className="form-control" name="inventory" onChange={onInputChange}>
                                <option>Select...</option>
                                {read_inventory.data.Inventory_Master.map(inventory => (
                                    <option key={inventory.id} value={inventory.id}>{inventory.Location}</option>
                                ))}
                            </select>
                        </div>
                    </div><br />

                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>
                        <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Reset</button>
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
                        rows={rows}
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