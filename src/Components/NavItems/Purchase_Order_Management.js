import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  useMutation,
  useQuery,
  gql,
  useSubscription
} from "@apollo/client";
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';




const getPurchase_Master = gql`
subscription MySubscriptiony($_eq: String = "false"){
    purchase_order(where: {isDeleted: {_eq: $_eq}}){
      billing_name
      billing_address
      purchase_order_number
      purchase_order_date
      campaign_name
      quotation_number
      gst_details
      company_pan
      payment_terms
      id
    }
  }
  
`
const InsertPurchase_Master = gql`
mutation MyMutation($billing_address: String = "", $billing_name: String = "", $campaign_name: String = "", $company_pan: String = "", $gst_details: String = "", $payment_terms: String = "", $purchase_order_date: String = "", $purchase_order_number: String = "", $quotation_number: String = "") {
  insert_purchase_order(objects: {billing_address: $billing_address, billing_name: $billing_name, campaign_name: $campaign_name, company_pan: $company_pan, gst_details: $gst_details, payment_terms: $payment_terms, purchase_order_date: $purchase_order_date, purchase_order_number: $purchase_order_number, quotation_number: $quotation_number}) {
    affected_rows
  }
}

`


const UpdatePurchase_Master = gql`
mutation MyMutation($id: Int = 0, $billing_address: String = "", $billing_name: String = "", $campaign_name: String = "", $company_pan: String = "", $gst_details: String = "", $payment_terms: String = "", $purchase_order_date: String = "", $purchase_order_number: String = "", $quotation_number: String = "") {
  update_purchase_order_by_pk(pk_columns: {id: $id}, _set: {billing_address: $billing_address, billing_name: $billing_name, campaign_name: $campaign_name, company_pan: $company_pan, gst_details: $gst_details, payment_terms: $payment_terms, purchase_order_date: $purchase_order_date, purchase_order_number: $purchase_order_number, quotation_number: $quotation_number}) {
    billing_address
    billing_name
    campaign_name
    company_pan
    gst_details
    id
    payment_terms
    purchase_order_date
    purchase_order_number
    quotation_number
  }
}

  
`

// const DeletePurchase_Master = gql`
// mutation MyMutation($id: Int = 10) {
//     delete_purchase_order_by_pk(id: $id) {
//       billing_name
//       billing_address
//       purchase_order_number
//       purchase_order_date
//       campaign_name
//       quotation_number
//       gst_details
//       company_pan
//       payment_terms
//       id
//     }
//   }
// `

const DeletePurchase_Master=gql`
mutation MyMutation($isDeleted: String = "true", $id: Int = 0) {
  update_purchase_order_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
    id
  }
}

`

function Purchase_Order_Management() {

  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [purchase, setpurchase] = useState({
    id: '',
    billing_name: '',
    billing_address: '',
    purchase_order_number: '',
    purchase_order_date: '',
    campaign_name: '',
    quotation_number: '',
    gst_details: '',
    company_pan: '',
    payment_terms: '',
  })

  const [modalpurchase, setModalpurchase] = useState({
    id: '',
    billing_name: '',
    billing_address: '',
    purchase_order_number: '',
    purchase_order_date: '',
    campaign_name: '',
    quotation_number: '',
    gst_details: '',
    company_pan: '',
    payment_terms: '',
  });


  const [insertpurchasedata] = useMutation(InsertPurchase_Master);
  const [updatepurchasedata] = useMutation(UpdatePurchase_Master);
  const [deletepurchasedata] = useMutation(DeletePurchase_Master);

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.value)
    insertpurchasedata({ variables: purchase })
    toast.configure();
    toast.success('Successfully Inserted')
  }

  const onEdit = (row) => {
    handleShow();
    setModalpurchase({
      id: row.id,
      billing_name: row.billing_name,
      billing_address: row.billing_address,
      purchase_order_number: row.purchase_order_number,
      purchase_order_date: row.purchase_order_date,
      campaign_name: row.campaign_name,
      quotation_number: row.quotation_number,
      gst_details: row.gst_details,
      company_pan: row.company_pan,
      payment_terms: row.payment_terms,
    })
  }
  const onModalInputChange = (e) => {
    setModalpurchase({ ...modalpurchase, [e.target.name]: e.target.value });
  }

  const onInputChange = (e) => {
    setpurchase({ ...purchase, [e.target.name]: e.target.value })
  }
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(modalpurchase);
    updatepurchasedata({ variables: { id: modalpurchase.id, billing_name: modalpurchase.billing_name, billing_address: modalpurchase.billing_address, purchase_order_number: modalpurchase.purchase_order_number, purchase_order_date: modalpurchase.purchase_order_date, campaign_name: modalpurchase.campaign_name, quotation_number: modalpurchase.quotation_number, gst_details: modalpurchase.gst_details, company_pan: modalpurchase.company_pan, payment_terms: modalpurchase.payment_terms } })
    toast.configure();
    toast.warning('Successfully Updated')
    handleClose();
  }

  const onDelete = (id) => {
    console.log(id);
    deletepurchasedata({ variables: { id: id } });
    toast.configure();
    toast.error('Successfully Deleted')
  }



  const columns = [
    {
      field: 'sno',
      headerName: 'Serial No',
      width: 150,
  },
    { field: 'id', headerName: 'ID', width: 100 },

    { field: 'billing_name', headerName: 'Billing Name', width: 200 },

    { field: 'billing_address', headerName: 'Billing Address', width: 200, },

    { field: 'purchase_order_number', headerName: 'Purchase Order number', width: 230, },

    { field: 'purchase_order_date', headerName: 'Purchase Order Date', width: 230, },


    { field: 'campaign_name', headerName: 'Campaign', width: 210, },
    { field: 'quotation_number', headerName: 'Quotation Number', width: 210, },
    { field: 'gst_details', headerName: 'GST Details', width: 190, },
    { field: 'company_pan', headerName: 'company Pan', width: 190, },
    { field: 'payment_terms', headerName: 'Payment Terms', width: 190, },
    // { field: 'gst no', headerName: 'gst no', width: 170, },
    // { field: 'pan', headerName: 'pan', width: 170, },

    {
      field: 'action',
      headerName: 'Action',
      width: 170,
      renderCell: (params) => {
        return (
          <div className="">
            <button data-toggle="tooltip" title="Edit" style={{ marginLeft: '5%' }} onClick={() => onEdit(params.row)} type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"> </i></button>
            <button data-toggle="tooltip" title="Delete" style={{ marginLeft: '50%' }} className="btn btn-danger" onClick={() => {
              const confirmBox = window.confirm(
                "Do you really want to delete?"
              )
              if (confirmBox === true) {
                onDelete(params.row.id)
              }
            }} ><i className="bi bi-trash-fill"></i></button>

          </div>
        );
      }
    },


  ];



  const getpurchase_order = useSubscription(getPurchase_Master);
  if (getpurchase_order.loading) {
    return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  }
  //console.log(getpurchase_order.data);

  const rows = getpurchase_order.data.purchase_order;
  let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })



  return (

    <div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ marginLeft: "130px" }}>Edit Purchase Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <form className="form-group" onSubmit={(e) => { onModalFormSubmit(e) }}>
            <div className="row">
              <div className="field col-md-6">
                <label className="required">ID</label>
                <input defaultValue={modalpurchase.id} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="id" type="text" required />
              </div>
              <div className="field col-md-6">
                <label className="required">billing Name</label>
                <input defaultValue={modalpurchase.billing_name} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="billing_name" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label className="required">billing address</label>
                <input defaultValue={modalpurchase.billing_address} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="billing_address" type="text" required />
              </div>
              <div className="field col-md-6">
                <label className="required">Purchase Order Number</label>
                <input defaultValue={modalpurchase.purchase_order_number} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="purchse_order_number" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label className="required">Purchase_order_date</label>
                <input defaultValue={modalpurchase.purchase_order_date} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="purchse_order_date" type="text" required />
              </div>
              <div className="field col-md-6">
                <label className="required">Campaign Name</label>
                <input defaultValue={modalpurchase.campaign_name} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="campaign_name" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label className="required">Quotation Number</label>
                <input defaultValue={modalpurchase.quotation_number} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="quotation_number" type="text" required />
              </div>
              <div className="field col-md-6">
                <label className="required">GST Details</label>
                <input defaultValue={modalpurchase.gst_details} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="gst_details" type="text" required />
              </div>
            </div>
            <div className="row">
              <div className="field col-md-6">
                <label className="required">Company Pan</label>
                <input defaultValue={modalpurchase.company_pan} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="company_pan" type="text" required />
              </div>
              <div className="field col-md-6">
                <label className="required">Payment Terms</label>
                <input defaultValue={modalpurchase.payment_terms} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="payment_terms" type="text" required />
              </div>
            </div>
            <div className="field col-md-6">
              <button className="btn btn-primary mt-3" style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>
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
        <h4 className="text-center">Purchase Order</h4>
        <form onSubmit={onFormSubmit} className="form-group">
          <div className="row mt-4">
            <div className="field col-md-4">
              <label className="required">Billing Name</label>
              <input placeholder="enter billing name" className="form-control mt-1" onChange={onInputChange} name="billing_name" type="text" required />
            </div>

            <div className="field col-md-4">
              <label className="required">Billing Adress</label>
              <input placeholder="enter biiling_address" className="form-control mt-1" onChange={onInputChange} name="billing_address" type="text" required />
            </div>
            <div className="field col-md-4">
              <label className="required">Purchase order Number</label>
              <input placeholder="enter purchase order number" className="form-control mt-1" onChange={onInputChange} name="purchase_order_number" type="text" required />
            </div><br />
          </div>
          <div className="row mt-4">
            <div className="field col-md-4">
              <label className="required">Purchase order date</label>
              <input placeholder="enter date" className="form-control mt-1" onChange={onInputChange} name="purchase_order_date" type="date" required />
            </div>

            <div className="field col-md-4">
              <label className="required">Campaign Name</label>
              <input placeholder="enter campaign name" className="form-control mt-1" onChange={onInputChange} name="campaign_name" type="text" required />
            </div>
            <div className="field col-md-4">
              <label className="required">Quotation Number</label>
              <input placeholder="enter quotation Number" className="form-control mt-1" onChange={onInputChange} name="quotation_number" type="text" required />
            </div>
          </div><br />
          <div className="row mt-4">
            <div className="field col-md-4">
              <label className="required">GST Details</label>
              <input placeholder="enter gst details" className="form-control mt-1" onChange={onInputChange} name="gst_details" type="text" required />
            </div>

            <div className="field col-md-4">
              <label className="required">Company Pan</label>
              <input placeholder="enter Pan" className="form-control mt-1" onChange={onInputChange} name="company_pan" type="text" required />
            </div>
            <div className="field col-md-4">
              <label className="required">Payment Terms</label>
              <input placeholder="enter payment terms" className="form-control mt-1" onChange={onInputChange} name="payment_terms" type="text" required />
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
            components={{
              Toolbar: GridToolbar,
            }}

            disableSelectionOnClick
          />
        </div>
      </Card>
    </div>
  );

}

export default Purchase_Order_Management;