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
    media: Yup.string().required('Media is required'),
})

export const categorySchema = Yup.object({
    name: Yup.string().min(2).required('Name is required'),
    media: Yup.string().required('Media is required'),
})