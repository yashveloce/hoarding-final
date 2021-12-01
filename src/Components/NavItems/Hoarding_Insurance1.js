import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'
import { CSVLink, CSVDownload } from "react-csv";

const SEARCH_INVENTORY = gql`
query MyQuery($id: Int!) {
    Inventory_Master_by_pk(id: $id) {
        id
        hoarding_insurance_to
        hoarding_insurance_from
        hoarding_insurance
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
      
      hoarding_insurance
      hoarding_insurance_to
        hoarding_insurance_from
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
const UPDATE_INVENTORY=gql`
mutation MyMutation($hoarding_insurance: String = "", $hoarding_insurance_from: date = "", $hoarding_insurance_to: date = "", $id: Int!) {
    update_Inventory_Master_by_pk(pk_columns: {id: $id}, _set: {hoarding_insurance: $hoarding_insurance, hoarding_insurance_from: $hoarding_insurance_from, hoarding_insurance_to: $hoarding_insurance_to}) {
      id
    }
  }  
`

function Hoarding_Insurance1() {
    //States
    const [filteredData,setFilteredData] = useState();
    const [get_data, setGet_data] = useState();
    const [inventory, setInventory] = useState();
    const [id,setId] = useState();
    const [insurance, setInsurance] = useState();
    const [insuranceFrom, setInsuranceFrom] = useState();
    const [insuranceTo, setInsuranceTo] = useState();

    //Queries
    const [update_inventory] = useMutation(UPDATE_INVENTORY);
    const read_inventory = useQuery(READ_INVENTORY);
    const [searchInventory, searchInventoryData] = useLazyQuery(SEARCH_INVENTORY, {
        onCompleted: data => {
            // console.log('data ', data);
            setGet_data(data);
        }
    });
    if (read_inventory.loading || searchInventoryData.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }

    //Events
    const onInventoryChange = (e) => {
        setFilteredData("")
        setInventory(e.target.value);
        //console.log(typeof e.target.value);
        searchInventory({ variables: { id: inventory } });
        const filteredInventory = read_inventory.data.Inventory_Master.filter((location) => location.id.toString().includes(e.target.value))
        console.log(read_inventory.data.Inventory_Master.filter((location) => location.id.toString().includes(e.target.value)));
        //setFilteredData(filteredInventory);
        setId(filteredInventory[0].id)
        setInsurance(filteredInventory[0].hoarding_insurance)
        setInsuranceFrom(filteredInventory[0].hoarding_insurance_from)
        setInsuranceTo(filteredInventory[0].hoarding_insurance_to)
        //console.log(filteredData[0].hoarding_insurance)

    }
    const onInsuranceChange=(e)=>{
        setInsurance(e.target.value);
    }
    const onInsuranceFromChange=(e)=>{
        setInsuranceFrom(e.target.value);
    }
    const onInsuranceToChange=(e)=>{
        setInsuranceTo(e.target.value);
    }
    const onFormSubmit=(e)=>{
        e.preventDefault();
        update_inventory({variables:{id:id,hoarding_insurance:insurance,hoarding_insurance_from:insuranceFrom,hoarding_insurance_to:insuranceTo}})
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
                <form className='form-group' onSubmit={onFormSubmit}>
                    <div className="col-md-12">
                        <br />
                        <h4 style={{ width: '100%', textAlign: 'center' }}>HOARDING INSURANCE</h4>
                        <br />
                        {/* <Divider style={{ marginBottom: '8px', }} /> */}
                        <div className="row mt-3">
                            <div className="field col-md-4 ">
                                <label className="required">Inventory</label>
                                <select className="form-control mt-1" onChange={onInventoryChange}>
                                    <option>Select...</option>
                                    {read_inventory.data.Inventory_Master.map(inventory => (
                                        <option key={inventory.id} value={inventory.id}>{inventory.Location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="field col-md-4 ">
                                <label className="required">Hoarding Insurance</label>
                                <select defaultValue={insurance} onChange={onInsuranceChange} className="form-control mt-2" >
                                    <option>Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="field col-md-2 ">
                                <label className="required">From Date</label>
                                <input defaultValue={insuranceFrom} onChange={onInsuranceFromChange} type="date" className="form-control" />
                            </div>
                            <div className="field col-md-2 ">
                                <label className="required">To Date</label>
                                <input defaultValue={insuranceTo} onChange={onInsuranceToChange} type="date" className="form-control" />
                            </div>
                        </div>

                    </div>
                    <br />
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>
                        <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Reset</button>
                        {/* <button className="btn btn-primary" type='Next' style={{marginLeft:'5%'}}>Next</button> */}
                    </div>
                    <br />
                </form>
            </Card>
        </div>
    )
}

export default Hoarding_Insurance1
