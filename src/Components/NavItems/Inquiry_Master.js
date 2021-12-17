import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'
import { CSVLink, CSVDownload } from "react-csv";
import exportFromJSON from 'export-from-json'


const READ_MEDIA = gql`
query MyQuery($_eq: String = "false") {
    media_type_master(where: {isDeleted: {_eq: $_eq}}) {
      id
      media_type
    }
  }
  
`
const READ_INVENTORY = gql`
query MyQuery($_eq: String = "true"){
    Inventory_Master(where: {isDeleted: {_eq: $_eq}}){
      AvailabilityFrom
      AvailabilityTo
      BookedBy
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
      Subdistrict
      Total
      Totalsqft
      Width
      erection
      geoLocationByState {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      geoLocationBySubdistrict {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      geo_location {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      hoarding_errection {
        civil_contractor
        civil_contractor_labour_payment
        civil_material
        electric_material_purchase
        electrician_labour_payment
        electrician_selection
        excavator
        excavator_charges
        fabrication_material
        fabricator
        fabricator_labour_payment
        id
        isDeleted
        laborMasterByElectricianSelection {
          address
          bank_id
          gst_no
          id
          isDeleted
          labor_type
          mobile_no
          name
          pan
        }
        laborMasterByExcavator {
          address
          bank_id
          gst_no
          id
          isDeleted
          labor_type
          mobile_no
          name
          pan
        }
        laborMasterByFabricator {
          address
          bank_id
          gst_no
          id
          isDeleted
          mobile_no
          labor_type
          name
          pan
        }
        labor_master {
          address
          bank_id
          gst_no
          id
          isDeleted
          labor_type
          mobile_no
          name
          pan
        }
        location
        payment
        permission
        transport_charges
      }
      hoarding_insurance
      hoarding_insurance_from
      hoarding_insurance_to
      id
      isDeleted
      media_type_master {
        id
        isDeleted
        media_type
      }
    }
  }  
`



const INSERT_INQUIRY = gql`
mutation MyMutation($inventory: Int! $email_id: String = "", $name: String = "", $number: String = "", $sol: String = "", $whatsapp_number: String = "",$start_date:date!,$media_type:Int!,$status:String!) {
    insert_inquiry_master_one(object: {inventory: $inventory, email_id: $email_id, name: $name, number: $number, sol: $sol, whatsapp_number: $whatsapp_number,start_date:$start_date,media_type:$media_type,status:$status}) {
      id
    }
  }
`
const UPDATE_INQUIRY = gql`
mutation MyMutation($email_id: String = "", $inventory: Int!, $name: String = "", $number: String = "", $sol: String = "", $whatsapp_number: String = "", $id: Int!,$start_date:date!,$media_type:Int!,$status:String!) {
    update_inquiry_master_by_pk(pk_columns: {id: $id}, _set: {email_id: $email_id, inventory: $inventory, name: $name, number: $number, sol: $sol, whatsapp_number: $whatsapp_number,start_date:$start_date,media_type:$media_type,status:$status}) {
      id
    }
  }
`
// const DELETE_INQUIRY = gql`
// mutation MyMutation($id: Int!) {
//   delete_inquiry_master_by_pk(id: $id) {
//     id
//   }
// }
// `

const DELETE_INQUIRY = gql`
mutation MyMutation($isDeleted: String = "true", $id: Int = 0) {
    update_inquiry_master_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }
`

const READ_INQUIRY = gql`
subscription MySubscription($_eq: String = "false"){
    inquiry_master(where: {isDeleted: {_eq: $_eq}}){
      email_id
      Inventory_Master {
        AvailabilityFrom
        AvailabilityTo
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
      id
      inventory
      name
      number
      sol
      start_date
      whatsapp_number
      media_type
      media_type_master {
        id
        media_type
        }
        status
    }
  }
`
const SEARCH_INVENTORYALL = gql`
query MyQuery($state:Int!,$district:Int!,$subdistrict:Int!,$media_type:Int!,$_gt:date!){
    Inventory_Master(where: {District: {_eq:$district}, Media_Type: {_eq:$media_type}, State: {_eq:$state}, Subdistrict: {_eq:$subdistrict}, AvailabilityTo: {_lt:$_gt}}) {
      AvailabilityFrom
      AvailabilityTo
      BookedBy
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
      Subdistrict
      Total
      Totalsqft
      Width
      erection
      geoLocationByState {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      geoLocationBySubdistrict {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      geo_location {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      hoarding_errection {
        civil_contractor
        civil_contractor_labour_payment
        civil_material
        electric_material_purchase
        electrician_labour_payment
        electrician_selection
        excavator
        excavator_charges
        fabrication_material
        isDeleted
        id
        fabricator_labour_payment
        fabricator
      }
      hoarding_insurance
      hoarding_insurance_from
      hoarding_insurance_to
      id
      isDeleted
      media_type_master {
        id
        isDeleted
        media_type
      }
    }
  }  
`

const SEARCH_INVENTORY = gql`
query MyQuery($state:Int!,$district:Int!,$subdistrict:Int!,$media_type:Int!,$illumination:String="",$_gt:date!){
    Inventory_Master(where: {District: {_eq:$district}, Media_Type: {_eq:$media_type}, State: {_eq:$state}, Subdistrict: {_eq:$subdistrict}, Illumination: {_eq:$illumination}, AvailabilityTo: {_lt:$_gt}}) {
      AvailabilityFrom
      AvailabilityTo
      BookedBy
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
      Subdistrict
      Total
      Totalsqft
      Width
      erection
      geoLocationByState {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      geoLocationBySubdistrict {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      geo_location {
        external_id
        id
        location_type
        name
        parent_id
        pin
      }
      hoarding_errection {
        civil_contractor
        civil_contractor_labour_payment
        civil_material
        electric_material_purchase
        electrician_labour_payment
        electrician_selection
        excavator
        excavator_charges
        fabrication_material
        isDeleted
        id
        fabricator_labour_payment
        fabricator
      }
      hoarding_insurance
      hoarding_insurance_from
      hoarding_insurance_to
      id
      isDeleted
      media_type_master {
        id
        isDeleted
        media_type
      }
    }
  }  
`
const READ_STATES = gql`
query MyQuery {
    geo_locations {
      pin
      parent_id
      name
      location_type
      id
      external_id
    }
  }  
`
const READ_DISTRICT = gql`
query MyQuery($_eq: Int!) {
    geo_locations(where: {parent_id: {_eq: $_eq}}) {
      pin
      parent_id
      name
      location_type
      id
      external_id
    }
  }  
`
const READ_SUBDISTRICT = gql`
query MyQuery($_eq: Int!) {
    geo_locations(where: {parent_id: {_eq: $_eq}}) {
      pin
      parent_id
      name
      location_type
      id
      external_id
    }
  }  
`
export default function Inquiry_Master() {
    //variables
    var data_state = "";
    var data_district = "";
    var data_subdistrict = "";
    //States
    const [selected, setSelected] = useState();
    const [showhide, setShowhide] = useState('hidden');
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [state, setState] = useState();
    const [district, setDistrict] = useState();
    const [subdistrict, setSubdistrict] = useState();
    const [illumination, setIllumination] = useState();
    const [searchMediaType, setSearchMediaType] = useState();
    const [searchDate, setSearchDate] = useState();
    const [location, setLocation] = useState();
    const [inventoryData, setInventoryData] = useState();

    //Form states
    const [sol, setSol] = useState();
    const [name, setName] = useState();
    const [number, setNumber] = useState();
    const [emailid, setEmailid] = useState();
    const [whatsappNumber, setWhatsappNumber] = useState();
    const [startDate, setStartDate] = useState();

    const [media_type, setMedia_type] = useState();
    const [status, setStatus] = useState();
    //Modal states
    const [modalId, setModalId] = useState();
    const [modalSol, setModalSol] = useState();
    const [modalName, setModalName] = useState();
    const [modalNumber, setModalNumber] = useState();
    const [modalEmailid, setModalEmailid] = useState();
    const [modalWhatsappNumber, setModalWhatsappNumber] = useState();
    const [modalStartDate, setModalStartDate] = useState();

    const [modalMedia_type, setModalMedia_type] = useState();
    const [modalStatus, setModalStatus] = useState();
    const [modalLocation, setModalLocation] = useState();
    //Queries
    const [insert_inquiry] = useMutation(INSERT_INQUIRY);
    const [update_inquiry] = useMutation(UPDATE_INQUIRY);
    const [delete_inquiry] = useMutation(DELETE_INQUIRY);
    // const [get_district, read_district] = useLazyQuery(READ_DISTRICT);
    // const [get_subdistrict, read_subdistrict] = useLazyQuery(READ_SUBDISTRICT);
    const read_media = useQuery(READ_MEDIA);
    const read_inventory = useQuery(READ_INVENTORY);
    const read_inquiry = useSubscription(READ_INQUIRY);
    const [loadInventory, { loading, error, data }] = useLazyQuery(SEARCH_INVENTORY);
    const read_states = useQuery(READ_STATES);
    const [loadInventoryAll, invData] = useLazyQuery(SEARCH_INVENTORYALL);

    //Loader
    if (read_states.loading || read_inquiry.loading || read_inventory.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;

    const onStateChange = (state_data) => {
        setState(state_data.id)
        // get_district({ variables: { _eq: parseInt(state_data.id) } })
    }
    const onDistrictChange = (district_data) => {
        setDistrict(district_data.id)
        // get_subdistrict({ variables: { _eq: parseInt(district_data.id) } })
    }
    const onSubdistrictChange = (subdistrict_data) => {
        setSubdistrict(subdistrict_data.id);
    }
    const onIlluminationChange = (e) => {
        setIllumination(e.target.value);
    }
    const onsearchMediaTypeChange = (e) => {
        setSearchMediaType(e.target.value)
    }
    const onDateChange = (e) => {
        setSearchDate(e.target.value);
    }

    const onSearch = (e) => {
        setShowhide("visible");
        e.preventDefault();
        if (illumination === "ALL") {
            loadInventoryAll({ variables: { state: state, district: district, subdistrict: subdistrict, illumination: "", media_type: searchMediaType, _gt: searchDate } })
        }
        else {
            loadInventory({ variables: { state: state, district: district, subdistrict: subdistrict, illumination: illumination, media_type: searchMediaType, _gt: searchDate } })
        }
    }
    const onFormSOLChange = (e) => {
        setSol(e.target.value);
    }
    const onFormNameChange = (e) => {
        setName(e.target.value)
    }
    const onFormNumberChange = (e) => {
        setNumber(e.target.value)
    }
    const onFormEmailIdChange = (e) => {
        setEmailid(e.target.value)
    }
    const onFormWhatsappNumberChange = (e) => {
        setWhatsappNumber(e.target.value);
    }
    const onStartDateChange = (e) => {
        setStartDate(e.target.value);
    }

    const onMediaChange = (e) => {
        setMedia_type(e.target.value);
    }
    const onStatusChange = (e) => {
        setStatus(e.target.value);
    }
    //Modal Statets
    const onModalIdChange = (e) => {
        setModalId(e.target.value)
    }
    const onModalSOLChange = (e) => {
        setModalSol(e.target.value);
    }
    const onModalNameChange = (e) => {
        setModalName(e.target.value)
    }
    const onModalNumberChange = (e) => {
        setModalNumber(e.target.value)
    }
    const onModalEmail_idChange = (e) => {
        setModalEmailid(e.target.value)
    }
    const onModalWhatsappNumberChange = (e) => {
        setModalWhatsappNumber(e.target.value);
    }
    const onModalLocationChange = (e) => {
        setModalLocation(e.target.value);
    }
    const onModalStartDateChange = (e) => {
        setModalStartDate(e.target.value);
    }

    const onModalMediaChange = (e) => {
        setModalMedia_type(e.target.value);
    }
    const onModalStatusChange = (e) => {
        setModalStatus(e.target.value);
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        for (var i = 0; i < selected.length; i++) {
            console.log(selected[i]);
            insert_inquiry({ variables: { sol: sol, name: name, number: number, email_id: emailid, whatsapp_number: whatsappNumber, inventory: selected[i], start_date: startDate, media_type: media_type, status: status } })
        }

        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit = (row) => {
        //console.log(row)
        handleShow();
        setModalId(row.id);
        setModalSol(row.sol);
        setModalName(row.name);
        setModalNumber(row.number);
        setModalEmailid(row.email_id);
        setModalWhatsappNumber(row.whatsapp_number);
        setModalStartDate(row.start_date);

        setModalMedia_type(row.media_type);
        setModalStatus(row.status);
        setModalLocation(row.Inventory_Master.id)
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_inquiry({ variables: { id: modalId, sol: modalSol, name: modalName, number: modalNumber, email_id: modalEmailid, whatsapp_number: modalWhatsappNumber, inventory: modalLocation, start_date: modalStartDate, media_type: modalMedia_type, status: modalStatus } })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete = (id) => {
        delete_inquiry({ variables: { id: id } })
        toast.configure();
        toast.error('Successfully Deleted')
    }

    const columns1 = [
        {
            field: 'id',
            headerName: 'Id',
            width: 160,
        },
        {
            field: 'State',
            headerName: 'State',
            width: 200
        },
        {
            field: 'District',
            headerName: 'District',
            width: 200
        },
        {
            field: 'Subdistrict',
            headerName: 'Subdistrict',
            width: 200
        },
        {
            field: 'Location',
            headerName: 'Location',
            width: 200
        },
        {
            field: 'Media_Type',
            headerName: 'Media_Type',
            width: 180,
            valueGetter: (params) => {
                return params.row.media_type_master.media_type;
            }
        },
        {
            field: 'Illumination',
            headerName: 'Illumination',
            width: 200
        },
        {
            field: 'Width',
            headerName: 'Width',
            width: 200
        },
        {
            field: 'Height',
            headerName: 'Height',
            width: 200
        },
        {
            field: 'NoofDisplay',
            headerName: 'No Of Display',
            width: 200
        },
        {
            field: 'Totalsqft',
            headerName: 'Total Sq ft',
            width: 200
        },
        {
            field: 'DrpmRate',
            headerName: 'DrpmRate',
            width: 200
        },
        {
            field: 'DisplayRatePM',
            headerName: 'DisplayRatePM',
            width: 200
        },
        {
            field: 'OtpcRate',
            headerName: 'OneTimePrintingCostRate',
            width: 200
        },
        {
            field: 'OneTimePrintingCost',
            headerName: 'OneTimePrintingCost',
            width: 200
        },
        {
            field: 'OtmcRate',
            headerName: 'OneTimeMountingCostRate',
            width: 200
        },
        {
            field: 'OneTimeMountingCost',
            headerName: 'OneTimeMountingCost',
            width: 200
        },
        {
            field: 'Total',
            headerName: 'Total',
            width: 200
        },
        {
            field: 'AvailabilityFrom',
            headerName: 'Booking From',
            width: 200
        },
        {
            field: 'AvailabilityTo',
            headerName: 'Booking To',
            width: 200
        },
    ]
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
            field: 'sol',
            headerName: 'Source Of Lead',
            width: 160
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 160
        },
        {
            field: 'number',
            headerName: 'Number',
            width: 160,
        },
        {
            field: 'email_id',
            headerName: 'Email Id',
            width: 160,
        },
        {
            field: 'whatsapp_number',
            headerName: 'Whatsapp Number',
            width: 190
        },
        {
            field: 'start_date',
            headerName: 'Start Date',
            width: 190
        },

        {
            field: 'Media_Type',
            headerName: 'Media_Type',
            width: 180,
            valueGetter: (params) => {
                return params.row.media_type_master.media_type;
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 190
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
    const rows = read_inquiry.data.inquiry_master;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    const emptyarr = [
        {
            id: "",
            AvailabilityFrom: "",
            AvailabilityTo: "",
            DisplayRatePM: "",
            DrpmRate: "",
            Height: "",
            Illumination: "",
            State: "",
            District: "",
            Subdistrict: "",
            Location: "",
            Media_Type: "",
            NoofDisplay: "",
            OneTimeMountingCost: "",
            OneTimePrintingCost: "",
            OtmcRate: "",
            OtpcRate: "",
            Total: "",
            Totalsqft: "",
            Width: "",
            media_type_master: {
                id: "",
                media_type: ""
            },
        }
    ]
    var rows1 = emptyarr;
    //console.log(data);
    if (illumination === "ALL") {
        if (invData.data) {
            rows1 = invData.data.Inventory_Master;
        }
    }
    else {
        if (data) {
            rows1 = data.Inventory_Master;
        }
    }


    return (
        <div>

            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Edit Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <form className="form-group" onSubmit={onModalFormSubmit}>
                            <div className="row">
                                <div className="field col-md-6">
                                    <label className="required">ID</label>
                                    <input defaultValue={modalId} onChange={onModalIdChange} className="form-control mt-1" name="id" type="text" required />
                                </div>
                                <div className="field col-md-6">
                                    <label className="required">Customer Name</label>
                                    <input defaultValue={modalName} onChange={onModalNameChange} className="form-control mt-1" name="name" type="text" required pattern="^[a-zA-Z\s-]+$" title="Please enter Alphabets." />
                                </div>
                            </div>

                            <div className="row">
                                <div className="field col-md-6">
                                    <label className="required">Customer Number</label>
                                    <input defaultValue={modalNumber} onChange={onModalNumberChange} className="form-control mt-1" name="contact_person" type="number" required pattern="[789][0-9]{9}" title="Please enter Alphabets." />
                                </div>
                                <div className="field col-md-6">
                                    <label className="required">Email ID</label>
                                    <input defaultValue={modalEmailid} onChange={onModalEmail_idChange} className="form-control mt-1" name="email_id" type="tel" required pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" title="Please enter valid email" />
                                </div>
                            </div>
                            <div className="row">

                                <div className="field col-md-6">
                                    <label className="required">Whatsapp Number</label>
                                    <input defaultValue={modalWhatsappNumber} onChange={onModalWhatsappNumberChange} className="form-control mt-1" name="whatsappNumber" type="number" pattern="[789][0-9]{9}" required />
                                </div>
                                <div className="field col-md-6">
                                    <label className="required">Source Of Lead</label>
                                    <input defaultValue={modalSol} onChange={onModalSOLChange} className="form-control mt-1" required />
                                </div>
                                <div className="field col-md-6">
                                    <label className="required">Location</label>

                                    <select onChange={onModalLocationChange} className="form-control" defaultValue={modalLocation}>
                                        <option>Select...</option>
                                        {read_inventory.data.Inventory_Master.map((inventory) => (
                                            <option key={inventory.id} value={inventory.id}>{inventory.Location}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field col-md-6">
                                    <label className="required">Date</label>
                                    <input type="date" readonly defaultValue={modalStartDate} onChange={onModalStartDateChange} className="form-control mt-1" required />
                                </div>

                            </div>

                            <div className="row">

                                <div className="field col-md-6">
                                    <label>Media Type</label>
                                    <select defaultValue={modalMedia_type} className="form-control" onChange={onModalMediaChange}>
                                        <option>Select...</option>
                                        {read_media.data.media_type_master.map((media) => (
                                            <option key={media.id} value={media.id}>{media.media_type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="field col-md-6">
                                    <label>Status</label>
                                    <select defaultValue={modalStatus} onChange={onModalStatusChange} className="form-control">
                                        <option>Select...</option>
                                        <option>Completed</option>
                                        <option>In Process</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <div className="field">
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

                <form className="form-group" padding="2px">
                    <h4 className="text-center">INQUIRY MASTER</h4>
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Source Of Lead</label>
                            <input placeholder="enter source of lead" type="text" name="form_sol" onChange={onFormSOLChange} className="form-control mt-1" pattern="^[a-zA-Z\s-]+$" title="Please enter source of lead." />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Customer Name</label>
                            <input placeholder="enter customer name" type="text" name="form_name" onChange={onFormNameChange} className="form-control mt-1" pattern="^[a-zA-Z\s-]+$" title="Please enter customer name." />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Customer Number</label>
                            <input placeholder="enter customer number" type="number" name="form_number" onChange={onFormNumberChange} className="form-control mt-1" pattern="[789][0-9]{9}" title="Please enter valid mobile no" />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Email ID</label>
                            <input placeholder="enter email id" type="email" name="form_email_id" onChange={onFormEmailIdChange} className="form-control mt-1" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" title="Please enter valid email address" />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Whatsapp Number</label>
                            <input placeholder="enter whatsapp number" type="number" name="form_whatsapp_no" onChange={onFormWhatsappNumberChange} className="form-control mt-1" pattern="[789][0-9]{9}" title="Please enter whatsapp" />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Start Date</label>
                            <input placeholder="enter start date" type="date" name="start_date" onChange={onStartDateChange} className="form-control mt-1" title="Please enter start date" />
                        </div>
                    </div><br />

                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Media Type</label>
                            {/* <input placeholder="enter media type" type="text" name="media_type" onChange={onDowntimeChange} className="form-control mt-1" title="Please enter media type" /> */}
                            <select className="form-control" onChange={onMediaChange}>
                                <option>Select...</option>
                                {read_media.data.media_type_master.map((media) => (
                                    <option key={media.id} value={media.id}>{media.media_type}</option>
                                ))}
                            </select>
                        </div><br />
                        <div className="field col-md-6">
                            <label>Status</label>
                            <select className="form-control" onChange={onStatusChange}>
                                <option>Select...</option>
                                <option>Completed</option>
                                <option>In Process</option>
                            </select>
                        </div>
                    </div>

                </form>
            </Card>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "8%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}><form className="form-group">

                    <div className="row">
                        <div className="field col-md-4">
                            <label className="required">State</label>
                            <Select
                                name="state"
                                options={
                                    read_states.data.geo_locations.filter((states) => states.location_type.includes("STATE"))
                                }
                                onChange={onStateChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">District</label>
                            <Select
                                name="district"
                                options={read_states.data.geo_locations.filter(function (currentElement) {
                                    if (currentElement.location_type === "DISTRICT" && currentElement.parent_id === state) {
                                        //console.log(currentElement);
                                        return currentElement;
                                    }
                                }
                                )}
                                onChange={onDistrictChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Subdistrict</label>
                            <Select
                                name="subdistrict"
                                options={read_states.data.geo_locations.filter(function (currentElement) {
                                    if (currentElement.location_type === "SUBDISTRICT" && currentElement.parent_id === district) {
                                        //console.log(currentElement);
                                        return currentElement;
                                    }
                                }
                                )}
                                onChange={onSubdistrictChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-4">
                            <label>Illumination</label>
                            <select className="form-control" onChange={onIlluminationChange}>
                                <option>Select...</option>
                                <option>F LIT</option>
                                <option>NON LIT</option>
                                <option>ALL</option>
                            </select>
                        </div>
                        <div className="field col-md-4">
                            <label>Media Type</label>
                            <select className="form-control" onChange={onsearchMediaTypeChange}>
                                <option>Select...</option>
                                {read_media.data.media_type_master.map((media) => (
                                    <option key={media.id} value={media.id}>{media.media_type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field col-md-4">
                            <label>Date</label>
                            <input type="date" className="form-control" onChange={onDateChange} />
                        </div>

                    </div><br />
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button onClick={onSearch} className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '21%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Search</button>
                    </div>
                    <br />
                </form>
                <div style={{ height: 500, width: '100%', visibility: showhide }}>
                    <DataGrid
                        rows={rows1}
                        columns={columns1}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                        checkboxSelection
                        onSelectionModelChange={itm => setSelected(itm)}
                    />
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button onClick={onFormSubmit} className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>
                        <button className="btn btn-primary" type="reset" style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Reset</button>
                        <br />
                        <br />
                    </div>
                </div>

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