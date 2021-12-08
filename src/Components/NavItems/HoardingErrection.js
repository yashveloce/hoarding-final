import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
const GET_HOARDING = gql`
subscription MySubscription {
  hoarding_errection {
    id
    location
    payment
    permission
    excavator
    excavator_charges
    civil_contractor
    civil_material
    civil_contractor_labour_payment
    fabrication_material
    fabricator_labour_payment
    transport_charges
    electrician_selection
    electric_material_purchase
    electrician_labour_payment
    fabricator
  }
}
`
const READ_HOARDING = gql`
subscription MySubscription {
    hoarding_errection {
        laborMasterByExcavator {
            id
            labor_type
            name
          }
          laborMasterByElectricianSelection {
            id
            labor_type
            name
          }
          labor_master {
            id
            labor_type
            name
          }
    location
    payment
    permission
    excavator
    excavator_charges
    civil_contractor
    civil_material
    civil_contractor_labour_payment
    fabrication_material
    fabricator_labour_payment
    transport_charges
    electrician_selection
    electric_material_purchase
    electrician_labour_payment
    id
    fabricator
    }   
}
`
const INSERT_HOARDING = gql`
mutation MyMutation($location: String = "", $payment: String = "", $permission: String = "", $excavator: Int!, $excavator_charges: String = "", $civil_contractor: Int!, $civil_material: String = "", $civil_contractor_labour_payment: String = "", $fabrication_material: String = "", $fabricator_labour_payment: String = "", $transport_charges: String = "", $electrician_selection: Int!, $electric_material_purchase: String = "", $electrician_labour_payment: String = "",$fabricator:Int!) {
  insert_hoarding_errection_one(object: {location: $location, payment: $payment, permission: $permission, excavator: $excavator, excavator_charges: $excavator_charges, civil_contractor: $civil_contractor, civil_material: $civil_material, civil_contractor_labour_payment: $civil_contractor_labour_payment, fabrication_material: $fabrication_material, fabricator_labour_payment: $fabricator_labour_payment, transport_charges: $transport_charges, electrician_selection: $electrician_selection, electric_material_purchase : $electric_material_purchase, electrician_labour_payment: $electrician_labour_payment,fabricator:$fabricator}) {
    id
  }
}
`
const UPDATE_HOARDING = gql`
mutation MyMutation($id: Int = 10, $location: String = "", $payment: String = "", $permission: String = "", $excavator: Int!, $excavator_charges: String = "", $civil_contractor: Int!, $civil_material: String = "", $civil_contractor_labour_payment: String = "", $fabrication_material: String = "", $fabricator_labour_payment: String = "", $transport_charges: String = "", $electrician_selection: Int!, $electric_material_purchase: String = "", $electrician_labour_payment: String = "",$fabricator:Int!) {
  update_hoarding_errection_by_pk(pk_columns: {id: $id}, _set: {location: $location, payment: $payment, permission: $permission, excavator: $excavator, excavator_charges: $excavator_charges, civil_contractor: $civil_contractor, civil_material: $civil_material, civil_contractor_labour_payment: $civil_contractor_labour_payment, fabrication_material: $fabrication_material, fabricator_labour_payment: $fabricator_labour_payment, transport_charges: $transport_charges, electrician_selection: $electrician_selection, electric_material_purchase : $electric_material_purchase, electrician_labour_payment: $electrician_labour_payment,fabricator:$fabricator}) {
    id
    location
    payment
    permission
    excavator
    excavator_charges
    civil_contractor
    civil_material
    civil_contractor_labour_payment
    fabrication_material
    fabricator_labour_payment
    transport_charges
    electrician_selection
    electric_material_purchase
    electrician_labour_payment
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
subscription MySubscription {
    labor_master(where:{isDeleted: {_eq: "false"}, labor_type: {_eq: 7}}) {
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
subscription MySubscription {
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
const READ_ELECTRICIAN = gql`
subscription MySubscription {
    labor_master(where:{isDeleted: {_eq: "false"}, labor_type: {_eq: 3}}) {
      id
      labor_type
      name
    }
  }
`

const READ_CIVIL_CONTRACTOR = gql`
subscription MySubscription {
    labor_master(where: {isDeleted: {_eq: "false"},labor_type: {_eq: 5}}) {
      id
      labor_type
      name
    }
  }
`

const READ_EXCAVATOR = gql`
subscription MySubscription {
    labor_master(where:{isDeleted: {_eq: "false"}, labor_type: {_eq: 1}}) {
      id
      labor_type
      name
    }
  }
`

export default function HoardingErrection() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [hoarding, setHOARDING] = useState({
        location: '',
        payment: '',
        permission: '',
        excavator: '',
        excavator_charges: '',
        civil_contractor: '',
        civil_material: '',
        civil_contractor_labour_payment: '',
        fabrication_material: '',
        fabricator_labour_payment: '',
        transport_charges: '',
        electrician_selection: '',
        electric_material_purchase: '',
        electrician_labour_payment: '',
        fabricator:'',
    });

    const [modalHOARDING, setModalHOARDING] = useState({
        id: '',
        location: '',
        payment: '',
        permission: '',
        excavator: '',
        excavator_charges: '',
        civil_contractor: '',
        civil_material: '',
        civil_contractor_labour_payment: '',
        fabrication_material: '',
        fabricator_labour_payment: '',
        transport_charges: '',
        electrician_selection: '',
        electric_material_purchase: '',
        electrician_labour_payment: '',
        fabricator:'',
    });
    const [insert_hoarding, insert_data] = useMutation(INSERT_HOARDING);
    const [update_hoarding, update_data] = useMutation(UPDATE_HOARDING);
    const [delete_hoarding, delete_data] = useMutation(DELETE_HOARDING);
    const read_labor = useSubscription(READ_LABOR);
    const read_excavator = useSubscription(READ_EXCAVATOR);
    const read_electrician = useSubscription(READ_ELECTRICIAN);
    const read_civil_contractor = useSubscription(READ_CIVIL_CONTRACTOR);
    const read_inventory = useSubscription(READ_INVENTORY);
    const hoarding_data = useSubscription(READ_HOARDING);
    if (hoarding_data.loading || hoarding_data.loading || read_labor.loading || read_inventory.loading || read_excavator.loading || read_electrician.loading || read_civil_contractor.loading) {
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
            location: row.location,
            payment: row.payment,
            permission: row.permission,
            excavator: row.excavator,
            excavator_charges: row.excavator_charges,
            civil_contractor: row.civil_contractor,
            civil_material: row.civil_material,
            civil_contractor_labour_payment: row.civil_contractor_labour_payment,
            fabrication_material: row.fabrication_material,
            fabricator_labour_payment: row.fabricator_labour_payment,
            transport_charges: row.transport_charges,
            electrician_selection: row.electrician_selection,
            electric_material_purchase: row.electric_material_purchase,
            electrician_labour_payment: row.electrician_labour_payment,
            fabricator:row.fabricator,
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
            field: 'location',
            headerName: 'Location Provided By Agent Name',
            width: 300
        },
        {
            field: 'payment',
            headerName: 'Payment For Location To Agent Amount',
            width: 330
        },
        {
            field: 'permission',
            headerName: 'Permission Cost Amount',
            width: 250
        },
        {
            field: 'excavator',
            headerName: 'Excavator Selection',
            width: 210,
            valueGetter: (params) => {
                return params.row.laborMasterByExcavator.name;
            }
        },
        {
            field: 'excavator_charges',
            headerName: 'Excavator Charges Amount',
            width: 260
        },
        {
            field: 'civil_contractor',
            headerName: 'Civil Contractor Selection',
            width: 250,
            valueGetter: (params) => {
                return params.row.labor_master.name;
            }
        },
        {
            field: 'civil_material',
            headerName: 'Civil Material Purchase Amount',
            width: 280
        },
        {
            field: 'civil_contractor_labour_payment',
            headerName: 'Civil Contractor Labour Payment Amount',
            width: 340
        },
        {
            field: 'fabrication_material',
            headerName: 'Fabrication Material Purchase Amount',
            width: 320
        },
        {
            field: 'fabricator_labour_payment',
            headerName: 'Fabricator Labour Payment Amount',
            width: 310
        },
        {
            field: 'transport_charges',
            headerName: 'Transport Charges If Any',
            width: 240
        },
        {
            field: 'electrician_selection',
            headerName: 'Electrician Selection',
            width: 220,
            valueGetter: (params) => {
                return params.row.laborMasterByElectricianSelection.name;
            }
        },
        {
            field: 'electric_material_purchase',
            headerName: 'Electric Material Purchase Amount',
            width: 310
        },
        {
            field: 'electrician_labour_payment',
            headerName: 'Electrician Labour Payment Amount',
            width: 310
        },
        {
            field: 'fabricator',
            headerName: 'Fabricator',
            width: 310
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
                                <label className="required">Location Provided By Agent's Name
                                </label>
                                <input defaultValue={modalHOARDING.location} onChange={onModalInputChange} className="form-control mt-1" name="location" type="text" placeholder="enter location provided by agent's name" />
                            </div>
                        </div>
                        <br />
                        <div className="row mt-2">
                            <div className="field col-md-6">
                                <label className="required">Payment For Location To Agent Amount</label>
                                <input defaultValue={modalHOARDING.payment} onChange={onModalInputChange} className="form-control mt-1" name="payment" type="text" placeholder="enter payment for location to agent's amount" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Permission Cost Amount
                                </label>
                                <input defaultValue={modalHOARDING.permission} onChange={onModalInputChange} className="form-control mt-1" name="permission" type="text" placeholder="enter permission cost amount" />
                            </div>
                        </div>
                        <br />
                        <div className="row mt-2">
                            <div className="field col-md-6">
                                <label className="required">Excavator Selection</label>
                                {/* <input defaultValue={modalHOARDING.excavator} onChange={onModalInputChange} className="form-control mt-1" name="excavator" type="text" placeholder="select excavator" /> */}
                                <select defaultValue={modalHOARDING.excavator} name="excavator" onChange={onModalInputChange} className="form-control mt-1">
                                    <option>Select...</option>
                                    {read_excavator.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Excavator Charges Amount
                                </label>
                                <input defaultValue={modalHOARDING.excavator_charges} onChange={onModalInputChange} className="form-control mt-1" name="excavator_charges" type="text" placeholder="enter excavator charges amount" />
                            </div>
                        </div>
                        <br />
                        <div className="row mt-2">
                            <div className="field col-md-6">
                                <label className="required">Civil Contractor Selection</label>
                                {/* <input defaultValue={modalHOARDING.civil_contractor} onChange={onModalInputChange} className="form-control mt-1" name="civil_contractor" type="text" placeholder="select civil contractor" /> */}
                                <select defaultValue={modalHOARDING.civil_contractor} name="civil_contractor" onChange={onModalInputChange} className="form-control mt-1">
                                    <option>Select...</option>
                                    {read_civil_contractor.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Civil Material Purchase Amount
                                </label>
                                <input defaultValue={modalHOARDING.civil_material} onChange={onModalInputChange} className="form-control mt-1" name="civil_material" type="text" placeholder="enter civil material purchase amount" />
                            </div>
                        </div>
                        <br />
                        <div className="row mt-2">
                            <div className="field col-md-6">
                                <label className="required">Civil Contract Labour Payment Amount</label>
                                <input defaultValue={modalHOARDING.civil_contractor_labour_payment} onChange={onModalInputChange} className="form-control mt-1" name="civil_contractor_labour_payment" type="text" placeholder="enter civil contract labour payment amount" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Fabrication Material Purchase Amount
                                </label>
                                <input defaultValue={modalHOARDING.fabrication_material} onChange={onModalInputChange} className="form-control mt-1" name="fabrication_material" type="text" placeholder="enter fabrication material purchase amount" />
                            </div>
                        </div>
                        <br />
                        <div className="row mt-2">
                            <div className="field col-md-6">
                                <label className="required">Fabricator Labour Payment Amount</label>
                                <input defaultValue={modalHOARDING.fabricator_labour_payment} onChange={onModalInputChange} className="form-control mt-1" name="fabricator_labour_payment" type="text" placeholder="enter civil contract labour payment amount" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Transport Changes If Any
                                </label>
                                <input defaultValue={modalHOARDING.transport_charges} onChange={onModalInputChange} className="form-control mt-1" name="transport_charges" type="text" placeholder="enter transport charges if any" />
                            </div>
                        </div>
                        <br />
                        <div className="row mt-2">
                            <div className="field col-md-6">
                                <label className="required">Electrician Selection</label>
                                {/* <input defaultValue={modalHOARDING.electrician_selection} onChange={onModalInputChange} className="form-control mt-1" name="electrician_selection" type="text" placeholder="select electrician" /> */}
                                <select defaultValue={modalHOARDING.electrician_selection} onChange={onModalInputChange} name="electrician_selection" onChange={onModalInputChange} className="form-control mt-1">
                                    <option>Select...</option>
                                    {read_electrician.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Electric Material Purchase Amount
                                </label>
                                <input defaultValue={modalHOARDING.electric_material_purchase} onChange={onModalInputChange} className="form-control mt-1" name="electric_material_purchase" type="text" placeholder="enter electric material purchase amount" />
                            </div>
                        </div>
                        <br />
                        <div className="row mt-2">
                            <div className="field col-md-6">
                                <label className="required">Electrician Labour Payment Amount
                                </label>
                                <input defaultValue={modalHOARDING.electrician_labour_payment} onChange={onModalInputChange} className="form-control mt-1" name="electrician_labour_payment" type="text" placeholder="enter electrician labour payment amount" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Fabricator</label>
                                <select defaultValue={modalHOARDING.fabricator} name="fabricator" className="form-control mt-1">
                                    <option>Select...</option>
                                    {read_labor.data.labor_master.map((labor)=>(
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <br />
                        <div className="field col-md-6">
                            <button className="btn btn-primary" style={{ marginRight: '50px', width: '25%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>

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
                margin: "0.5%",
                padding: "0.5%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>

                <br />
                <h4 className="text-center">HOARDING ERRECTION</h4>
                <br />
                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Location Provided By Agent Name</label>
                            <input type="text" name="location" onChange={onInputChange} className="form-control mt-1" placeholder="enter location provided by agent name" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Payment For Location To Agent Amount</label>
                            <input type="text" name="payment" onChange={onInputChange} className="form-control mt-1" placeholder="enter payment for location to agent amount" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Permission Cost Amount</label>
                            <input type="text" name="permission" onChange={onInputChange} className="form-control mt-1" placeholder="enter permission cost amount" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Excavator Selection</label>
                            {/* <input type="text" name="excavator" onChange={onInputChange} className="form-control mt-1" placeholder="select excavator" required /> */}
                            <select name="excavator" onChange={onInputChange} className="form-control mt-1">
                                <option>Select...</option>
                                {read_excavator.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Excavator Charges Amount</label>
                            <input type="text" name="excavator_charges" onChange={onInputChange} className="form-control mt-1" placeholder="enter excavator charges amount" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Civil Contractor Selection</label>
                            {/* <input type="text" name="civil_contractor" onChange={onInputChange} className="form-control mt-1" placeholder="select civil contractor" required /> */}
                            <select name="civil_contractor" onChange={onInputChange} className="form-control mt-1">
                                <option>Select...</option>
                                {read_civil_contractor.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Civil Material Purchase Amount</label>
                            <input type="text" name="civil_material" onChange={onInputChange} className="form-control mt-1" placeholder="enter civil material purchase amount" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Civil Contractor Labour Payment Amount</label>
                            <input type="text" name="civil_contractor_labour_payment" onChange={onInputChange} className="form-control mt-1" placeholder="enter civil contractor labour payment amount" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Fabrication Material Purchase Amount</label>
                            <input type="text" name="fabrication_material" onChange={onInputChange} className="form-control mt-1" placeholder="enter fabrication material purchase amount" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Fabricator Labour Payment Amount</label>
                            <input type="text" name="fabricator_labour_payment" onChange={onInputChange} className="form-control mt-1" placeholder="enter fabricator labour payment amount" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Transport Charges If Any</label>
                            <input type="text" name="transport_charges" onChange={onInputChange} className="form-control mt-1" placeholder="enter transport charges if any" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Fabricator Labour Payment Amount</label>
                            <input type="text" name="fabricator_labour_payment" onChange={onInputChange} className="form-control mt-1" placeholder="enter fabricator labour payment amount" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Electrician Selection</label>
                            {/* <input type="text" name="electrician_selection" onChange={onInputChange} className="form-control mt-1" placeholder="select electrician" required /> */}
                            <select name="electrician_selection" onChange={onInputChange} className="form-control mt-1">
                                <option>Select...</option>
                                {read_electrician.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Electric Material Purchase Amount</label>
                            <input type="text" name="electric_material_purchase" onChange={onInputChange} className="form-control mt-1" placeholder="enter electric material purchase amount" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Electrician Labour Payment Amount</label>
                            <input type="text" name="electrician_labour_payment" onChange={onInputChange} className="form-control mt-1" placeholder="enter electrician labour payment amount" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Fabricator</label>
                            <select name="fabricator" onChange={onInputChange} className="form-control mt-1">
                                <option>Select...</option>
                                {
                                    read_labor.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))
                                }
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