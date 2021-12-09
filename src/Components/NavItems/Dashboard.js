import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'
import { CSVLink, CSVDownload } from "react-csv";

const GET_INVENTORY = gql`
query MyQuery($hoarding_insurance_to:date!){
    Inventory_Master(where: {hoarding_insurance_to: {_eq: $hoarding_insurance_to}}){
      AvailabilityFrom
      AvailabilityTo
      State
      District
      Subdistrict
      DisplayRatePM
      
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
      
      Total
      Totalsqft
      Width
      
      hoarding_insurance
      id
      media_type_master {
        id
        media_type
      }
      
    }
  }
`

const READ_INVENTORY = gql`
query MyQuery {
    Inventory_Master {
      AvailabilityFrom
      AvailabilityTo
      State
      District
      Subdistrict
      DisplayRatePM
      
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
      
      Total
      Totalsqft
      Width
      
      hoarding_insurance
      id
      media_type_master {
        id
        media_type
      }
      
    }
  }
`
const INSERT_INSURANCE = gql`
mutation MyMutation($from_date: date = "", $insurance: String = "", $inventory: Int = 0, $to_date: date = "") {
    insert_hoarding_insurance_one(object: {from_date: $from_date, insurance: $insurance, inventory: $inventory, to_date: $to_date}) {
      id
    }
  }
`
const READ_INSURANCE = gql`
subscription MySubscription{
    hoarding_insurance(where: {insurance: {_eq: "No"}}) {
        Inventory_Master {
          Location
        }
        from_date
        id
        insurance
        inventory
        to_date
      }
  }
  
  
`

const UPDATE_INSURANCE=gql`
mutation MyMutation($from_date: date = "", $insurance: String = "", $inventory: Int = 0, $to_date: date = "", $id: Int = 0) {
    update_hoarding_insurance_by_pk(pk_columns: {id: $id}, _set: {from_date: $from_date, insurance: $insurance, inventory: $inventory, to_date: $to_date}) {
      id
    }
  }
  
`

const DELETE_INSURANCE=gql`
mutation MyMutation($id: Int = 0) {
    delete_hoarding_insurance_by_pk(id: $id) {
      id
    }
  }
  
  
`

function Hoarding_Insurance() {
    //states
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showhide, setShowhide] = useState('hidden');
    const [inventory, setInventory] = useState();
    const [insurance, setInsurance] = useState();
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();

    const [modalId, setModalId] = useState();
    const [modalInventory, setModalInventory] = useState();
    const [modalInsurance, setModalInsurance] = useState();
    const [modalFromDate, setModalFromDate] = useState();
    const [modalToDate, setModalToDate] = useState();
    //Queries
    const [insert_insurance] = useMutation(INSERT_INSURANCE);
    const [update_insurance] = useMutation(UPDATE_INSURANCE);
    const [delete_insurance] = useMutation(DELETE_INSURANCE);
    const read_inventory = useQuery(READ_INVENTORY);
    const read_insurance = useSubscription(READ_INSURANCE);
    const [get_inventory,ret_data] = useLazyQuery(GET_INVENTORY);
    if (read_inventory.loading || read_insurance.loading||ret_data.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    //Events
    const onInsuranceChange = (e) => {
        if (e.target.value === 'Yes') {
            setShowhide('visible');
        }
        else {
            setShowhide('hidden');
        }
        setInsurance(e.target.value);
        console.log(e.target.value);
    }
    const onInventoryChange = (e) => {
        setInventory(e.target.value);
    }
    const onFromDateChange = (e) => {
        setFromDate(e.target.value);
    }
    const onToDateChange = (e) => {
        setToDate(e.target.value)
    }
    const onModalIdChange = (e) => {
        setModalId(e.target.value);
    }
    const onModalInsuranceChange = (e) => {
        if (e.target.value === 'Yes') {
            setShowhide('visible');
        }
        else {
            setShowhide('hidden');
        }
        setModalInsurance(e.target.value);
        console.log(e.target.value);
    }
    const onModalInventoryChange = (e) => {
        setModalInventory(e.target.value);
    }
    const onModalFromDateChange = (e) => {
        setModalFromDate(e.target.value);
    }
    const onModalToDateChange = (e) => {
        setModalToDate(e.target.value)
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        insert_insurance({ variables: { inventory: inventory, insurance: insurance, from_date: fromDate, to_date: toDate } })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_insurance({ variables: {id:modalId, inventory: modalInventory, insurance: modalInsurance, from_date: modalFromDate, to_date: modalToDate } })
        toast.configure();
        toast.warning('Successfully Updated')
        handleClose()
    }
    const onEdit = (row) => {
        console.log(row.from_date)
        handleShow();
        setModalId(row.id);
        setModalInventory(row.inventory);
        setModalInsurance(row.insurance);
        setModalFromDate(row.from_date);
        setModalToDate(row.to_date);
    }
    const onDelete = (id) => {
        console.log(id);
        delete_insurance({ variables: { id: id } });
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
        // {
        //     field: 'inventory',
        //     headerName: 'Inventory',
        //     width: 200,
        //     editable: false,
        // },
        {
            field: 'inventory',
            headerName: 'Inventory',
            width: 160,
            valueGetter: (params) => {
                return params.row.Inventory_Master.Location;
            }
        },
        {
            field: 'insurance',
            headerName: 'Insurance',
            width: 200,
            editable: false,
        },
        // {
        //     field: 'from_date',
        //     headerName: 'From Date',
        //     width: 200,
        //     editable: false,
        // },
        // {
        //     field: 'to_date',
        //     headerName: 'To Date',
        //     width: 200,
        //     editable: false,
        // },
        {
            
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "250%", textAlign: 'center' }}>
                        {/* <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" style={{ marginRight: '10%' }} ><i className="bi bi-pencil-fill" onClick={() => { onEdit(params.row) }}></i></button> */}

                        {/* <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }}><i className="bi bi-trash-fill"></i></button> */}

                    </div>
                );
            }
        },
    ];
    const rows = read_insurance.data.hoarding_insurance;
    let newData=[]
    rows.map((item,index)=>{
        newData.push({sno:index+1,...item})
    }) 
    get_inventory({variables:{hoarding_insurance_to:(new Date()).toISOString().split('T')[0]}})
    //console.log((new Date()).toISOString().split('T')[0]);
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Insurance Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-group" onSubmit={onModalFormSubmit}>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">ID</label>
                                <input defaultValue={modalId} onChange={onModalIdChange} className="form-control mt-1" name="id" type="text" />
                            </div>

                            <div className="field col-md-6">
                                <label className="required">Inventory</label>
                                <select defaultValue={modalInventory} onChange={onModalInventoryChange} className="form-control mt-1">
                                    <option>--SELECT--</option>
                                    {read_inventory.data.Inventory_Master.map(inventory => (
                                        <option key={inventory.id} value={inventory.id}>{inventory.Location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Hoarding Insurance</label>
                                <select defaultValue={modalInsurance} onChange={onModalInsuranceChange} className="form-control mt-2" >
                                    <option>Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                        <div className="field col-md-6">
                                <label className="required">From Date</label>
                                <input defaultValue={modalFromDate} onChange={onModalFromDateChange} className="form-control mt-1" name="fromadte" type="date" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">To Date</label>
                                <input defaultValue={modalToDate} onChange={onModalToDateChange} className="form-control mt-1" name="fromadte" type="date" />
                            </div>
                            
                        </div>
                        <br />
                        <div className="field">
                            <button className="btn btn-primary">Save</button>
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
                {/* <form onSubmit={onFormSubmit} className='form-group'> */}
                    {/* <div className="col-md-12"> */}
                        
                        <h4 style={{ width: '100%', textAlign: 'center' }}>Dashboard</h4>
                      
                        {/* <Divider style={{ marginBottom: '8px', }} /> */}
                        {/* <div className="row mt-3">
                            <div className="field col-md-4 ">
                                <label className="required">Inventory</label>
                                <select className="form-control mt-1" onChange={onInventoryChange}>
                                    <option>--SELECT--</option>
                                    {read_inventory.data.Inventory_Master.map(inventory => (
                                        <option key={inventory.id} value={inventory.id}>{inventory.Location}</option>
                                    ))}
                                </select>
                            </div>
                        </div> */}
                        {/* <div className="row mt-3">
                            <div className="field col-md-4 ">
                                <label className="required">Hoarding Insurance</label>
                                <select className="form-control mt-2" onChange={onInsuranceChange} >
                                    <option>Select...</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                            </div>
                            <div className="field col-md-2 " style={{ visibility: showhide }} onChange={onFromDateChange}>
                                <label className="required">From Date</label>
                                <input type="date" className="form-control" />
                            </div>
                            <div className="field col-md-2 " style={{ visibility: showhide }} onChange={onToDateChange}>
                                <label className="required">To Date</label>
                                <input type="date" className="form-control" />
                            </div>
                        </div> */}

                    {/* </div> */}
                    
                    {/* <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '18px', marginLeft: '-130px', width: '8%' }}>Save</button>
                        <button className="btn btn-primary" type='reset' style={{ marginRight: '10px', width: '8%' }}>Reset</button>
                       
                    </div> */}
                 
                {/* </form> */}
            </Card>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                marginTop: "2px",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <div style={{ height: 300, width: '100%' }}>
                    <h4>Insurance Reminder</h4>
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

        </div>
    )
}

export default Hoarding_Insurance