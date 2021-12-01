import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { DataGrid } from '@material-ui/data-grid';
import { Category } from '@material-ui/icons';
import { Modal, Button } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';

import {
    gql,
    useQuery,
    useSubscription,
    useMutation
} from '@apollo/client';

const getLabour_Master=gql`
subscription MySubscription($_eq: String = "false"){
    labour_category_master(where: {isDeleted: {_eq: $_eq}}){
      id
      labour_category
    }
  }
  
  

`

const InsertLabour_Master =gql`
mutation MyMutation($labour_category: String = "") {
    insert_labour_category_master_one(object: {labour_category: $labour_category}) {
      id
    }
  }
  

`

const UpdateLabour_Master =gql`
mutation MyMutation($id: Int = "", $labour_category: String = "") {
    update_labour_category_master_by_pk(pk_columns: {id: $id}, _set: { labour_category: $labour_category}) {
      id
      labour_category
    }
  }
  


`

// const Deletelabour_Master = gql`
// mutation MyMutation($id: Int = 10) {
//     delete_labour_category_master_by_pk(id: $id) {
//       id
//       labour_category
//     }
//   }
  
// `

const Deletelabour_Master = gql`
mutation MyMutation($isDeleted: String = "", $id: Int = 10) {
    update_labour_category_master_by_pk(pk_columns: {id: $id}, _set: {isDeleted: $isDeleted}) {
      id
    }
  }
  
`




export default function Labour_Category_Master() {
    
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
const[modallabour,setmodallabour]=useState({
    id:'',
    labour_category:'',
})


const onModalInputChange =(e) =>{
    setmodallabour({ ...modallabour, [e.target.name]: e.target.value });
  }
  
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(modallabour);
    Update_labourmasterData({ variables: { id: modallabour.id, labour_category: modallabour.labour_category } })
   
    handleClose();
  }



    const[Insert_labourmasterData]=useMutation(InsertLabour_Master);
    const[Update_labourmasterData]=useMutation(UpdateLabour_Master);
    const[delete_labourmasterdata]=useMutation(Deletelabour_Master);
    const onFormSubmit=(e)=>{
        e.preventDefault();
        console.log(e.target)
        Insert_labourmasterData({variables:{labour_category: e.target[0].value}})
        toast.configure();
        toast.success('Successfully Inserted')
       }
       
       const onEdit = (row) => {
        handleShow();
        console.log(row);
        setmodallabour({
            id: row.id,
            labour_category: row.labour_category
        })
    }

    const onDelete = (id) => {
        console.log(id);
        delete_labourmasterdata({ variables: { id: id } });
        toast.configure();
        toast.error('Successfully Deleted')
    }

    const getlabour_category_master = useSubscription(getLabour_Master);
    if (getlabour_category_master.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }   
    console.log(getlabour_category_master.data);
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
            field: 'labour_category',
            headerName: 'Labour Category ',
            width: 200,
            editable: false,
        },

        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "250%", textAlign: 'center'  }}>
                        <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" style={{marginRight: '10%' }} ><i className="bi bi-pencil-fill"onClick={()=>{onEdit(params.row)}}></i></button>

                        <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }}><i className="bi bi-trash-fill"></i></button>

                    </div>
                );
            }
        },
    ];

    

    const rows=getlabour_category_master.data.labour_category_master;
    let newData = []
    rows.map((item, index) => {
        newData.push({ sno: index + 1, ...item })
    })
    return (
        <>
        <div>
            
        <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>labour Category Master</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      
                            <form className="form-group" onSubmit={onModalFormSubmit}>
                                <div className="row">
                                    <div className="field col-md-6 text-right">
                                        <label className="required">ID</label>
                                        <input defaultValue={modallabour.id} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="id" type="text" placeholder='Enter media type' required />
                                    </div>
                                    <div className="field col-md-6 text-right">
                                        <label className="required">labour Category master</label>
                                        <input defaultValue={modallabour.labour_category} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="labour_category" type="text" placeholder='Enter labour_category' required />
                                    </div>
                                </div><br />
                               
                                    <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>

                                
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
                    <div className="container">
                        <div className="col-md-12">
                            <br/>
                            <h3 style={{ width: '100%', textAlign: 'center' }}>Labour Category Master</h3>

<br/>
                            <form onSubmit={onFormSubmit} className="form-group" >
                                <div className="row mt-2">
                                    <div className="field col-md-4" style={{ marginRight: '40px' }}>
                                    </div>
                                    <div className="field col-md-4 text-right">
                                        <label className="required">Labour Category</label>
                                        <input placeholder="enter labour category"  className="form-control mt-2" style={{ marginTop: '10px', width:'80%' }} name="labour_category" type="text" required />
                                    </div>
                                </div>
                               <br/>
                                <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                    <button className="btn btn-primary" type='submit'style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }}>Save</button>

                                    <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width:'20%', backgroundColor:'#33323296', borderColor:'GrayText' }} >Reset</button>
                                </div>
                            </form>

                        </div><br />
                    </div>
                </Card>
            </div>
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
                        // components={{
                        //   Toolbar: GridToolbar,
                        // }}

                        disableSelectionOnClick
                    />
                </div>
            </Card>
        </>

    )
}