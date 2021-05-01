// Password reset page

import React, { useState } from "react";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import { resetPass } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import axios from "axios";

import { Form, Input, Button } from "antd";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const secChoices = [
  "What was the house number you lived in as a child?",
  "What were the last four digits of your childhood telephone number?",
  "What primary school did you attend?",
  "In what town or city was your first full time job?",
  "In what town or city did you meet your spouse or partner?",
];
function ResetPass(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState({ gotEmail: false, email: "" });
  const [SecChoice, setSecChoice] = useState(0);

  return (
    <>
      {!Email.gotEmail && (
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Email is invalid")
              .required("Email is required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              let dataToSubmit = {
                email: values.email,
              };
              axios
                .post(`/api/users/resetPassCheck`, dataToSubmit)
                .then((response) => {
                  console.log(response);
                  if (response.data.emailFound) {
                    setSecChoice(response.data.secChoice);
                    setEmail({ gotEmail: true, email: values.email });
                  } else {
                    alert("The email you entered is not registered");
                  }
                });
                setSubmitting(false);
            }, 500);
          }}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            } = props;
            return (
              <div className="app">
                <h2>Reset your Password</h2>
                <Form
                  style={{ minWidth: "375px" }}
                  {...formItemLayout}
                  onSubmit={handleSubmit}
                >
                  <Form.Item
                    required
                    label="Email"
                    hasFeedback
                    validateStatus={
                      errors.email && touched.email ? "error" : "success"
                    }
                  >
                    <Input
                      id="email"
                      placeholder="Enter your Email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}
                  </Form.Item>

                  <Form.Item {...tailFormItemLayout}>
                    <Button
                      onClick={handleSubmit}
                      type="primary"
                      disabled={isSubmitting}
                    >
                      Next
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            );
          }}
        </Formik>
      )}
      {Email.gotEmail && (
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
            secChoice: 0,
            secAnswer: "",
          }}
          validationSchema={Yup.object().shape({
            secChoice: Yup.number(),
            secAnswer: Yup.string()
              .min(4, "Answer must be at least 4 characters")
              .required("Answer the question"),
            password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Confirm Password is required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              let dataToSubmit = {
                secAnswer: values.secAnswer,
                email: Email.email,
                password: values.password,
              };

              dispatch(resetPass(dataToSubmit)).then((response) => {
                console.log(response);

                if (response.payload.success) {
                  alert("Password reset successful!");
                  props.history.push("/login");
                } else {
                  alert(response.payload.message);
                }
              });

              setSubmitting(false);
            }, 500);
          }}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            } = props;
            return (
              <div className="app">
                <h2>Reset your Password</h2>
                <Form
                  style={{ minWidth: "375px" }}
                  {...formItemLayout}
                  onSubmit={handleSubmit}
                >
                  <br />

                  <span style={{ marginLeft: "11%", whiteSpace: "nowrap" }}>
                    <label style={{ color: "black" }}>
                      Security Question:{" "}
                    </label>
                    {secChoices[SecChoice]}
                  </span>

                  <Form.Item
                    required
                    label="Answer"
                    style={{ marginTop: "3%" }}
                  >
                    <Input
                      id="secAnswer"
                      placeholder="Answer"
                      type="text"
                      value={values.secAnswer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.secAnswer && touched.secAnswer
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.secAnswer && touched.secAnswer && (
                      <div className="input-feedback">{errors.secAnswer}</div>
                    )}
                  </Form.Item>

                  <Form.Item
                    required
                    label="New Password"
                    hasFeedback
                    validateStatus={
                      errors.password && touched.password ? "error" : "success"
                    }
                  >
                    <Input
                      id="password"
                      placeholder="Enter your New Password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.password && touched.password
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
                    )}
                  </Form.Item>

                  <Form.Item required label="Confirm" hasFeedback>
                    <Input
                      id="confirmPassword"
                      placeholder="Confirm Your New Password"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.confirmPassword && touched.confirmPassword
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="input-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </Form.Item>

                  <Form.Item {...tailFormItemLayout}>
                    <Button
                      onClick={handleSubmit}
                      type="primary"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            );
          }}
        </Formik>
      )}
    </>
  );
}

export default ResetPass;
