import {Modal, Button} from "react-bootstrap";
import {useFormik} from "formik";
import {unitSchema} from "../schema";
import {notifyError, notifySuccess} from "../../toastNotification";
import {fetchAllUnits} from "../../../redux/actions/unitAction";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";

const UnitEditModal = ({show, handleClose, selectedRow, unitList, unitGroupList}) => {

  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();

  const initialValues = {
        unitId: selectedRow ? selectedRow._id : '',
        name: selectedRow ? selectedRow.name : '',
        identifier: selectedRow ? selectedRow.identifier : '',
        value: selectedRow ? selectedRow.value : '',
        unit_group: selectedRow ? selectedRow.unitGroup._id : '',
    }


    const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        validationSchema: unitSchema,
        enableReinitialize: true,
        onSubmit: async (values, action) => {
          const updatedFields = {
            updatedFields: {
                unitId: values.unitId,
                name: values.name,
                identifier: values.identifier,
                value: values.value,
                unitGroup: values.unit_group,
            }
          };
            try {
                const response = await axiosPrivate.put('/admin/update/unit', updatedFields);
                if(response.status === 200){
                    notifySuccess(response.data.message);
                    const newData = [...unitList]
                    const index = newData.findIndex(record => record._id === response.data.data._id);
                    newData[index] = response.data.data;
                    dispatch(fetchAllUnits(newData))
                    handleClose();
                }else {
                    notifyError(response.data.message)
                }
            }catch (e) {
                console.log(e);
                notifyError(e.response.data.message)
            }
        }
    })

  return (
      <>
      <Modal show={show} onHide={() => handleClose()}>
        <Modal.Header>
            <h5 className="modal-title mt-0">Edit Unit</h5>
            <button type="button" className="close" onClick={() => handleClose()}>
                <span aria-hidden="true">&times;</span>
            </button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
              <div className="form-group">
                  <label>Name</label>
                  <input type="text"
                         className="form-control"
                         placeholder=""
                         name={'name'}
                         value={values.name}
                         onChange={handleChange}
                         onBlur={handleBlur}
                  />
                  {
                      touched.name && errors.name ? (
                          <ul className="parsley-errors-list filled">
                              <li>{errors.name}</li>
                          </ul>
                      ): null
                  }
              </div>
              <div className="form-group">
                  <label>Identifier</label>
                  <input type="text"
                         className="form-control"
                         placeholder=""
                         name={'identifier'}
                         value={values.identifier}
                         onChange={handleChange}
                         onBlur={handleBlur}
                  />
                  {
                      touched.identifier && errors.identifier ? (
                          <ul className="parsley-errors-list filled">
                              <li>{errors.identifier}</li>
                          </ul>
                      ): null
                  }
              </div>
              <div className="form-group">
                  <label>Value</label>
                  <input type="text"
                         className="form-control"
                         placeholder=""
                         name={'value'}
                         value={values.value}
                         onChange={handleChange}
                         onBlur={handleBlur}
                  />
                  {
                      touched.value && errors.value ? (
                          <ul className="parsley-errors-list filled">
                              <li>{errors.value}</li>
                          </ul>
                      ): null
                  }
              </div>
              <div className="form-group">
                  <label>Unit Group</label>
                  <select
                         className="form-control"
                         placeholder=""
                         name={'unit_group'}
                         value={values.unit_group}
                         onChange={handleChange}
                         onBlur={handleBlur}
                         defaultChecked={values.unit_group}
                  >
                      {
                          Object.keys(unitGroupList).length === 0 ? (
                              <option value="">-- No unit group --</option>
                          ): (
                             <>
                              <option value=""> == Choose ==</option>
                                 {
                                     unitGroupList.map((opt, index) => {
                                      return <option value={opt._id} key={opt._id}>{opt.name}</option>
                                  })
                                 }
                             </>
                          )
                      }
                  </select>
                  {
                      touched.unit_group && errors.unit_group ? (
                          <ul className="parsley-errors-list filled">
                              <li>{errors.unit_group}</li>
                          </ul>
                      ): null
                  }
              </div>
              <div className="form-group">
                  <div>
                      <button type="submit" className="btn btn-primary waves-effect waves-light">
                          Submit
                      </button>
                      <button type="reset" className="btn btn-danger waves-effect ml-2" onClick={handleClose}>
                          Cancel
                      </button>
                  </div>
              </div>
          </form>

        </Modal.Body>
      </Modal>
      </>
  )
}

export default UnitEditModal;