import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  useMutation,
  useQuery,
  gql,
  useSubscription
} from "@apollo/client";

const getFlex_Master = gql`
subscription MySubscription($_eq: String = "false"){
  flex_vinyl_management(where: {isDeleted: {_eq: $_eq}}){
    designer_selection
    designer_payment
    id
    media
    mounter_payment
    mounter_selection
    printer_payment
    printer_selection
  }
}`

const InsertFlex_Master = gql`
mutation MyMutation($designer_selection: String = "", $designer_payment: String = "", $media: String = "", $mounter_payment: String = "", $mounter_selection: String = "", $printer_payment: String = "", $printer_selection: Int = 10) {
  insert_flex_vinyl_management_one(object: {designer_selection: $designer_selection, designer_payment: $designer_payment, media: $media, mounter_payment: $mounter_payment, mounter_selection: $mounter_selection, printer_payment: $printer_payment, printer_selection: $printer_selection}) {
    designer_selection
    designer_payment
    id
    media
    mounter_payment
    mounter_selection
    printer_payment
    printer_selection
  }
}`
  
// const deleteFlex_Master = gql`
// mutation MyMutation($id: Int = 10) {
//   delete_flex_vinyl_management_by_pk(id: $id) {
//     designer_selection
//     designer_payment
//     id
//     media
//     mounter_payment
//     mounter_selection
//     printer_payment
//     printer_selection
//   }
// }`

const deleteFlex_Master=gql`
mutation MyMutation($isDeleted: String = "true", $id: Int = 0) {
  update_flex_vinyl_management_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
    id
  }
}

`

const updateFlex_Master = gql`
mutation MyMutation($designer_payment: String = "", $designer_selection: String = "", $media: String = "", $mounter_payment: String = "", $mounter_selection: String = "", $printer_payment: String = "", $printer_selection: Int = 10) {
  update_flex_vinyl_management_by_pk(pk_columns: {id: 10}, _set: {designer_payment: $designer_payment, designer_selection: $designer_selection, media: $media, mounter_payment: $mounter_payment, mounter_selection: $mounter_selection, printer_payment: $printer_payment, printer_selection: $printer_selection}) {
    designer_payment
    designer_selection
    id
    media
    mounter_payment
    mounter_selection
    printer_payment
    printer_selection
  }
}`




export default function Flex_and_Vinyl_Management() {
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showhide, setShowhide] = useState('hidden');
  const [Media, setMedia] = useState();

  const [modalId, setModalId] = useState();
  const [modalMedia, setModalMedia] = useState();
  const [flex, setflex] = useState({

    media: '',
    designer_selection: '',
    designer_payment: '',
    printer_selection: '',
    printer_payment: '',
    mounter_selection: '',
    mounter_payment: '',




  });
  const [Modalflex, setModalflex] = useState({
    id: '',
    media: '',
    designer_selection: '',
    designer_payment: '',
    printer_selection: '',
    printer_payment: '',
    mounter_selection: '',
    mounter_payment: '',
    
  })







  const [Insert_flexinsertData] = useMutation(InsertFlex_Master);
  const [delete_flexdeleteData] = useMutation(deleteFlex_Master);
  const [update_flexupdateData] = useMutation(updateFlex_Master);

  const onMediaChange = (e) => {
    if (e.target.value === 'Yes') {
        setShowhide('visible');
    }
    else {
        setShowhide('hidden');
    }
    setMedia(e.target.value);
    console.log(e.target.value);
}

  const onInputChange = (e) => {
    setflex({ ...flex, [e.target.name]: e.target.value })
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target)
    Insert_flexinsertData({ variables: flex })
    toast.configure();
    toast.success('Successfully Inserted')
  }

  const onEdit = (row) => {
    handleShow();
    setModalflex({
      id: row.id,
      media: row.media,
      designer_selection: row.designer_selection,
      designer_payment: row.designer_payment,
      printer_selection: row.printer_selection,
      printer_payment: row.printer_payment,
      mounter_selection: row.mounter_selection,
      mounter_payment: row.mounter_payment,

    })
    console.log(Modalflex);
  }

  const onModalInputChange = (e) => {
    setModalflex({ ...Modalflex, [e.target.name]: e.target.value })
  }
  const onModalMediaChange = (e) => {
    if (e.target.value === 'Yes') {
        setShowhide('visible');
    }
    else {
        setShowhide('hidden');
    }
    setModalMedia(e.target.value);
    console.log(e.target.value);
}
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    update_flexupdateData({ variables: Modalflex })
    handleClose();
    toast.configure();
    toast.warning('Successfully Updated')
  }



  const onDelete = (id) => {
    delete_flexdeleteData({ variables: { id: id } })
    toast.configure();
    toast.error('Successfully Deleted')
  }



  const getflex_vinyl_management = useSubscription(getFlex_Master);
  if (getflex_vinyl_management.loading) {
    return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;

    console.log(getflex_vinyl_management.data);

  }

  const columns = [
    {
      field: 'sno',
      headerName: 'Serial No',
      width: 150,
  },
    { field: 'id', headerName: 'ID', width: 100 },

    { field: 'media', headerName: 'Media', width: 200 },
    { field: 'designer_selection', headerName: 'Designer_Selection', width: 200 },
    { field: 'designer_payment', headerName: 'Designer_Payment', width: 200 },
    { field: 'printer_selection', headerName: 'printer_Selection', width: 200 },
    { field: 'printer_payment', headerName: 'Printer_Payment', width: 230 },
    { field: 'mounter_selection', headerName: 'Mounter_Selection', width: 230 },
    { field: 'mounter_payment', headerName: 'Mounter_Payment', width: 230 },



    {
      field: 'action',
      headerName: 'Action',
      width: 170,
      renderCell: (params) => {
        return (
          <div className="">
            <button data-toggle="tooltip" title="Edit" onClick={() => { onEdit(params.row) }} style={{ marginLeft: '5%' }} type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"> </i></button>
            <button onClick={() => {
              const confirmBox = window.confirm(
                "Do you really want to delete?"
              )
              if (confirmBox === true) {
                onDelete(params.row.id)
              }
            }} style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" ><i className="bi bi-trash-fill"></i></button>




          </div>
        );
      }
    },
  ];

  const rows = getflex_vinyl_management.data.flex_vinyl_management;
  let newData=[]
    rows.map((item,index)=>{
        newData.push({sno:index+1,...item})
    })
  //  const rows = [
  //     // const rows = [
  //     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  // //     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  // //     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  // //     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  // //     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  // //     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  // //     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  // //     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },

  // //     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  // //     { id: 10, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  //  ];
  return (
    <div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Edit Flex And Vinyl Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <form onSubmit={onModalFormSubmit} className="form-group" padding="1px">

            <div className="row mt-3">
              <div className="field col-md-4">
                <label className="required">Media</label>
                <input placeholder="enter media" defaultValue={Modalflex.media} onChange={onModalInputChange} className="form-control mt-1" name="media" type="text" required />
              </div>

              <div className="field col-md-4">
                <label className="required">Designer_Selection </label>
                <input placeholder="enter designer selection " defaultValue={Modalflex.designer_selection} onChange={onModalInputChange} className="form-control mt-1" name="designer_selection" type="text" required />
              </div>
              <div className="field col-md-4">
                <label className="required">Designer_Payment</label>
                <input placeholder="enter designer payment" defaultValue={Modalflex.designer_payment} onChange={onModalInputChange} className="form-control mt-1" name="designer_payment" type="text" required />
              </div>
            </div>
            <div className="row mt-4">
              <div className="field col-md-4">
                <label className="required">Printer_Selection</label>
                <input placeholder="enter printer selection" defaultValue={Modalflex.printer_selection} onChange={onModalInputChange} className="form-control mt-1" name="printer_selection" type="number" required />
              </div>

              <div className="field col-md-4">
                <label className="required">printer_Payment</label>
                <input placeholder="enter printer payment" defaultValue={Modalflex.printer_payment} onChange={onModalInputChange} className="form-control mt-1" name="printer_payment" type="text" required />
              </div>


            </div>
            <div className="row mt-4">
              <div className="field col-md-4">
                <label className="required">Mounter_Selection</label>
                <input placeholder="enter mounter selection" defaultValue={Modalflex.mounter_selection} onChange={onModalInputChange} className="form-control mt-1" name="mounter_selection" type="text" required />
              </div>

              <div className="field col-md-4">
                <label className="required">Mounter_Payment</label>
                <input placeholder="enter mounter payment" defaultValue={Modalflex.mounter_payment} onChange={onModalInputChange} className="form-control mt-1" name="mounter_payment" type="text" required />
              </div>


            </div>

            <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
              <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width: '20%', backgroundColor: '#33323296', borderColor: 'GrayText' }}>Save</button>

              {/* <button className="btn btn-primary" type='Next' style={{marginLeft:'5%'}}>Next</button> */}
            </div>
            <br />
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
        <h4 className="text-center">Flex Vinyl Management</h4>

        <br />
        <form onSubmit={onFormSubmit}>
          <div className="row mt-4">
            <div className="field col-md-4">
              <label className="required">Media</label>
              <select className="form-control mt-2" onChange={onMediaChange} >
                                    <option>Select...</option>
                                    <option>Flex</option>
                                    <option>Vinyl</option>
                                </select>
              
            </div>


            <div className="field col-md-4">
              <label className="required">Designer Selection</label>
              <input placeholder="enter designer selection" onChange={onInputChange} className="form-control mt-1" name="designer_selection" type="text" required />
            </div>
            <div className="field col-md-4">
              <label className="required">Designer Payment</label>
              <input placeholder="enter designer payment" onChange={onInputChange} className="form-control mt-1" name="designer_payment" type="text" required />
            </div>
          </div>

          <div className="row mt-4">
            <div className="field col-md-4">
              <label className="required">Printer Selection</label>
              <input placeholder="enter printer selection" onChange={onInputChange} className="form-control mt-1" name="printer_selection" type="number" required />
            </div>

            <div className="field col-md-4">
              <label className="required">Printer Payment</label>
              <input placeholder="enter printer payment" onChange={onInputChange} className="form-control mt-1" name="printer_payment" type="text" required />
            </div>
            <div className="field col-md-4">
              <label className="required">Mounter Selection</label>
              <input placeholder="enter mounter selection" onChange={onInputChange} className="form-control mt-1" name="mounter_selection" type="text" required />
            </div>
          </div>
          
            
          <div className="row mt-4">
            <div className="field col-md-4">
              <label className="required">Mounter Payment</label>
              <input placeholder="enter mounter payment" onChange={onInputChange} className="form-control mt-1" name="mounter_payment" type="text" required />
            </div>
          </div>

          <br />
          <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
          <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width:'10%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>
                        <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width:'10%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Reset</button>

          </div>
          <br />
        </form>

        {/* <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          // components={{
          //   Toolbar: GridToolbar,
          // }}
          style={{borderTop: '4px solid #05386b'}}
          disableSelectionOnClick
        />
      </div> */}
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




  )
}