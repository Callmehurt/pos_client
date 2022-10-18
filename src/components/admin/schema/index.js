import * as Yup from "yup";


export const unitGroupSchema = Yup.object({
   name: Yup.string().min(2).required('Name is required'),
});

export const unitSchema = Yup.object({
    name: Yup.string().min(2).required('Name is required'),
    identifier: Yup.string().required('Identifier is required'),
    value: Yup.string().required('Value is required'),
    unit_group: Yup.string().required('Unit group is required'),
})

export const signUpSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Please enter your name"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

export const productSchema = Yup.object({
    name: Yup.string().min(2).required('Name is required'),
    category: Yup.string().required('Category is required'),
    unitGroup: Yup.string().required('Unit Group is required'),
    assignedUnit: Yup.string().required('Unit is required'),
    salePrice: Yup.number().min(1).required('Selling price is required').positive().integer().typeError('Selling price should be positive number'),
    lowQuantity: Yup.number().min(1).required('Low Quantity is required').positive().integer().typeError('Quantity should be positive number'),
})

export const categorySchema = Yup.object({
    name: Yup.string().min(2).required('Name is required'),
    mediaId: Yup.string().required('Media is required'),
})

export const providerSchema = Yup.object({
    name: Yup.string().min(2).required('Name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email format')
})

export const procurementSchema = Yup.object({
    // name: Yup.string().min(2).required('Name is required'),
    // invoiceDate: Yup.string().required('Invoice date is required'),
    // provider: Yup.string().required('Provider is required'),
    products: Yup.array().min(1)
})