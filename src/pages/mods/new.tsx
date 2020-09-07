import React, { useState, useEffect } from "react"
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react"
import Layout from "../../components/layout"
import { Formik, Form, Field, useField } from "formik"
import * as Yup from "yup"
import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { RouteComponentProps } from "@reach/router"
import { ALL_MODS } from "./index"

const INSERT_MOD = gql`
  mutation MyMutation($title: String, $description: String) {
    insert_mod(objects: { title: $title, description: $description }) {
      affected_rows
    }
  }
`
const ModSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  description: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
})

const MyTextInput = ({ label, name }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField(name)
  return (
    <>
      <label className="text-sm text-gray-600 mt-4" htmlFor={name}>
        {label}
      </label>
      <input
        className="px-4 py-2 rounded border-gray-400 border block"
        {...field}
        name={name}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </>
  )
}

const ModPage: React.FC<RouteComponentProps> = () => {
  const { user, isLoading, getAccessTokenSilently } = useAuth0()

  const [insertMod, { data, loading }] = useMutation(INSERT_MOD, {
    refetchQueries: [{ query: ALL_MODS }],
  })

  const submitForm = async values => {
    const token = await getAccessTokenSilently({
      audience: "https://moved-ferret-33.hasura.app/v1/graphql",
    })
    insertMod({
      context: { headers: { authorization: `Bearer ${token}` } },
      variables: { title: values.title, description: values.description },
    })
  }
  return (
    <>
      <h1>Create new mod</h1>
      <Formik
        initialValues={{
          title: "",
          description: "",
        }}
        validationSchema={ModSchema}
        onSubmit={submitForm}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <MyTextInput label="Mod Name" name="title" />
            <MyTextInput label="Mod Description" name="description" />
            <button
              className="px-4 py-2 mt-4 rounded bg-blue-600 text-blue-100"
              type="submit"
            >
              Submit
            </button>
            {isSubmitting && <p>Submitting..</p>}
          </Form>
        )}
      </Formik>
    </>
  )
}

export default withAuthenticationRequired(ModPage)
