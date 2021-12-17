import React, { useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';

const READ_INVENTORY = gql`
subscription MySubscription($_eq: date = "now()") {
    Inventory_Master(where: {hoarding_insurance_to: {_eq: $_eq}}) {
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
        pin
        parent_id
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
        location
        payment
        permission
        transport_charges
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
          labor_type
          mobile_no
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
      }
    }
  }
`
const READ_LANDLORD_MANAGEMENT=gql`
subscription MySubscription($_eq: String = "false"){
    landlord_management(where: {isDeleted: {_eq: $_eq}}){
      account_no
      address
      agreement_from
      agreement_to
      bank_name
      branch_name
      height
      id
      ifsc
      isDeleted
      location
      mobile_number
      name
      rent_amount
      rent_increment_reminder
      site_address
      width
    }
  }  
`


function Hoarding_Insurance() {
    //states



    //Queries
    const read_inventory = useSubscription(READ_INVENTORY);
    const read_landlord_management = useSubscription(READ_LANDLORD_MANAGEMENT);
    //const [get_inventory,ret_data] = useLazyQuery(GET_INVENTORY);
    if (read_inventory.loading || read_landlord_management.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    //Events

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
    ];
    const columns1=[
        {
            field: 'sno',
            headerName: 'Serial No',
            width: 150,
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            hide: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            hide: false,
        },
        {
            field: 'mobile_number',
            headerName: 'Mobile Number',
            width: 150,
            hide: false,
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 150,
            hide: false,
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 150,
            hide: false,
        },
        {
            field: 'rent_amount',
            headerName: 'Rent Amount Yearly',
            width: 150,
            hide: false,
        },
        {
            field: 'rent_increment_reminder',
            headerName: 'Rent Increment Reminder',
            width: 150,
            hide: false,
        },
        {
            field: 'agreement_from',
            headerName: 'Agreement Tenure From',
            width: 150,
            hide: false,
        },
        {
            field: 'agreement_to',
            headerName: 'Agreement Tenure To',
            width: 150,
            hide: false,
        },
        {
            field: 'site_address',
            headerName: 'Site Address',
            width: 150,
            hide: false,
        },
        {
            field: 'width',
            headerName: 'Width',
            width: 150,
            hide: false,
        },
        {
            field: 'height',
            headerName: 'Height',
            width: 150,
            hide: false,
        },
        {
            field: 'bank_name',
            headerName: 'Bank Name',
            width: 150,
            hide: false,
        },
        {
            field: 'branch_name',
            headerName: 'Branch Name',
            width: 150,
            hide: false,
        },
        {
            field: 'ifsc',
            headerName: 'IFSC',
            width: 150,
            hide: false,
        },
        {
            field: 'account_no',
            headerName: 'Account Number',
            width: 150,
            hide: false,
        },
    ]
    const rows = read_inventory.data.Inventory_Master;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    const rows1 = read_landlord_management.data.landlord_management;
    let newData1 = []
    rows1.map((item, index) => {
        newData1.push({ sno: index + 1, ...item })
    })
    return (
        <div>

            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <h4 style={{ width: '100%', textAlign: 'center' }}>Dashboard</h4>
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
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                marginTop: "2px",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <div style={{ height: 300, width: '100%' }}>
                    <h4>Landlord Rent Reminder</h4>
                    <DataGrid
                        rows={newData1}
                        columns={columns1}
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