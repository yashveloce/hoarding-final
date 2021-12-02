import React, { useState, useRef } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useLazyQuery, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'
import axios from 'axios';
import { ContactSupportOutlined } from '@material-ui/icons';


const READ_INVENTORY = gql`
query MyQuery($_eq: String = "false"){
    Inventory_Master(where: {isDeleted: {_eq: $_eq}}){
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
const SEARCH_QUICK_MEDIA = gql`
query MyQuery($_eq: String = "Booked", $mobile_no: String!, $_eq1: String = "false") {
    quick_media(where: {mobile_no: {_eq: $mobile_no}, inquiry_master: {Inventory_Master: {Status: {_neq: $_eq}}}, isDeleted: {_eq: $_eq1}}) {
      inquiry
      mobile_no
      proposal_no
      id
      inquiry_master {
        Inventory_Master {
          Location
        }
      }
    }
  }
    
  
  
`
const SEARCH_INQUIRY = gql`
query MyQuery($number: String!, $_eq: String = "false") {
    inquiry_master(where: {number: {_eq: $number}, isDeleted: {_eq: $_eq}}) {
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
        OneTimePrintingCost
        OneTimeMountingCost
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
      email_id
      id
      inventory
      name
      number
      sol
      start_date
      whatsapp_number
    }
  }
  
`
const READ_INQUIRY = gql`
query MyQuery($_eq: String = "false"){
    inquiry_master(where: {isDeleted: {_eq: $_eq}}){
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
        OneTimePrintingCost
        OneTimeMountingCost
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
      email_id
      
      id
      inventory
      name
      number
      sol
      start_date
      whatsapp_number
    }
  }
  
`

const READ_LABOR = gql`
subscription MySubscription($_eq: String = "false"){
    labor_master(where: {isDeleted: {_eq: $_eq}}){
      address
      bank_id
      gst_no
      id
      labor_type
      mobile_no
      name
      pan
    }
  }
`


const Read_Printer = gql`
subscription MySubscription($_eq: String = "false") {
    labor_master(where: {labor_type: {_eq: 17}, isDeleted: {_eq: $_eq}}) {
      id
      labor_type
      name
    }
  }  
`
const Read_Mounter = gql`
subscription MySubscription($_eq: String = "false") {
    labor_master(where: {labor_type: {_eq: 18}, isDeleted: {_eq: $_eq}}) {
      id
      labor_type
      name
    }
  }
  
`
const Read_Electrician = gql`
subscription MySubscription($_eq: String = "false") {
    labor_master(where: {labor_type: {_eq: 20}, isDeleted: {_eq: $_eq}}) {
      id
      labor_type
      name
    }
  }
  
  
`
const Read_Designer = gql`
subscription MySubscription($_eq: String = "false") {
    labor_master(where: {labor_type: {_eq: 19}, isDeleted: {_eq: $_eq}}) {
      id
      labor_type
      name
    }
  }  
  `
const INSERT_BOOKING = gql`
mutation MyMutation($Confirmation: String!, $Designer: Int = 10, $Electrician: Int = 10, $End_Date_Photo: String = "", $Monitoring_Photo: String = "", $Mounter: Int = 10, $PO: String = "", $Printer: Int = 10, $Shortlisted: String!, $Start_Date_Photo: String = "",$Start_Date:date!,$End_Date:date!,$Sites:Int!) {
    insert_Booking_Calender_one(object: {Confirmation: $Confirmation, Designer: $Designer, Electrician: $Electrician, End_Date_Photo: $End_Date_Photo, Monitoring_Photo: $Monitoring_Photo, Mounter: $Mounter, PO: $PO, Printer: $Printer, Shortlisted: $Shortlisted, Start_Date_Photo: $Start_Date_Photo,Start_Date:$Start_Date,End_Date:$End_Date,Sites:$Sites}) {
      id
    }
  }
`

const READ_BOOKING = gql`
subscription MySubscription($_eq: String = "false"){
    Booking_Calender(where: {isDeleted: {_eq: $_eq}}){
      Confirmation
      Designer
      Electrician
      End_Date
      End_Date_Photo
      Monitoring_Photo
      Mounter
      PO
      Printer
      Shortlisted
      Sites
      Start_Date
      Start_Date_Photo
      id
      laborMasterByElectrician {
        name
        id
      }
      laborMasterByMounter {
        id
        name
      }
      laborMasterByPrinter {
        id
        name
      }
      labor_master {
        id
        name
      }
      quick_medium {
        id
        inquiry
        mobile_no
        proposal_no
        inquiry_master {
          Inventory_Master {
            id
            Location
          }
          email_id
          id
          inventory
          media_type
        }
      }
    }
  }
     
`

const UPDATE_BOOKING = gql`
mutation MyMutation($id: Int!, $Confirmation: Int = 10, $Designer: Int = 10, $Electrician: Int = 10, $End_Date_Photo: String = "", $Monitoring_Photo: String = "", $Mounter: Int = 10, $PO: String = "", $Printer: Int = 10, $Shortlisted: Int = 10, $Start_Date_Photo: String = "") {
    update_Booking_Calender_by_pk(pk_columns: {id: $id}, _set: {Confirmation: $Confirmation, Designer: $Designer, Electrician: $Electrician, End_Date_Photo: $End_Date_Photo, Monitoring_Photo: $Monitoring_Photo, Mounter: $Mounter, PO: $PO, Printer: $Printer, Shortlisted: $Shortlisted, Start_Date_Photo: $Start_Date_Photo}) {
      id
    }
  }
`


// const Update_Inventory=gql`
// mutation MyMutation($Status: String = "") {
//     update_Inventory_Master_by_pk(pk_columns: {id: 0}, _set: {Status: $Status}) {
//       Status
//     }
//   }
// `




// const DELETE_BOOKING = gql`
// mutation MyMutation($id: Int!) {
//     delete_Booking_Calender_by_pk(id: $id) {
//       id
//     }
//   }  
// `

const DELETE_BOOKING = gql`
mutation MyMutation($isDeleted: String = "true", $id: Int = 0) {
    update_Booking_Calender_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }
  
`

const UPDATE_INVENTORY = gql`
mutation MyMutation($id: Int!, $AvailabilityFrom: date="2021-11-23", $AvailabilityTo: date="2021-11-23",$Status:String="Booked",$BookedBy:String!) {
    update_Inventory_Master_by_pk(pk_columns: {id: $id}, _set: {AvailabilityFrom: $AvailabilityFrom, AvailabilityTo: $AvailabilityTo,Status:$Status,BookedBy:$BookedBy}) {
      AvailabilityFrom
      AvailabilityTo
      Status
      BookedBy
    }
  }
`
const READ_QUICK_MEDIA = gql`
query MyQuery($_eq: String = "false"){
    quick_media(where: {isDeleted: {_eq: $_eq}}){
      inquiry
      id
      mobile_no
      inquiry_master {
        Inventory_Master {
          Location
        }
      }
    }
  }
  `
const GET_DATA = gql`
query MyQuery($id: Int = 0, $_eq1: String = "false") {
    quick_media(where: {id: {_eq: $id}, isDeleted: {_eq: $_eq1}}) {
      inquiry_master {
        Inventory_Master {
          id
        }
      }
    }
  }
  
  `

const UPDATE_BOOKING_ON_DELETE = gql`
  mutation MyMutation($id: Int!, $BookedBy: String="") {
    update_Inventory_Master_by_pk(pk_columns: {id: $id}, _set: {BookedBy: $BookedBy}) {
      BookedBy
    }
  }  
  `
const UPDATE_INQUIRY = gql`
  mutation MyMutation($id: Int = 0, $status: String = "") {
    update_inquiry_master_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
      id
    }
  }
  `

function Booking() {
    //States
    const [selected, setSelected] = useState();
    const [get_data, setGet_data] = useState();
    const [username, setUsername] = useState();
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [shortlisted, setShortlisted] = useState();
    const [confirmation, setConfirmation] = useState();
    const [PO, setPO] = useState();
    const [designer, setDesigner] = useState();
    const [printer, setPrinter] = useState();
    const [mounter, setMounter] = useState();
    const [electrician, setElectrician] = useState();
    const [startDatePhoto, setStartDatePhoto] = useState();
    const [monitoringPhoto, setMonitoringPhoto] = useState();
    const [endDatePhoto, setEndDatePhoto] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [Booked, setBooked] = useState();
    //Modal states
    const [modalId, setModalId] = useState();
    const [modalShortlisted, setModalShortlisted] = useState();
    const [modalConfirmation, setModalConfirmation] = useState();
    const [modalPO, setModalPO] = useState();
    const [modalDesigner, setModalDesigner] = useState();
    const [modalPrinter, setModalPrinter] = useState();
    const [modalMounter, setModalMounter] = useState();
    const [modalElectrician, setModalElectrician] = useState();
    const [modalStartDatePhoto, setModalStartDatePhoto] = useState();
    const [modalMonitoringPhoto, setModalMonitoringPhoto] = useState();
    const [modalEndDatePhoto, setModalEndDatePhoto] = useState();
    const [modalStartDate, setModalStartDate] = useState();
    const [modalEndDate, setModalEndDate] = useState();
    //Queries
    const [update_inventory] = useMutation(UPDATE_INVENTORY);
    const [insert_booking] = useMutation(INSERT_BOOKING);
    const [update_booking] = useMutation(UPDATE_BOOKING);
    const [delete_booking] = useMutation(DELETE_BOOKING);
    const [update_booking_on_delete] = useMutation(UPDATE_BOOKING_ON_DELETE);
    const [update_inquiry] = useMutation(UPDATE_INQUIRY);
    const read_inventory = useQuery(READ_INVENTORY);
    const read_inquiry = useQuery(READ_INQUIRY);
    const read_labor = useSubscription(READ_LABOR);
    const read_booking = useSubscription(READ_BOOKING);
    const read_printer = useSubscription(Read_Printer);
    const read_electrician = useSubscription(Read_Electrician);
    const read_mounter = useSubscription(Read_Mounter);
    const read_designer = useSubscription(Read_Designer);
    const read_quick_media = useQuery(READ_QUICK_MEDIA);
    const [get_inventory, get_return_data] = useLazyQuery(GET_DATA, {
        onCompleted: data => {
            // console.log('data ', data);
            setGet_data(data);
        }
    });

    const [search_quick_media, { loading, error, data }] = useLazyQuery(SEARCH_QUICK_MEDIA)
    // const [update_Inventory]=useQuery(Update_Inventory)
    if (read_booking.loading || read_inventory.loading || read_inquiry.loading || read_labor.loading || loading || read_designer.loading || read_electrician.loading || read_printer.loading || read_mounter.loading || read_quick_media.loading || get_return_data.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;

    //Functions
    const onShortlistedChange = (e) => {
        // console.log(e.target.value)
        setShortlisted(e.target.value);
        // console.log(shortlisted)
    }
    const onConfirmationChange = (e) => {
        setConfirmation(e.target.value);
    }
    const onPOChange = (e) => {
        setPO(e.target.value);
    }
    const onDesignerChange = (e) => {
        // console.log(e.target.value)
        setDesigner(e.target.value);
    }
    const onPrinterChange = (e) => {
        setPrinter(e.target.value);
    }
    const onMounterChange = (e) => {
        setMounter(e.target.value);
    }
    const onElectricianChange = (e) => {
        setElectrician(e.target.value);
    }
    const onStartDatePhotoChange = (e) => {
        // console.log(e.target.files[0])
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "name",
            e.target.files[0],
            e.target.files[0].name
        );

        // Details of the uploaded file
        //console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        axios.post("https://velocepro.in/bharti_expo_php/bharatiimg.php", formData)
            .then((dataimage1) => {
                setStartDatePhoto(dataimage1.data);
            })

    }
    const onMonitoringPhotoChange = (e) => {
        //console.log(e.target.files[0])
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "name",
            e.target.files[0],
            e.target.files[0].name
        );
        axios.post("https://velocepro.in/bharti_expo_php/bharatiimg.php", formData)
            .then((dataimage1) => {
                setMonitoringPhoto(dataimage1.data);
            })

    }
    const onEndDatePhotoChange = (e) => {
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "name",
            e.target.files[0],
            e.target.files[0].name
        );
        axios.post("https://velocepro.in/bharti_expo_php/bharatiimg.php", formData)
            .then((dataimage1) => {
                setEndDatePhoto(dataimage1.data);
            })
    }
    const onStartDateChange = (e) => {
        setStartDate(e.target.value);
    }
    const onEndDateChange = (e) => {
        setEndDate(e.target.value);
    }
    // const onStatusChange=(e)=>{
    //     setBooked(e.target.value);
    // }
    //Modal Functions
    const onModalIdChange = (e) => {
        setModalId(e.target.value);
    }
    const onModalShortlistedChange = (e) => {
        setModalShortlisted(e.target.value);
    }
    const onModalConfirmationChange = (e) => {
        setModalConfirmation(e.target.value);
    }
    const onModalPOChange = (e) => {
        setModalPO(e.target.value);
    }
    const onModalDesignerChange = (e) => {
        //console.log(e.target.value);
        setModalDesigner(e.target.value);
    }
    const onModalPrinterChange = (e) => {
        setModalPrinter(e.target.value);
    }
    const onModalMounterChange = (e) => {
        setModalMounter(e.target.value);
    }
    const onModalElectricianChange = (e) => {
        setModalElectrician(e.target.value);
    }
    const onModalStartDatePhotoChange = (e) => {
        //console.log(e.target.files[0])
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "name",
            e.target.files[0],
            e.target.files[0].name
        );

        // Details of the uploaded file
        //console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        axios.post("https://velocepro.in/bharti_expo_php/bharatiimg.php", formData)
            .then((dataimage1) => {
                setModalStartDatePhoto(dataimage1.data);
            })
        //setModalStartDatePhoto(e.target.value);
    }
    const onModalMonitoringPhotoChange = (e) => {
        //console.log(e.target.files[0])
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "name",
            e.target.files[0],
            e.target.files[0].name
        );

        // Details of the uploaded file
        //console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        axios.post("https://velocepro.in/bharti_expo_php/bharatiimg.php", formData)
            .then((dataimage1) => {
                setModalMonitoringPhoto(dataimage1.data);
            })
    }
    const onModalEndDatePhotoChange = (e) => {
        //console.log(e.target.files[0])
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "name",
            e.target.files[0],
            e.target.files[0].name
        );

        // Details of the uploaded file
        //console.log(this.state.selectedFile);

        // Request made to the backend api
        // Send formData object
        axios.post("https://velocepro.in/bharti_expo_php/bharatiimg.php", formData)
            .then((dataimage1) => {
                setModalEndDatePhoto(dataimage1.data);
            })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(confirmation);
        if (shortlisted === "Yes" && confirmation === "Yes") {
            setBooked('Booked');
            for (var i = 0; i < selected.length; i++) {
                console.log(user)
                console.log(selected[i].inquiry_master.inventory);
                insert_booking({
                    variables: {
                        Shortlisted: shortlisted, Confirmation: confirmation, Sites: selected[i].id, PO: PO, Designer: designer,
                        Printer: printer, Mounter: mounter, Electrician: electrician, Start_Date_Photo: startDatePhoto, Monitoring_Photo: monitoringPhoto, End_Date_Photo: endDatePhoto, Start_Date: startDate, End_Date: endDate
                    }
                })
                update_inventory({ variables: { id: selected[i].inquiry_master.inventory, AvailabilityFrom: startDate, AvailabilityTo: endDate, Status: "Booked", BookedBy: user } })
            }
            toast.configure();
            toast.success('Successfully Inserted')
        }
        else if (shortlisted === "Yes" && confirmation === "No") {
            setBooked('Hold');
            for (var i = 0; i < selected.length; i++) {
                console.log(user)
                console.log(selected[i].inquiry_master.inventory);
                insert_booking({
                    variables: {
                        Shortlisted: shortlisted, Confirmation: confirmation, Sites: selected[i].id, PO: PO, Designer: designer,
                        Printer: printer, Mounter: mounter, Electrician: electrician, Start_Date_Photo: startDatePhoto, Monitoring_Photo: monitoringPhoto, End_Date_Photo: endDatePhoto, Start_Date: startDate, End_Date: endDate
                    }
                })
                update_inventory({ variables: { id: selected[i].inquiry_master.inventory, AvailabilityFrom: startDate, AvailabilityTo: endDate, Status: "Hold", BookedBy: user } })
            }
            toast.configure();
            toast.success('Successfully Inserted')
        }
        //if(shortlisted==="No" && confirmation==="No")
        else {
            setBooked('Immediate');
            for (var i = 0; i < selected.length; i++) {
                console.log(user)
                console.log(selected[i].inquiry_master.inventory);
                insert_booking({
                    variables: {
                        Shortlisted: shortlisted, Confirmation: confirmation, Sites: selected[i].id, PO: PO, Designer: designer,
                        Printer: printer, Mounter: mounter, Electrician: electrician, Start_Date_Photo: startDatePhoto, Monitoring_Photo: monitoringPhoto, End_Date_Photo: endDatePhoto, Start_Date: startDate, End_Date: endDate
                    }
                })
                update_inventory({ variables: { id: selected[i].inquiry_master.inventory, Status: "Immediate", BookedBy: "" } })
                update_inquiry({ variables: { id: selected[i].inquiry_master.id, status: "Completed" } })
            }
            toast.configure();
            toast.success('Successfully Inserted')
        }
    }
    const onEdit = (row) => {
        handleShow();
        //console.log(row)
        setModalId(row.id);
        setModalShortlisted(row.Shortlisted);
        setModalConfirmation(row.Confirmation);
        setModalPO(row.PO);
        setModalDesigner(row.Designer);
        setModalPrinter(row.Printer);
        setModalMounter(row.Mounter);
        setModalElectrician(row.Electrician);
        setModalStartDatePhoto(row.Start_Date_Photo);
        setModalEndDatePhoto(row.End_Date_Photo);
        setModalMonitoringPhoto(row.Monitoring_Photo)
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_booking({ variables: { id: modalId, Shortlisted: modalShortlisted, Confirmation: modalConfirmation, PO: modalPO, Designer: modalDesigner, Printer: modalPrinter, Mounter: modalMounter, Electrician: modalElectrician, Start_Date_Photo: modalStartDatePhoto, End_Date_Photo: modalEndDatePhoto, Monitoring_Photo: modalMonitoringPhoto } });
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete = (id) => {
        setBooked('');
        delete_booking({ variables: { id: id } })
        update_booking_on_delete({ variables: { id: id, BookedBy: Booked } })
        toast.configure();
        toast.error('Successfully Deleted')
    }
    const onsearch = (e) => {
        e.preventDefault();
        //console.log(e.target[0].value)
        search_quick_media({ variables: { mobile_no: e.target[0].value } })
    }
console.log(read_electrician.data);
    const columns1 = [
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
            field: 'proposal_no',
            headerName: 'Proposal No',
            width: 160,
        },
        {
            field: 'mobile_no',
            headerName: 'Mobile No',
            width: 160,
        },
        {
            field: 'Location',
            headerName: 'Location',
            width: 190,
            valueGetter: (params) => {
                return params.row.inquiry_master.Inventory_Master.Location;
            }
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
            field: 'PO',
            headerName: 'PO',
            width: 160,
        },
        {
            field: 'Designer',
            headerName: 'Designer',
            width: 190,
            valueGetter: (params) => {
                return params.row.labor_master.name;
            }
        },
        {
            field: 'Printer',
            headerName: 'Printer',
            width: 190,
            valueGetter: (params) => {
                return params.row.labor_master.name;
            }
        },
        {
            field: 'Mounter',
            headerName: 'Mounter',
            width: 190,
            valueGetter: (params) => {
                return params.row.labor_master.name;
            }
        },
        {
            field: 'Electrician',
            headerName: 'Electrician',
            width: 160,
            valueGetter: (params) => {
                return params.row.labor_master.name;
            }
        },
        {
            field: 'Start_Date_Photo',
            headerName: 'Start Date Photo',
            width: 250,
            renderCell: (params) => <img width="800" height="100" src={`https://velocepro.in/bharti_expo_images/${params.row.Start_Date_Photo}`} />,
        },
        {
            field: 'Monitoring_Photo',
            headerName: 'Monitoring Photo',
            width: 250,
            renderCell: (params) => <img width="800" height="100" src={`https://velocepro.in/bharti_expo_images/${params.row.Monitoring_Photo}`} />,
        },
        {
            field: 'End_Date_Photo',
            headerName: 'End Date Photo',
            width: 250,
            renderCell: (params) => <img width="800" height="100" src={`https://velocepro.in/bharti_expo_images/${params.row.End_Date_Photo}`} />,
        },
        {
            field: 'Start_Date',
            headerName: 'Start Date',
            width: 160
        },
        {
            field: 'End_Date',
            headerName: 'End Date',
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
    const rows = read_booking.data.Booking_Calender;
    const emptyarr = [
        {
            id: "",
            proposal_no: "",
            mobile_no: "",
            inquiry_master: {
                Inventory_Master: {
                    Location: ""
                }
            }
        }
    ]
    var rows1 = emptyarr
    if (data) {
        rows1 = data.quick_media;
        //console.log(rows1)
    }


    const user = localStorage.getItem("userdata");
    //console.log(user);
    let newData1 = []
    rows1.map((item, index) => {
        newData1.push({ sno: index + 1, ...item })
    })
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    //console.log(data === undefined ?'':data.inquiry_master[0])
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="form-group" onSubmit={onModalFormSubmit}>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">ID</label>
                                <input value={modalId} className="form-control mt-1" onChange={onModalIdChange} name="id" type="text" required />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Shortlisted</label>
                                {/* <select value={modalShortlisted} className="form-control" onChange={onModalShortlistedChange}>
                                    <option>Select...</option>
                                    {read_quick_media.data.quick_media.map((shortlist) => (
                                        <option key={shortlist.id} value={shortlist.id}>{shortlist.inquiry_master.Inventory_Master.Location}</option>
                                    ))}
                                </select> */}
                                <select onChange={onModalShortlistedChange} value={modalShortlisted} className="form-control">
                                    <option>Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Confirmation</label>
                                {/* <select onChange={onModalConfirmationChange} value={modalConfirmation} className="form-control">
                                    <option>Select...</option>
                                    {read_inventory.data.Inventory_Master.map((confirmation) => (
                                        <option key={confirmation.id} value={confirmation.id}>{confirmation.Location}</option>
                                    ))}
                                </select> */}
                                <select onChange={onModalConfirmationChange} value={modalConfirmation} className="form-control">
                                    <option>Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="field col-md-6">
                                <label className="required">PO</label>
                                <input onChange={onModalPOChange} value={modalPO} className="form-control mt-1" name="id" type="text" required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Designer</label>
                                <select onChange={onModalDesignerChange} value={modalDesigner} className="form-control">
                                    <option>Select...</option>
                                    {read_designer.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Mounter</label>
                                <select onChange={onModalMounterChange} value={modalMounter} className="form-control">
                                    <option>Select...</option>
                                    {read_mounter.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Electrician</label>
                                <select onChange={onModalElectricianChange} value={modalElectrician} className="form-control">
                                    <option>Select...</option>
                                    {read_electrician.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Start Date Photo</label>

                                <input onChange={onModalStartDatePhotoChange} className="form-control" type="file" />

                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Printer</label>
                                <select onChange={onModalPrinterChange} value={modalPrinter} className="form-control">
                                    <option>Select...</option>
                                    {read_printer.data.labor_master.map((labor) => (
                                        <option key={labor.id} value={labor.id}>{labor.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Monitoring Photo</label>
                                <input onChange={onModalMonitoringPhotoChange} className="form-control" type="file" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">End Date Photo</label>
                                <input onChange={onModalEndDatePhotoChange} className="form-control" type="file" />
                            </div>
                        </div>
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
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>

                <h4 className="text-center">BOOKING</h4>
                <form onSubmit={onsearch}>
                    <div className="row">
                        <div className="field col-md-4"></div>
                        <div className="field col-md-4">
                            <label>Search By Customer Mobile</label>
                            <input className="form-control" type="text" name="customer_search" /><br />
                            <button className="btn btn-primary" type="submit" style={{ marginRight: '10px', width: '30%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Search</button>
                        </div>
                        <div className="field col-md-4"></div>
                    </div><br />
                </form>
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={newData1}
                        columns={columns1}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids);
                            const selectedRowData = rows1.filter((row) =>
                                selectedIDs.has(row.id)
                            )
                            console.log(selectedRowData);
                            setSelected(selectedRowData)
                        }}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                    />
                </div>
                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Shortlisted</label>
                            {/* <select className="form-control" onChange={onShortlistedChange}>
                                <option>Select...</option>
                                {data === undefined ? '' : data.quick_media.map((shortlist) => (
                                    <option key={shortlist.id} value={shortlist.id}>{shortlist.inquiry_master.Inventory_Master.Location}</option>
                                ))}
                            </select> */}
                            <select className="form-control" onChange={onShortlistedChange}>
                                <option>Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Confirmation</label>
                            {/* <select className="form-control" onChange={onConfirmationChange}>
                                <option>Select...</option>
                                {read_inventory.data.Inventory_Master.map((inventory) => (
                                    <option key={inventory.id} value={inventory.id}>{inventory.Location}</option>
                                ))}
                            </select> */}
                            <select className="form-control" onChange={onConfirmationChange}>
                                <option>Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">PO</label>
                            <input type="text" name="PO" className="form-control" onChange={onPOChange} />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Designer</label>
                            <select className="form-control" onChange={onDesignerChange}>
                                <option>Select...</option>
                                {read_designer.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Printer</label>
                            <select className="form-control" onChange={onPrinterChange}>
                                <option>Select...</option>
                                {read_printer.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Mounter</label>
                            <select className="form-control" onChange={onMounterChange}>
                                <option>Select...</option>
                                {read_mounter.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Electrician</label>
                            <select className="form-control" onChange={onElectricianChange}>
                                <option>Select...</option>
                                {read_electrician.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field col-md-6">
                            <label className="required" >Start Date Photo</label>
                            <input type="file" name="PO" className="form-control" onChange={onStartDatePhotoChange} />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Monitoring Photo</label>
                            <input type="file" name="PO" className="form-control" onChange={onMonitoringPhotoChange} />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">End Date Photo</label>
                            <input type="file" name="PO" className="form-control" onChange={onEndDatePhotoChange} />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-4">
                            <label className="required">Start Date</label>
                            <input type="date" name="PO" className="form-control" onChange={onStartDateChange} />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">End Date</label>
                            <input type="date" name="PO" className="form-control" onChange={onEndDateChange} />
                        </div>

                    </div><br />
                    <br />
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>

                        <button className="btn btn-primary" type="reset" style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Reset</button>
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

export default Booking