import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select'
import { CSVLink, CSVDownload } from "react-csv";
const READ_COUNTRIES = gql`
query MyQuery {
    countries {
      id
      name
      phonecode
      sortname
    }
  }  
`

const READ_STATES = gql`
query MyQuery {
    states {
      country_id
      id
      name
    }
  }  
`

const READ_CITIES = gql`
query MyQuery {
    cities {
      state_id
      name
      id
    }
  }
`
const READ_MEDIA = gql`
query MyQuery {
    media_type_master {
      id
      media_type
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
const READ_SIZE = gql`
query MyQuery {
    size_master {
      id
      height
      width
      no_of_display
    }
  }  
`

const SEARCH_INVENTORY = gql`
query MyQuery($country: Int!,$state:Int!,$city:Int!,$illumination:String!,$media_type:Int!,$_gt: date = "") {
    Inventory_Master(where: {Country: {_eq: $country}, State:{_eq:$state},City_Village:{_eq:$city},Illumination:{_eq:$illumination},Media_Type:{_eq:$media_type},AvailabilityTo: {_lt: $_gt}}) {
        AvailabilityFrom
        AvailabilityTo
        City_Village
        Country
        errection_cost
        errection_year
        fabrication_selection
        hoarding_insurance
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
        id
        country {
            id
            name
          }
          city {
            id
            name
          }
          state {
            id
            name
          }
          media_type_master {
            id
            media_type
          }
      }
  }
  
`

const INSERT_INQUIRY = gql`
mutation MyMutation($inventory: Int! $email_id: String = "", $name: String = "", $number: String = "", $sol: String = "", $whatsapp_number: String = "",$start_date:date!,$end_date:date!,$work_order:String="",$task_sheet:String!,$downtime:String!,$media_type:Int!,$status:String!) {
    insert_inquiry_master_one(object: {inventory: $inventory, email_id: $email_id, name: $name, number: $number, sol: $sol, whatsapp_number: $whatsapp_number,start_date:$start_date,end_date:$end_date,work_order:$work_order,task_sheet:$task_sheet,downtime:$downtime,media_type:$media_type,status:$status}) {
      id
    }
  }
`
const UPDATE_INQUIRY = gql`
mutation MyMutation($email_id: String = "", $inventory: Int!, $name: String = "", $number: String = "", $sol: String = "", $whatsapp_number: String = "", $id: Int!,$start_date:date!,$end_date:date!,$work_order:String="",$task_sheet:String!,$downtime:String!,$media_type:Int!,$status:String!) {
    update_inquiry_master_by_pk(pk_columns: {id: $id}, _set: {email_id: $email_id, inventory: $inventory, name: $name, number: $number, sol: $sol, whatsapp_number: $whatsapp_number,start_date:$start_date,end_date:$end_date,work_order:$work_order,task_sheet:$task_sheet,downtime:$downtime,media_type:$media_type,status:$status}) {
      id
    }
  }
`
const DELETE_INQUIRY = gql`
mutation MyMutation($id: Int!) {
  delete_inquiry_master_by_pk(id: $id) {
    id
  }
}
`

const READ_INQUIRY = gql`
subscription MySubscription {
    inquiry_master {
      email_id
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
      end_date
      id
      inventory
      name
      number
      sol
      start_date
      whatsapp_number
      work_order
      task_sheet
      downtime
      media_type
      media_type_master {
        id
        media_type
        }
        status
    }
  }
`

export default function Inquiry_Master() {
    //States
    const [showhide, setShowhide] = useState('hidden');
    const [country, setCountry] = useState();
    const [state, setState] = useState();
    const [city, setCity] = useState();
    const [illumination, setIllumination] = useState();
    const [searchMediaType, setSearchMediaType] = useState();
    const [searchDate, setSearchDate] = useState();
    // const [district, setDistrict] = useState();
    // const [taluka, setTaluka] = useState();
    const [location, setLocation] = useState();
    const [inventoryData, setInventoryData] = useState();


    const read_media = useQuery(READ_MEDIA);
    const read_countries = useQuery(READ_COUNTRIES);
    const read_states = useQuery(READ_STATES);
    const read_cities = useQuery(READ_CITIES);
    //const read_inventory = useQuery(READ_INVENTORY);
    const read_inquiry = useSubscription(READ_INQUIRY);
    const [loadInventory, { loading, error, data }] = useLazyQuery(SEARCH_INVENTORY);

    //Loader
    if (read_inquiry.loading  || read_countries.loading || read_states.loading || read_cities.loading || loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;

    const onCountryChange = (country_data) => {
        setCountry(country_data.id)
    }
    const onStateChange = (state_data) => {
        setState(state_data.id)
    }
    const onCityChange = (city_data) => {
        setCity(city_data.id);
    }
    const onIlluminationChange = (e) => {
        setIllumination(e.target.value);
    }
    const onsearchMediaTypeChange = (e) => {
        console.log(e.target.value)
        setSearchMediaType(e.target.value)
    }
    const onDateChange = (e) => {
        console.log(e.target.value);
        setSearchDate(e.target.value);
    }
    // const onDistrictChange = (district_data) => {
    //     setDistrict(district_data.District);
    // }
    // const onTalukaChange = (taluka_data) => {
    //     setTaluka(taluka_data.Taluka);
    // }
    const onLocationChange = (e) => {
        //console.log(e.target[1].value);

        //console.log(e.target.value);
        var inv = data.Inventory_Master[0]
        const filteredInventory = data.Inventory_Master.filter((location) => location.Location.includes(e.target.value))
        setInventoryData(filteredInventory[0]);
        //console.log(filteredInventory[0].id)
        setLocation(filteredInventory[0].id);
        //setShowhide("visible");
    }
    const onSearch = (e) => {
        e.preventDefault();
        //console.log(district);
        // loadInventory({variables:{country:country,state:state,city:city,district:district,taluka:taluka,location:location,size:size,illumination:illumination,media:media}})
        loadInventory({ variables: { country: country, state: state, city: city, illumination: illumination, media_type: searchMediaType, _gt: searchDate } })
        //console.log(data);
        setShowhide("visible");
    }
    const columns = [
        {
            field: 'Country',
            headerName: 'Country',
            width: 160,
            valueGetter: (params) => {
                //console.log(params.row.stateByState)
                return params.row.country.name;
            }
        },
        {
            field: 'State',
            headerName: 'State',
            width: 160,
            valueGetter: (params) => {
                //console.log(params.row.stateByState)
                return params.row.state.name;
            }
        },
        {
            field: 'City_Village',
            headerName: 'City_Village',
            width: 160,
            valueGetter: (params) => {
                return params.row.city.name;
            }
        },
        { 
            field: 'District', 
            headerName: 'District', 
            width: 200 
        },
        { 
            field: 'Taluka', 
            headerName: 'Taluka', 
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
            headerName: 'OtpcRate', 
            width: 200 
        },
        { 
            field: 'OneTimePrintingCost', 
            headerName: 'OneTimePrintingCost', 
            width: 200 
        },
        { 
            field: 'OtmcRate', 
            headerName: 'OtmcRate', 
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
            headerName: 'AvailabilityFrom',
            width: 200
        },
        { 
            field: 'AvailabilityTo', 
            headerName: 'AvailabilityTo', 
            width: 200 
        },
    ]
    //console.log(data);
    const emptyarr = [
        {
            id:45,
            AvailabilityFrom: "",
            AvailabilityTo: "",
            City_Village: "",
            Country: "",
            DisplayRatePM: "",
            District: "",
            DrpmRate: "",
            Height: "",
            Illumination: "",
            Location: "",
            Media_Type: "",
            NoofDisplay: "",
            OneTimeMountingCost: "",
            OneTimePrintingCost: "",
            OtmcRate: "",
            OtpcRate: "",
            State: "",
            Taluka: "",
            Total: "",
            Totalsqft: "",
            Width: "",
            city:{
                id: "",
                name: ""
            },
            country:{
                id: "",
                name: ""
            },
            media_type_master:{
                id: "",
                media_type: ""
            },
            state:{
                id: "",
                name: ""
            }
        }
    ]
    var rows = emptyarr;
    if(data)
    {
       rows=data.Inventory_Master;
    }
    console.log(rows);
    return (
        <div>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}><form className="form-group">
                    <h4 className="text-center">Quick Media Proposal</h4><br />
                    <div className="row">
                        <div className="field col-md-4">
                            <label className="required">Country</label>
                            {/* <input onChange={onInputChange} type="text" name="address" className="form-control" /> */}
                            {/* <select onChange={onInputChange} type="text" name="country" className="form-control mt-1" placeholder="enter country" required>
                        <option>--SELECT--</option>
                        {read_countries.data.countries.map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                    </select> */}
                            <Select
                                name="country"
                                options={read_countries.data.countries}
                                onChange={onCountryChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">State</label>
                            {/* <input onChange={onInputChange} type="text" name="address" className="form-control" /> */}
                            {/* <select onChange={onInputChange} type="text" name="state" className="form-control mt-1" placeholder="enter state" required>
                        <option>--SELECT--</option>
                        {read_states.data.states.map(state => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select> */}
                            <Select
                                name="state"
                                options={read_states.data.states}
                                onChange={onStateChange}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                            />
                        </div>
                        <div className="field col-md-4">
                            <label className="required">City</label>
                            {/* <input onChange={onInputChange} type="text" name="address" className="form-control" /> */}
                            {/* <select onChange={onInputChange} type="text" name="cities" className="form-control mt-1" placeholder="enter city" required>
                        <option>--SELECT--</option>
                        {read_cities.data.cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select> */}
                            <Select
                                name="city"
                                options={read_cities.data.cities}
                                onChange={onCityChange}
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
                    </div>

                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button onClick={onSearch} className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '10%' }}>Search</button>
                    </div><br />
                    <div className="row">

                        {/* <div className="field col-md-4" style={{ marginLeft: '30%' }}>
                            <label className="required" style={{ visibility: 'visible' }}>Location</label>
                            <select className="form-control" onChange={onLocationChange}>
                                <option>Select...</option>
                                {data === undefined ? '' : data.Inventory_Master.map((inventory) => (
                                    <option key={inventory.id} value={inventory.Location}>{inventory.Location}</option>
                                ))}
                            </select>
                        </div> */}
                    </div><br /> <br />
                </form >
                {/* <div style={{ height: 500, width: '100%', visibility: showhide }}  >
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label>Country</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.country.name} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>State</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.state.name} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>City</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.city.name} readOnly />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label>District</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.District} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Taluka</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.Taluka} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Location</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.Location} readOnly />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label>Media</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.media_type_master.media_type} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Illumination</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.Illumination} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Width</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.Width} readOnly />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label>Height</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.Height} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>No Of Display</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.NoofDisplay} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Total sq ft</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.Totalsqft} readOnly />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label>Rate</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.DrpmRate} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Display Rate PM</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.DisplayRatePM} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Rate</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.OtpcRate} readOnly />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label>One Time Printing Cost</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.OneTimePrintingCost} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Rate</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.OtmcRate} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>One Time Mounting Cost</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.OneTimeMountingCost} readOnly />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="field col-md-4">
                            <label>Total</label>
                            <input type="Text" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.Total} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Availability From</label>
                            <input type="date" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.AvailabilityFrom} readOnly />
                        </div>
                        <div className="field col-md-4">
                            <label>Availability To</label>
                            <input type="date" className="form-control" name="" defaultValue={inventoryData === undefined ? '' : inventoryData.AvailabilityTo} readOnly />
                        </div>
                    </div>
                    <CSVLink data={data === undefined ? '' : data.Inventory_Master}>Download</CSVLink>
                </div> */}
                <div style={{ height: 500, width: '100%', visibility: showhide }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection={true}
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