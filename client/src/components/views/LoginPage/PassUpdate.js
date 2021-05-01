// Password update page

import React from "react";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import { changePass, registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";

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

function PassUpdate(props) {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        oldPassword: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object().shape({
        oldPassword: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
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
            email: props.user.userData.email,
            oldPassword: values.oldPassword,
            password: values.password,
          };

          dispatch(changePass(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              alert("Password update successful!");
              props.history.push("/");
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
            <h2>Change your Password</h2>
            <Form
              style={{ minWidth: "375px" }}
              {...formItemLayout}
              onSubmit={handleSubmit}
            >
              <Form.Item
                required
                label="Current Password"
                hasFeedback
                validateStatus={
                  errors.oldPassword && touched.oldPassword
                    ? "error"
                    : "success"
                }
              >
                <Input
                  id="oldPassword"
                  placeholder="Enter your Current Password"
                  type="password"
                  value={values.oldPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.oldPassword && touched.oldPassword
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.oldPassword && touched.oldPassword && (
                  <div className="input-feedback">{errors.oldPassword}</div>
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
                  <div className="input-feedback">{errors.confirmPassword}</div>
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
  );
}

export default PassUpdate;
