import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {Formik, Form, useField, useFormikContext} from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Network from "../classes/Network"
import axios from "axios";

//import "../../css/styles.css";
//import "../../css/styles-custom.css";

const MyTextInput = ({label, ...props}) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

const MyCheckbox = ({children, ...props}) => {
    const [field, meta] = useField({...props, type: "checkbox"});
    return (
        <>
            <label className="checkbox">
                <input {...field} {...props} type="checkbox"/>
                {children}
            </label>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

// Styled components ....
const StyledSelect = styled.select`
  color: var(--blue);
`;

const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin-top: 0.25rem;
  &:before {
    content: "❌ ";
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`;

const StyledLabel = styled.label`
  margin-top: 1rem;
`;

const MySelect = ({label, ...props}) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
            <StyledSelect {...field} {...props} />
            {meta.touched && meta.error ? (
                <StyledErrorMessage>{meta.error}</StyledErrorMessage>
            ) : null}
        </>
    );
};

// And now we can use these
const SignupForm = () => {
    return (
        <>
            <div className={"dataForm"}>
                <h2>Sign up</h2>
                <div>
                    We need some personal information* in order to create your hirefly account.
                </div>
                <div>
                    You already have an account? Please <Link to={"/login"}>login</Link> here.
                </div>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        acceptedTerms: false, // added for our checkbox
                        jobType: "" // added for our select
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string()
                            .max(20, "Must be 20 characters or less")
                            .required("Required"),
                        email: Yup.string()
                            .email("Invalid email addresss`")
                            .required("Required"),
                        password: Yup.string()
                            .min(6, "Must contain at least 6 characters")
                            .max(60, "Must be 60 characters or less")
                            .required("Required"),
                        acceptedTerms: Yup.boolean()
                            .required("Required")
                            .oneOf([true], "You must accept the terms and conditions."),
                        jobType: Yup.string()
                            // specify the set of valid values for job type
                            // @see http://bit.ly/yup-mixed-oneOf
                            .oneOf(
                                ["designer", "development", "product", "other"],
                                "Invalid Job Type"
                            )
                            .required("Required")
                    })}
                    onSubmit={(values, {setSubmitting}) => {
                        setTimeout(() => {
                            let callback = function (response) {
                                console.log("trying to log in with newly created credentials");
                                console.log(values);
                                axios.post(`/auth/login`, values).then(result => {
                                    if (result.data.token) {
                                        console.log("authentication request granted.");
                                        window.location.href = 'dashboard?token=' + result.data.token.replace('Bearer ', '', 1);
                                    } else {
                                        console.warn("authentication request rejected.");
                                    }
                                })
                                console.debug(response);
                            }
                            let errorCallback = function (error) {
                                console.error(error.response);
                            }
                            new Network().callApi("/auth/register", values, "POST", callback, errorCallback);
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    <Form>
                        <MyTextInput
                            label="Your Name"
                            name="name"
                            type="text"
                            placeholder="Jane Doe"
                        />
                        <MyTextInput
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="jane@hirefly.de"
                        />
                        <MyTextInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="A secure password"
                        />
                        <MySelect label="Job Type" name="jobType">
                            <option value="">Select a job type</option>
                            <option value="designer">Designer</option>
                            <option value="development">Developer</option>
                            <option value="product">Product Manager</option>
                            <option value="other">Other</option>
                        </MySelect>
                        <div>
                            <MyCheckbox name="acceptedTerms">
                                I accept the terms and conditions
                            </MyCheckbox>
                        </div>

                        <Button variant="contained" color="secondary" type="submit">Sign up</Button>
                    </Form>
                </Formik>
                <div>
                    * No worries: Your personal information will be kept in a safe place and we will not use it for any
                    purpose
                    other than to maintain your account.
                </div>
            </div>
        </>
    );
};

/*
function App() {
    return <SignupForm />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
*/
export default SignupForm;