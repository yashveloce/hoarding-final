import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { toast } from 'react-toastify';
import { gql, useMutation, useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'

const getInventory_Master = gql`
subscription MySubscription($_eq: String = "false"){
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
        isDeleted
        id
        fabricator_labour_payment
        fabricator
        fabrication_material
        excavator_charges
        excavator
        electrician_selection
        electrician_labour_payment
        civil_contractor
        civil_material
        electric_material_purchase
        civil_contractor_labour_payment
        location
        payment
        permission
        transport_charges
      }
    }
  }
`
const Insert_Inventory = gql`
mutation MyMutation($AvailabilityFrom: date = "",$AvailabilityTo: date = "", $DisplayRatePM: String = "", $Height: String = "", $Illumination: String = "", $Location: String = "", $Media_Type:Int!, $NoofDisplay: String = "", $OneTimeMountingCost: String = "", $OneTimePrintingCost: String = "", $Total: String = "", $Totalsqft: String = "", $Width: String = "", $id: Int = 10,$DrpmRate:String!,$OtpcRate:String!,$OtmcRate:String!,$hoarding_insurance:String="",$hoarding_insurance_from:date!,$hoarding_insurance_to:date!,$Status:String!,$erection:Int!,$State:Int!,$District:Int!,$Subdistrict:Int!,$BookedBy:String!) {
    insert_Inventory_Master_one(object: {AvailabilityFrom: $AvailabilityFrom, AvailabilityTo: $AvailabilityTo, DisplayRatePM: $DisplayRatePM, DrpmRate: $DrpmRate, Height: $Height, Illumination: $Illumination, Location: $Location, Media_Type: $Media_Type, NoofDisplay: $NoofDisplay, OneTimeMountingCost: $OneTimeMountingCost, OneTimePrintingCost: $OneTimePrintingCost, OtmcRate: $OtmcRate, OtpcRate: $OtpcRate, Total: $Total, Totalsqft: $Totalsqft, Width: $Width,Status:$Status, hoarding_insurance: $hoarding_insurance, hoarding_insurance_from: $hoarding_insurance_from, hoarding_insurance_to: $hoarding_insurance_to,erection:$erection,State:$State,District:$District,Subdistrict:$Subdistrict,BookedBy:$BookedBy}){
      id
    }
  }
  
`
const Read_Fabricator = gql`
subscription MySubscription {
    labor_master(where: {isDeleted: {_eq: "false"}, labor_type: {_eq: 21}}) {
      id
      labor_type
      name
    }
  }
  `
const delete_Inventory = gql`
  mutation MyMutation($isDeleted: String = "true", $id: Int = 0) {
    update_Inventory_Master_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }
  
  `

// const delete_Inventory = gql`
// mutation MyMutation($id: Int = 0) {
//     delete_Inventory_Master_by_pk(id: $id) {
//       City_Village
//       DisplayRatePM
//       District
//       Height
//       Illumination
//       Location
//       Media_Type
//       NoofDisplay
//       OneTimeMountingCost
//       OneTimePrintingCost
//       Country
//       State
//       Taluka
//       Total
//       Totalsqft
//       Width
//       id
//       hoarding_insurance

//       Status
//     }
//   }
// `
const UPDATE_Inventory = gql`
mutation MyMutation($AvailabilityFrom: date = "",$AvailabilityTo: date = "", $DisplayRatePM: String = "", $Height: String = "", $Illumination: String = "", $Location: String = "", $Media_Type:Int!, $NoofDisplay: String = "", $OneTimeMountingCost: String = "", $OneTimePrintingCost: String = "", $Total: String = "", $Totalsqft: String = "", $Width: String = "", $id: Int = 10,$DrpmRate:String!,$OtpcRate:String!,$OtmcRate:String!,$hoarding_insurance:String="",$hoarding_insurance_from:date!,$hoarding_insurance_to:date!,$Status:String!) {
    update_Inventory_Master_by_pk(pk_columns: {id: $id}, _set: {AvailabilityFrom: $AvailabilityFrom,AvailabilityTo: $AvailabilityTo, DisplayRatePM: $DisplayRatePM, Height: $Height, Illumination: $Illumination, Location: $Location, Media_Type: $Media_Type, NoofDisplay: $NoofDisplay, OneTimeMountingCost: $OneTimeMountingCost, OneTimePrintingCost: $OneTimePrintingCost, Total: $Total, Totalsqft: $Totalsqft, Width: $Width,DrpmRate:$DrpmRate,OtpcRate:$OtpcRate,OtmcRate:$OtmcRate, Status:$Status,hoarding_insurance: $hoarding_insurance, hoarding_insurance_from: $hoarding_insurance_from, hoarding_insurance_to: $hoarding_insurance_to}) {
      id
    }
  }
  
`

const MEDIA_TYPE = gql`
subscription MySubscription($_eq: String = "false"){
    media_type_master(where: {isDeleted: {_eq: $_eq}}){
      id
      media_type
    }
  }
`
const Read_hoarding_erection = gql`
subscription MySubscription {
    hoarding_errection {
      id
      location
      payment
      permission
      transport_charges
      fabricator_labour_payment
      fabrication_material
      excavator_charges
      excavator
      electrician_selection
      electrician_labour_payment
      electric_material_purchase
      civil_material
      civil_contractor_labour_payment
      civil_contractor
    }
  }
`

const READ_GEOLOCATIONS = gql`
query MyQuery {
    geo_locations {
      external_id
      id
      location_type
      name
      parent_id
      pin
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

var totalsq;
var total;
var modaltotalsq;
var modaltotal;
export default function Inventory_Master() {
    const districtData = "";

    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [State, setState] = useState();
    const [District, setDistrict] = useState();
    const [Subdistrict, setSubdistrict] = useState();
    const [Location, setLocation] = useState();
    const [Media_Type, setMedia_Type] = useState();
    const [Illumination, setIllumination] = useState();
    const [Width, setWidth] = useState(1);
    const [Height, setHeight] = useState(1);
    const [NoofDisplay, setNoofDisplay] = useState(1);
    const [Totalsqft, setTotalsqft] = useState();
    const [DisplayRatePM, setDisplayRatePM] = useState();
    const [OneTimePrintingCost, setOneTimePrintingCost] = useState();
    const [OneTimeMountingCost, setOneTimeMountingCost] = useState();
    const [Total, setTotal] = useState();
    const [AvailabilityFrom, setAvailabilityFrom] = useState();
    const [AvailabilityTo, setAvailabilityTo] = useState();
    const [DrpmRate, setDrpmRate] = useState();
    const [OtpcRate, setOtpcRate] = useState();
    const [OtmcRate, setOtmcRate] = useState();
    const [hoarding_insurance, sethoarding_insurance] = useState();
    const [hoarding_insurance_from, sethoarding_insurance_from] = useState();
    const [hoarding_insurance_to, sethoarding_insurance_to] = useState();
    const [Erection, setErection] = useState();

    const [Status, setStatus] = useState();


    const [ModalId, setModalId] = useState();
    const [ModalState, setModalState] = useState();
    const [ModalDistrict, setModalDistrict] = useState();
    const [ModalSubdistrict, setModalSubdistrict] = useState();
    const [ModalLocation, setModalLocation] = useState();
    const [ModalMedia_Type, setModalMedia_Type] = useState();
    const [ModalIllumination, setModalIllumination] = useState();
    const [ModalWidth, setModalWidth] = useState(1);
    const [ModalHeight, setModalHeight] = useState(1);
    const [ModalNoofDisplay, setModalNoofDisplay] = useState(1);
    const [ModalTotalsqft, setModalTotalsqft] = useState();
    const [ModalDisplayRatePM, setModalDisplayRatePM] = useState();
    const [ModalOneTimePrintingCost, setModalOneTimePrintingCost] = useState();
    const [ModalOneTimeMountingCost, setModalOneTimeMountingCost] = useState();
    const [ModalTotal, setModalTotal] = useState();
    const [ModalAvailabilityFrom, setModalAvailabilityFrom] = useState();
    const [ModalAvailabilityTo, setModalAvailabilityTo] = useState();
    const [ModalDrpmRate, setModalDrpmRate] = useState();
    const [ModalOtpcRate, setModalOtpcRate] = useState();
    const [ModalOtmcRate, setModalOtmcRate] = useState();
    const [Modalhoarding_insurance, setModalhoarding_insurance] = useState();
    const [Modalhoarding_insurance_from, setModalhoarding_insurance_from] = useState();
    const [Modalhoarding_insurance_to, setModalhoarding_insurance_to] = useState();
    const [ModalErection, setModalErection] = useState();
    const [ModalStatus, setModalStatus] = useState();


    const onStateChange = (state_data) => {
        setState(state_data.id);

    }
    const onDistrictChange = (district_data) => {
        setDistrict(district_data.id);

    }
    const onSubdistrictChange = (subdistrict_data) => {
        setSubdistrict(subdistrict_data.id);
    }
    const onLocationChange = (e) => {
        setLocation(e.target.value)
    }
    const onMedia_TypeChange = (media_type_data) => {
        setMedia_Type(media_type_data.id)
    }
    const onIlluminationChange = (illumination_data) => {
        setIllumination(illumination_data.value)
    }
    const onWidthChange = (e) => {
        totalsq = Height * NoofDisplay * e.target.value;
        setWidth(e.target.value)
        setTotalsqft(totalsq.toString());
    }
    const onHeightChange = (e) => {
        totalsq = Width * NoofDisplay * e.target.value;
        setHeight(e.target.value)
        setTotalsqft(totalsq.toString());
    }
    const onNoofDisplayChange = (e) => {
        setNoofDisplay(e.target.value)
        //console.log(e.target.value);
        totalsq = Width * Height * e.target.value;
        setTotalsqft(totalsq.toString());
        //console.log(totalsq);
    }

    // const onTotalsqftChange = (e) => {
    //     // setTotalsqft(e.target.value)
    //     // totalsq = Width * Height * NoofDisplay;
    //     // setTotalsqft(totalsq);
    // }
    const onDrpmRateChange = (e) => {
        setDrpmRate(e.target.value)
        const drpm = Totalsqft * e.target.value
        setDisplayRatePM(drpm);
        console.log(DisplayRatePM)
        total = parseInt(OneTimePrintingCost) + parseInt(OneTimeMountingCost) + parseInt(drpm)
        //console.log(total);
        setTotal(total.toString())
    }
    const onOtpcChange = (e) => {
        setOtpcRate(e.target.value)
        const otpc = Totalsqft * e.target.value
        setOneTimePrintingCost(Totalsqft * e.target.value)
        total = parseInt(otpc) + parseInt(OneTimeMountingCost) + parseInt(DisplayRatePM)
        //console.log(total);
        setTotal(total.toString())
    }
    const onOtmcChange = (e) => {
        setOtmcRate(e.target.value)
        const otmc = Totalsqft * e.target.value
        setOneTimeMountingCost(Totalsqft * e.target.value)
        total = parseInt(OneTimePrintingCost) + parseInt(otmc) + parseInt(DisplayRatePM)
        console.log(total);
        setTotal(total.toString())
    }
    // const onDisplayRatePMChange = (e) => {
    //     setDisplayRatePM(e.target.value);
    //     total=parseInt(OneTimePrintingCost) + parseInt(OneTimeMountingCost) + parseInt(e.target.value)
    //     //console.log(total);
    //     setTotal(total.toString())
    // }
    // const onOneTimePrintingCostChange = (e) => {
    //     setOneTimePrintingCost(e.target.value)
    //     total=parseInt(e.target.value) + parseInt(OneTimeMountingCost) + parseInt(DisplayRatePM)
    //     //console.log(total);
    //     setTotal(total.toString())
    // }
    // const onOneTimeMountingCostChange = (e) => {
    //     setOneTimeMountingCost(e.target.value)
    //     total=parseInt(OneTimePrintingCost) + parseInt(e.target.value) + parseInt(DisplayRatePM)
    //     //console.log(total);
    //     setTotal(total.toString())
    // }
    // const onTotalChange = (e) => {

    // }
    const onAvailabilityFromChange = (e) => {
        setAvailabilityFrom(e.target.value)
    }
    const onAvailabilityToChange = (e) => {
        setAvailabilityTo(e.target.value)
    }

    const onhoarding_insuranceChange = (e) => {
        sethoarding_insurance(e.target.value)
    }
    const onHoardingInsuranceFromChange = (e) => {
        sethoarding_insurance_from(e.target.value)
    }
    const onHoardingInsuranceToChange = (e) => {
        sethoarding_insurance_to(e.target.value)
    }
    const onErectionChange = (e) => {
        setErection(e.target.value)
    }
    const onStatusChange = (e) => {
        setStatus(e.target.value)
    }


    //Modal Changes
    const onModalStateChange = (e) => {
        setModalState(e.target.value);
    }
    const onModalDistrictChange = (e) => {
        setModalDistrict(e.target.value);
    }
    const onModalSubdistrictChange = (e) => {
        setModalSubdistrict(e.target.value);
    }
    const onModalLocationChange = (e) => {
        setModalLocation(e.target.value)
    }
    const onModalMedia_TypeChange = (modal_mdeia_type_data) => {
        setModalMedia_Type(modal_mdeia_type_data.id)
    }
    const onModalIlluminationChange = (modalIlluminationData) => {
        setModalIllumination(modalIlluminationData.value)
    }
    const onModalWidthChange = (e) => {
        modaltotalsq = ModalHeight * ModalNoofDisplay * e.target.value;
        setModalWidth(e.target.value)
        setModalTotalsqft(modaltotalsq.toString());
    }
    const onModalHeightChange = (e) => {
        modaltotalsq = ModalWidth * ModalNoofDisplay * e.target.value;
        setModalHeight(e.target.value)
        setModalTotalsqft(modaltotalsq.toString());
    }
    const onModalNoofDisplayChange = (e) => {
        setModalNoofDisplay(e.target.value)
        //console.log(e.target.value);
        modaltotalsq = ModalWidth * ModalHeight * e.target.value;
        setModalTotalsqft(modaltotalsq.toString());
        //console.log(ModalTotalsqft);
    }

    // const onTotalsqftChange = (e) => {
    //     // setTotalsqft(e.target.value)
    //     // totalsq = Width * Height * NoofDisplay;
    //     // setTotalsqft(totalsq);
    // }
    const onModalDrpmChange = (e) => {
        setModalDrpmRate(e.target.value)
        const modaldrpm = ModalTotalsqft * e.target.value
        setModalDisplayRatePM(modaldrpm);
        console.log(ModalDisplayRatePM)
        modaltotal = parseInt(ModalOneTimePrintingCost) + parseInt(ModalOneTimeMountingCost) + parseInt(modaldrpm)
        //console.log(total);
        setModalTotal(modaltotal.toString())
    }
    const onModalOtpcChange = (e) => {
        setModalOtpcRate(e.target.value)
        const modalotpc = ModalTotalsqft * e.target.value
        setModalOneTimePrintingCost(modalotpc)
        modaltotal = parseInt(modalotpc) + parseInt(ModalOneTimeMountingCost) + parseInt(ModalDisplayRatePM)
        //console.log(total);
        setModalTotal(modaltotal.toString())
    }
    const onModalOtmcChange = (e) => {
        setModalOtmcRate(e.target.value)
        const modalotmc = ModalTotalsqft * e.target.value
        setModalOneTimeMountingCost(modalotmc)
        modaltotal = parseInt(ModalOneTimePrintingCost) + parseInt(modalotmc) + parseInt(ModalDisplayRatePM)
        console.log(modaltotal);
        setModalTotal(modaltotal.toString())
    }
    // const onModalDisplayRatePMChange = (e) => {
    //     setModalDisplayRatePM(e.target.value);
    //     modaltotal=parseInt(ModalOneTimePrintingCost) + parseInt(ModalOneTimeMountingCost) + parseInt(e.target.value)
    //     //console.log(modaltotal);
    //     setModalTotal(modaltotal.toString())
    // }
    // const onModalOneTimePrintingCostChange = (e) => {
    //     setModalOneTimePrintingCost(e.target.value)
    //     modaltotal=parseInt(e.target.value) + parseInt(ModalOneTimeMountingCost) + parseInt(ModalDisplayRatePM)
    //     //console.log(modaltotal);
    //     setModalTotal(modaltotal.toString())
    // }
    // const onModalOneTimeMountingCostChange = (e) => {
    //     setModalOneTimeMountingCost(e.target.value)
    //     modaltotal=parseInt(ModalOneTimePrintingCost) + parseInt(e.target.value) + parseInt(ModalDisplayRatePM)
    //     //console.log(modaltotal);
    //     setModalTotal(modaltotal.toString())
    // }
    const onModalAvailabilityFromChange = (e) => {
        setModalAvailabilityFrom(e.target.value)
    }
    const onModalAvailabilityToChange = (e) => {
        setModalAvailabilityTo(e.target.value)
    }
    const onModalhoarding_insuranceChange = (e) => {
        setModalhoarding_insurance(e.target.value)
    }
    const onModalhoarding_insurance_fromChange = (e) => {
        setModalhoarding_insurance_from(e.target.value)
    }
    const onModalhoarding_insurance_toChange = (e) => {
        setModalhoarding_insurance_to(e.target.value)
    }
    const onModalStatusChange = (e) => {
        setModalStatus(e.target.value)
    }
    const onModalErectionChange = (e) => {
        setModalErection(e.target.value)
    }






    const [Insert_InventorymasterData] = useMutation(Insert_Inventory);
    const [delete_InventorymasterData] = useMutation(delete_Inventory);
    const [update_InventorymasterData] = useMutation(UPDATE_Inventory);

    const onFormSubmit = (e) => {
        e.preventDefault();
        Insert_InventorymasterData({ variables: { Location: Location, Media_Type: Media_Type, Illumination: Illumination, Width: Width.toString(), Height: Height.toString(), NoofDisplay: NoofDisplay.toString(), Totalsqft: Totalsqft.toString(), DisplayRatePM: DisplayRatePM.toString(), OneTimeMountingCost: OneTimeMountingCost.toString(), OneTimePrintingCost: OneTimePrintingCost.toString(), Total: Total.toString(), AvailabilityFrom: AvailabilityFrom, AvailabilityTo: AvailabilityTo, DrpmRate: DrpmRate.toString(), OtpcRate: OtpcRate.toString(), OtmcRate: OtmcRate.toString(), hoarding_insurance: hoarding_insurance, hoarding_insurance_from: hoarding_insurance_from, hoarding_insurance_to: hoarding_insurance_to, Status: Status, erection: Erection, State: State, District: District, Subdistrict: Subdistrict,BookedBy:user } })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    // const onReset = () => {
    //     States='';
    //     City_Village='';
    //     District='';
    //     Taluka='';
    //     Location='';
    //     Media_Type='';
    //     Illumination='';
    //     Width='';
    //     Height='';
    //     NoofDisplay='';
    //     Totalsqft='';
    //     DisplayRatePM='';
    //     OneTimeMountingCost='';
    //     OneTimePrintingCost='';
    //     Total='';
    //     Availability=''
    // }
    const onEdit = (row) => {
        console.log(row);
        handleShow();
        setModalId(row.id);
        setModalState(row.State);
        setModalDistrict(row.District);
        setModalSubdistrict(row.Subdistrict);
        setModalLocation(row.Location);
        setModalMedia_Type(row.Media_Type);
        setModalIllumination(row.Illumination);
        setModalWidth(row.Width);
        setModalHeight(row.Height);
        setModalNoofDisplay(row.NoofDisplay);
        setModalTotalsqft(row.Totalsqft);
        setModalDisplayRatePM(row.DisplayRatePM);
        setModalOneTimePrintingCost(row.OneTimePrintingCost);
        setModalOneTimeMountingCost(row.OneTimeMountingCost);
        setModalTotal(row.Total);
        setModalAvailabilityFrom(row.AvailabilityFrom);
        setModalAvailabilityTo(row.AvailabilityTo);
        setModalDrpmRate(row.DrpmRate);
        setModalOtpcRate(row.OtpcRate);
        setModalOtmcRate(row.OtmcRate);
        setModalhoarding_insurance(row.hoarding_insurance);
        setModalhoarding_insurance_from(row.hoarding_insurance_from);
        setModalhoarding_insurance_to(row.hoarding_insurance_to);
        // setModalerrection_cost(row.errection_cost);
        // setModalerrection_year(row.errection_year);
        // setModalfabrication_selection(row.fabrication_selection);
        setModalStatus(row.Status);


        //console.log(modalInventory);
    }

    // const onModalInputChange = (e) => {
    //     setModalInventory({ ...modalInventory, [e.target.name]: e.target.value })
    // }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        //console.log(ModalStates.toString());
        update_InventorymasterData({ variables: { id: ModalId, State: ModalState, District: ModalDistrict, Subdistrict: ModalSubdistrict, Location: ModalLocation, Media_Type: ModalMedia_Type, Illumination: ModalIllumination, Width: ModalWidth.toString(), Height: ModalHeight.toString(), NoofDisplay: ModalNoofDisplay.toString(), Totalsqft: ModalTotalsqft.toString(), DisplayRatePM: ModalDisplayRatePM.toString(), OneTimeMountingCost: ModalOneTimeMountingCost.toString(), OneTimePrintingCost: ModalOneTimePrintingCost.toString(), Total: ModalTotal.toString(), AvailabilityFrom: ModalAvailabilityFrom, AvailabilityTo: ModalAvailabilityTo, DrpmRate: ModalDrpmRate, OtpcRate: ModalOtpcRate, OtmcRate: ModalOtmcRate, hoarding_insurance: Modalhoarding_insurance, hoarding_insurance_from: Modalhoarding_insurance_from, hoarding_insurance_to: Modalhoarding_insurance_to, Status: ModalStatus } })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete = (id) => {
        //console.log(id);
        delete_InventorymasterData({ variables: { id: id } });
        toast.configure();
        toast.error('Successfully Deleted')
    }

    const read_geolocations = useQuery(READ_GEOLOCATIONS);
    const getInventory = useSubscription(getInventory_Master);
    const media_type = useSubscription(MEDIA_TYPE)
    const read_fabricator = useSubscription(Read_Fabricator)
    const read_hoarding_erection = useSubscription(Read_hoarding_erection)
    if (read_geolocations.loading || getInventory.loading || media_type.loading || read_fabricator.loading || read_hoarding_erection.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    //console.log(getInventory.data);
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
            field: 'Media_Type',
            headerName: 'Media_Type',
            width: 180,
            valueGetter: (params) => {
                return params.row.media_type_master.media_type;
            }
        },
        {
            field: 'Location',
            headerName: 'Location',
            width: 160
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
            width: 150
        },
        {
            field: 'Width',
            headerName: 'Width',
            width: 130
        },
        {
            field: 'Height',
            headerName: 'Height',
            width: 130
        },
        {
            field: 'NoofDisplay',
            headerName: 'NoofDisplay',
            width: 170
        },
        {
            field: 'Totalsqft',
            headerName: 'Total Sq.Ft.',
            width: 190
        },
        {
            field: 'DrpmRate',
            headerName: 'Display Rate P.M. Rate',
            width: 240
        },
        {
            field: 'DisplayRatePM',
            headerName: 'Display Rate P.M.',
            width: 240
        },
        {
            field: 'OtpcRate',
            headerName: 'One Time Printing Cost Rate',
            width: 240
        },
        {
            field: 'OneTimePrintingCost',
            headerName: 'One Time Printing Cost',
            width: 240
        },
        {
            field: 'OtmcRate',
            headerName: 'One Time Mounting Cost Rate',
            width: 240
        },
        {
            field: 'OneTimeMountingCost',
            headerName: 'One Time Mounting Cost',
            width: 240
        },
        {
            field: 'Total',
            headerName: 'Total',
            width: 190
        },
        {
            field: 'AvailabilityFrom',
            headerName: 'Booked From',
            width: 190
        },
        {
            field: 'AvailabilityTo',
            headerName: 'Booked To',
            width: 190
        },
        {
            field: 'hoarding_insurance',
            headerName: 'Hoarding Insurance',
            width: 190
        },
        {
            field: 'hoarding_insurance_from',
            headerName: 'Hoarding Insurance From',
            width: 190
        },
        {
            field: 'hoarding_insurance_to',
            headerName: 'Hoarding Insurance To',
            width: 190
        },
        // {
        //     field: 'errection_cost',
        //     headerName: 'Erection Cost',
        //     width: 190
        // },
        // {
        //     field: 'errection_year',
        //     headerName: 'Erection year',
        //     width: 190
        // },
        // {
        //     field: 'fabrication_selection',
        //     headerName: 'Fabrication Selection',
        //     width: 190
        // },
        {
            field: 'Status',
            headerName: 'Status',
            width: 190
        },
        {
            field: 'BookedBy',
            headerName: 'Planner Name',
            width: 190
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

                        }} data-toggle="tooltip" title="Delete" style={{ marginLeft: '20%' }} className="btn btn-danger" ><i className="bi bi-trash-fill"></i></button>
                    </div>
                );
            }
        },
    ];
    const user = localStorage.getItem("userdata");
    //console.log(getInventory.data);
    const rows = getInventory.data.Inventory_Master;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    var IlluminationOptions = [
        { value: 'F LIT', label: 'F LIT' },
        { value: 'NON LIT', label: 'NON LIT' },
        { value: 'All', label: 'All' }
    ]
    // const rows=
    //    [
    //    { id: 1, state: 'Lannister', taluka: 'Cersei', district: 'kop' },
    //    { id: 1, state: 'Lannister', taluka: 'pk', district: 'kop' },
    //     { id: 3, state: 'Lannister', firstName: 'Jaime', age: 45 },
    //     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    //    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    //    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    //     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    // ]
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Inventory</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={onModalFormSubmit} className="form-group">
                        <div className="row mt-2">
                            <div className="field col-md-4">
                                <label>State</label>
                                {/* <Select
                                    name="state"
                                    value={ModalState}
                                    options={
                                        read_geolocations.data.geo_locations.filter((states) => states.location_type.includes("STATE"))
                                    }
                                    onChange={onStateChange}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                /> */}
                                <Select
                                    name="state"
                                    defaultValue={ModalState}
                                    options={
                                        read_geolocations.data.geo_locations.filter((states) => states.location_type.includes("STATE"))
                                    }
                                    onChange={onStateChange}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">District</label>
                                {/* <input defaultValue={modalInventory.State} onChange={onModalInputChange} className="form-control mt-1" name="State" type="text" placeholder=" enter state" /> */}
                                {/* <select defaultValue={ModalStates} onChange={onModalStateChange} type="text" name="State" className="form-control mt-1" data-live-search="true" placeholder="enter state" required>
                                    <option>--SELECT--</option>
                                    {read_states.data.states.map(state => (
                                        <option key={state.id} value={state.id}>{state.name}</option>
                                    ))}
                                </select> */}

                                <Select
                                    name="district"
                                    options={read_geolocations.data.geo_locations.filter(function (currentElement) {
                                        if (currentElement.location_type === "DISTRICT" && currentElement.parent_id === State) {
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
                                <label className="required">Sub District</label>
                                {/* <input defaultValue={modalInventory.City_Village} onChange={onModalInputChange} className="form-control mt-1" name="City_village"
                                    placeholder="enter city village" required /> */}
                                {/* <select defaultValue={ModalCity_Village} onChange={onModalCity_VillageChange} type="text" name="City_Village" className="form-control mt-1" placeholder="enter city" required>
                                    <option>--SELECT--</option>
                                    {read_cities.data.cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select> */}

                                <Select
                                    name="subdistrict"
                                    options={read_geolocations.data.geo_locations.filter(function (currentElement) {
                                        if (currentElement.location_type === "SUBDISTRICT" && currentElement.parent_id === District) {
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
                        <div className="row mt-2"><br />

                            <div className="field col-md-4">
                                <label className="required">Location</label>
                                <input defaultValue={ModalLocation} onChange={onModalLocationChange} className="form-control mt-1" name="Location" placeholder="enter location" required />
                            </div>
                        </div><br />
                        <div className="row mt-2"><br />
                            <div className="field col-md-4">
                                <label className="required">Media Type</label>
                                {/* <input defaultValue={ModalMedia_Type} onChange={onModalMedia_TypeChange} className="form-control mt-1" name="Media_Type" placeholder="enter media type " required /> */}
                                <Select
                                    name="Media_Type"
                                    value={media_type.data.media_type_master.find((op) => op.id === ModalMedia_Type)}
                                    options={media_type.data.media_type_master}
                                    onChange={onModalMedia_TypeChange}
                                    getOptionLabel={(option) => option.media_type}
                                    getOptionValue={(option) => option.id}
                                />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Illumination</label>

                                {/* <input defaultValue={ModalIllumination} onChange={onModalIlluminationChange} className="form-control mt-1" name="Illumination" placeholder="enter illumination" required /> */}
                                <Select
                                    name="Illumination"
                                    value={IlluminationOptions.find(op => op.value === ModalIllumination)}
                                    options={[
                                        { value: 'F LIT', label: 'F LIT' },
                                        { value: 'NON LIT', label: 'NON LIT' }
                                    ]}
                                    onChange={onModalIlluminationChange}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Width</label>
                                <input defaultValue={ModalWidth} onChange={onModalWidthChange} className="form-control mt-1" name="Width" placeholder="enter width" required />
                            </div>
                        </div><br />
                        <div className="row mt-2"><br />
                            <div className="field col-md-4">
                                <label className="required">Height </label>
                                <input defaultValue={ModalHeight} onChange={onModalHeightChange} className="form-control mt-1" name="Height" placeholder="enter height" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">No of Display </label>
                                <input defaultValue={ModalNoofDisplay} onChange={onModalNoofDisplayChange} className="form-control mt-1" name="NoofDisplay" placeholder="enter no of display" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Total Sq.Ft </label>
                                <input defaultValue={ModalTotalsqft} className="form-control mt-1" name="Totalsqft" placeholder="enter total sq ft" required />
                            </div>
                        </div><br />
                        <div className="row mt-2"><br />
                            <div className="field col-md-4">
                                <label className="required">Rate</label>
                                <input defaultValue={ModalDrpmRate} onChange={onModalDrpmChange} className="form-control mt-1" name="DrpmRate" placeholder="enter display rate P.M" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Display Rate P.M </label>
                                <input defaultValue={ModalDisplayRatePM} className="form-control mt-1" name="DisplayRatePM" placeholder="enter display rate P.M" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Rate</label>
                                <input defaultValue={ModalOtpcRate} onChange={onModalOtpcChange} className="form-control mt-1" name="OtpcRate" placeholder="enter rate " required />
                            </div>
                        </div><br />
                        <div className="row mt-2"><br />
                            <div className="field col-md-4">
                                <label className="required">One Time Printing Cost </label>
                                <input defaultValue={ModalOneTimePrintingCost} className="form-control mt-1" name="OneTimePrintingCost" placeholder="enter OneTimePrintingCost" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Rate</label>
                                <input defaultValue={ModalOtmcRate} onChange={onModalOtmcChange} className="form-control mt-4" name="OtmcRate" placeholder="enter rate " required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">One Time Mounting Cost </label>
                                <input defaultValue={ModalOneTimeMountingCost} className="form-control mt-1" name="OneTimeMountingCost" placeholder="enter one time mounting cost" required />
                            </div>
                        </div><br />
                        <div className="row mt-2"><br />
                            <div className="field col-md-4">
                                <label className="required">Total</label>
                                <input defaultValue={ModalTotal} className="form-control mt-1" name="Total" placeholder="enter total" required />
                            </div>
                            <div className="field col-md-4">
                                <label>Booking From</label>
                                <input defaultValue={ModalAvailabilityFrom} onChange={onModalAvailabilityFromChange} className="form-control mt-1" name="Availability from" placeholder="enter availability" />
                            </div>
                            <div className="field col-md-4">
                                <label>Booking To</label>
                                <input defaultValue={ModalAvailabilityTo} onChange={onModalAvailabilityToChange} className="form-control mt-1" name="Availability to" placeholder="enter availability" />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="field col-md-4">
                                <label className="required">Hoarding Insurance</label>
                                <input type="text" defaultValue={Modalhoarding_insurance} name="hoarding_insurance" onChange={onModalhoarding_insuranceChange} className="form-control mt-1" placeholder="enter hoarding insurance" required />
                            </div>


                            <div className="field col-md-4">
                                <label className="required">Hoarding Insurance From</label>
                                <input type="date" defaultValue={Modalhoarding_insurance_from} name="hoarding_insurance_from" onChange={onModalhoarding_insurance_fromChange} className="form-control mt-1" placeholder="enter hoarding insurance from" required />
                            </div>
                            <div className="field col-md-4">
                                <label className="required">Hoarding Insurance To</label>
                                <input type="date" name="errection_year " defaultValue={Modalhoarding_insurance_to} onChange={onModalhoarding_insurance_toChange} className="form-control mt-1" placeholder="enter hoarding insurance to" required />
                            </div>


                        </div><br />
                        <div className="row mt-2">
                            {/* <div className="field col-md-4">
                            <label className="required">Fabrication selection</label>
                            <input type="text" defaultValue={Modalfabrication_selection}name="fabrication_selection" onChange={onModalfabrication_selectionChange} className="form-control mt-1" placeholder="enter availability" required />
                        </div> */}
                            <div className="field col-md-4">
                                <label>Erection Selection</label>
                                <select defaultValue={ModalErection} className="form-control" onChange={onModalErectionChange} >
                                    {read_hoarding_erection.data.hoarding_errection.map((erection) => (
                                        <option id={erection.id} value={erection.id}>{erection.location}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="field col-md-4">
                                <label>Status</label>
                                <select defaultValue={ModalStatus} className="form-control" onChange={onModalStatusChange} >
                                    <option>Select...</option>
                                    <option>Immediate</option>
                                    <option>Booked</option>
                                    <option>Hold</option>
                                </select>

                            </div>


                        </div><br />

                        <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>

                            <br /><br />
                            {/* <button className="btn btn-primary" type='Next' style={{ marginLeft: '5%' }}>Next</button> */}
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
                <h4 style={{ width: '100%', textAlign: 'center' }}>INVENTORY MASTER</h4>
                <br />
                <form className="form-group" onSubmit={onFormSubmit} padding="2px">
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label className="required">State</label>
                            <Select
                                name="state"
                                options={
                                    read_geolocations.data.geo_locations.filter((states) => states.location_type.includes("STATE"))
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
                                options={read_geolocations.data.geo_locations.filter(function (currentElement) {
                                    if (currentElement.location_type === "DISTRICT" && currentElement.parent_id === State) {
                                        //console.log(currentElement);
                                        return currentElement;
                                    }
                                }
                                )}
                                onChange={onDistrictChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                            {/* <input type="text" name="State" onChange={onInputChange} className="form-control mt-1" required placeholder="enter state" title="Please enter Alphabets." /> */}
                            {/* <select onChange={onStateChange} type="text" name="State" className="form-control mt-1" placeholder="enter state" required>
                                <option>--SELECT--</option>
                                {read_states.data.states.map(state => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select> */}

                        </div>
                        <div className="field col-md-4">
                            <label className="required">Subdistrict</label>
                            {/* <input type="city/village" name="City_Village" onChange={onInputChange} className="form-control mt-1" placeholder="enter village" required title="Please enter valid contact number" /> */}
                            {/* <select onChange={onCity_VillageChange} type="text" name="City_Village" className="form-control mt-1" placeholder="enter city" required>
                                <option>--SELECT--</option>
                                {read_cities.data.cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select> */}
                            <Select
                                name="subdistrict"
                                options={read_geolocations.data.geo_locations.filter(function (currentElement) {
                                    if (currentElement.location_type === "SUBDISTRICT" && currentElement.parent_id === District) {
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
                    <div className="row mt-2">




                        <div className="field col-md-4">
                            <label className="required">Location</label>
                            <input type="location" name="Location" onChange={onLocationChange} className="form-control mt-1" placeholder="enter location" required />
                        </div>
                    </div><br />
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label className="required">Media Type</label>
                            {/* <input type="mediatype" name="Media_Type" onChange={onMedia_TypeChange} className="form-control mt-1" placeholder="enter media type " required /> */}
                            <Select
                                name="Media_Type"
                                options={media_type.data.media_type_master}
                                onChange={onMedia_TypeChange}
                                getOptionLabel={(option) => option.media_type}
                                getOptionValue={(option) => option.id}
                            />
                        </div>

                        <div className="field col-md-4">
                            <label className="required">Illumination</label>

                            {/* <input type="text" name="Illumination" onChange={onIlluminationChange} className="form-control mt-1" placeholder="enter illumination" required /> */}
                            <Select
                                name="Illumination"
                                options={[
                                    { value: 'F LIT', label: 'F LIT' },
                                    { value: 'NON LIT', label: 'NON LIT' }
                                ]}
                                onChange={onIlluminationChange}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                            />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Width</label>
                            <input type="number" name="Width" onChange={onWidthChange} className="form-control mt-1" placeholder="enter width" required />
                        </div>
                    </div><br />
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label className="required">Height </label>
                            <input type="number" name="Height" onChange={onHeightChange} className="form-control mt-1" placeholder="enter height" required />
                        </div>


                        <div className="field col-md-4">
                            <label className="required">No of Display </label>
                            <input type="number" name="NoofDisplay" onChange={onNoofDisplayChange} className="form-control mt-1" placeholder="enter no of display" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Total Sq.Ft </label>
                            <input value={Totalsqft} type="number" name="Totalsqft" className="form-control mt-1" placeholder="enter total sq.ft" required />
                        </div>
                    </div><br />
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label className="required">Rate</label>
                            <input type="number" name="DisplayRatePMRate" onChange={onDrpmRateChange} className="form-control mt-1" placeholder="enter rate of display rate P.M" required />
                        </div>

                        <div className="field col-md-4">
                            <label className="required">Display Rate P.M </label>
                            <input value={DisplayRatePM} type="number" name="DisplayRatePM" className="form-control mt-1" placeholder="enter display rate P.M" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Printing Rate Per Sq ft</label>
                            <input type="number" name="OneTimePrintingCostRate" onChange={onOtpcChange} className="form-control mt-1" placeholder="enter one time cost rate" required />
                        </div>
                    </div><br />
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label className="required">One Time Printing Cost</label>
                            <input value={OneTimePrintingCost} type="number" name="OneTimePrintingCost" className="form-control mt-2" placeholder="enter one time printing cost" required />
                        </div>

                        <div className="field col-md-4">
                            <label className="required">Mounting Rate Per Sq ft</label>
                            <input type="number" name="OneTimeMountingCostRate" onChange={onOtmcChange} className="form-control mt-1" placeholder="enter one time mounting cost rate" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">One Time Mounting Cost </label>
                            <input value={OneTimeMountingCost} type="number" name="OneTimeMountingCost" className="form-control mt-1" placeholder="enter one time mounting cost" required />
                        </div>

                    </div><br />
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label className="required">Total</label>
                            <input value={Total} type="number" name="Total" className="form-control mt-1" placeholder="enter total" required />
                        </div>


                        <div className="field col-md-4">
                            <label className="">Booking From</label>
                            <input type="date" name="Availability From" onChange={onAvailabilityFromChange} className="form-control mt-1" placeholder="enter availability" />
                        </div>
                        <div className="field col-md-4">
                            <label className="">Booking To</label>
                            <input type="date" name="Availability To" onChange={onAvailabilityToChange} className="form-control mt-1" placeholder="enter availability" />
                        </div>

                        <br />
                    </div><br />
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label className="required">Hoarding Insurance</label>
                            <input type="text" name="hoarding_insurance" onChange={onhoarding_insuranceChange} className="form-control mt-1" placeholder="enter total" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Hoarding Insurance From</label>
                            <input type="date" name="hoardingInsuranceFrom" onChange={onHoardingInsuranceFromChange} className="form-control mt-1" placeholder="enter hoarding insurance from" required />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">Hoarding Insurance To</label>
                            <input type="date" name="errection_year " onChange={onHoardingInsuranceToChange} className="form-control mt-1" placeholder="enter insurance to" required />
                        </div>
                    </div><br />
                    <div className="row mt-2">
                        {/* <div className="field col-md-4">
                    <label className="required">Fabricator</label>
                    <select className="form-control" onChange={onfabrication_selectionChange}>
                                <option>Select...</option>
                                {read_fabricator.data.labor_master.map((labor) => (
                                    <option key={labor.id} value={labor.id}>{labor.name}</option>
                                ))}
                            </select>
                        </div> */}
                        <div className="field col-md-4">
                            <label>Erection Selection</label>
                            <select className="form-control" onChange={onErectionChange} >
                                <option>Select...</option>
                                {read_hoarding_erection.data.hoarding_errection.map((erection) => (
                                    <option id={erection.id} value={erection.id}>{erection.location}</option>
                                ))}
                            </select>

                        </div>
                        <div className="field col-md-4">
                            <label>Status</label>
                            <select className="form-control" onChange={onStatusChange} >
                                <option>Select...</option>
                                <option>Immediate</option>
                                <option>Booked</option>
                                <option>Hold</option>
                            </select>
                        </div>


                    </div><br />
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>
                        <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Reset</button>
                        <br /><br />
                        {/* <button className="btn btn-primary" type='Next' style={{ marginLeft: '5%' }}>Next</button> */}
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