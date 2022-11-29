import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const ProductReviewForm = () => {


  const tileDepthOptions = {
    imp:["1/2", "3/4", "1/8", "3/8", "Custom"],
    met:["12.7", "19.05", "3.175", "9.525", "Custom"]
};
  const gapSizeOptions = {
    imp:["1/16", "1/8", "3/16", "1/4", "3/8", "Custom"],
    met: ["1.5", "3.5", "4.76", "6.35", "9.52", "Custom"]
  }

  const validationSchema = Yup.object({
    // product: Yup.string().required("Please select a product").oneOf(products),
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    title: Yup.string().required(),
    review: Yup.string().required(),
    rating: Yup.number().min(1).max(10).required(),
    date: Yup.date().default(() => new Date()),
    wouldRecommend: Yup.boolean().default(false),
    tile_height: Yup.string().required(),
    tile_width: Yup.string().required(),
    tile_depth: Yup.string().required(),
    tiles_per_box: Yup.string().required(),
    area_width: Yup.string().required(),
    area_height: Yup.string().required(),
    square_footage: Yup.string().required(),
    gap_size: Yup.string().required(),
  });

  const initialValues = {
    name: "",
    email: "",
    title: "",
    review: "",
    rating: "",
    date: new Date(),
    wouldRecommend: true,
    product: "",
  };

  const onSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  const renderError = (message) => <p className="help is-danger">{message}</p>;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        await onSubmit(values);
        resetForm();
      }}
    >
      <Form>
        <div
          className="container"
          style={{
            width: "60%",
          }}
        >
          <div className="field">
            <div className="container">
              <label className="label" htmlFor="UOM">
                Unit of Measurement
              </label>
              <div className="control">
                <Field
                  name="uomRadio"
                  type="radio"
                  className="radio"
                  placeholder="Imperial"
                  value="Imperial"
                  checked="True"
                />{" "}
                Imperial
                <Field
                  name="uomRadio"
                  type="radio"
                  className="radio"
                  placeholder="Metric"
                  value="Metric"
                />{" "}
                Metric
              </div>
              <ErrorMessage name="name" render={renderError} />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="">
              Tile Size
            </label>
            <table>
              <tr>
                <td>
                  <div className="control">
                    <Field
                      name="tile_width"
                      type="text"
                      className="input"
                      placeholder="width"
                    />
                    <ErrorMessage name="tile_width" render={renderError} />
                  </div>
                </td>
                <td>
                  <div className="control">
                    <Field
                      name="tile_height"
                      type="text"
                      className="input"
                      placeholder="height"
                    />
                    <ErrorMessage name="tile_height" render={renderError} />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="field">
            <table>
              <tr>
                <td
                  style={{
                    width: "50%",
                  }}
                >
                  <label className="label" htmlFor="product">
                    Tile Depth
                  </label>
                  <div className="control">
                    <Field
                      name="tile_depth"
                      as="select"
                      className="select is-fullwidth"
                    >
                      <option value={""}>Select a size</option>
                      <option>1/2</option>
                      <option>3/4</option>
                      <option>1/8</option>
                      <option>3/8</option>
                      <option>Custom</option>
                    </Field>
                    <ErrorMessage name="tile_depth" render={renderError} />
                  </div>
                </td>
                <td
                  style={{
                    width: "50%",
                  }}
                >
                  <label className="label" htmlFor="product">
                    Tiles Per Box
                  </label>
                  <div className="control">
                    <Field
                      name="tiles_per_box"
                      type="text"
                      className="input"
                      placeholder="tiles per box"
                    />
                    <ErrorMessage name="tiles_per_box" render={renderError} />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="field">
            <label className="label" htmlFor="email">
              Area to Cover
            </label>
            <table>
              <tr>
                <td>
                  <div className="control">
                    <Field
                      name="area_width"
                      type="text"
                      className="input"
                      placeholder="width"
                    />
                    <ErrorMessage name="area_width" render={renderError} />
                  </div>
                </td>
                <td>
                  <div className="control">
                    <Field
                      name="area_height"
                      type="text"
                      className="input"
                      placeholder="height"
                    />
                    <ErrorMessage name="area_height" render={renderError} />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="field">
            <table>
              <tr>
                <td
                  style={{
                    width: "50%",
                  }}
                >
                  <label className="label" htmlFor="product">
                    Sq Footage
                  </label>
                  <div className="control">
                    <Field
                      name="square_footage"
                      type="text"
                      className="input"
                      placeholder="tiles per box"
                    />
                    <ErrorMessage name="square_footage" render={renderError} />
                  </div>
                </td>
                <td
                  style={{
                    width: "50%",
                  }}
                >
                  <label className="label" htmlFor="product">
                    Gap Size
                  </label>
                  <div className="control">
                    <Field
                      name="gap_size"
                      as="select"
                      className="select is-fullwidth"
                    >
                      <option value={""}>Select a size</option>
                      <option>1/16</option>
                      <option>1/8</option>
                      <option>3/16</option>
                      <option>1/4</option>
                      <option>3/8</option>
                      <option>Custom</option>
                    </Field>
                    <ErrorMessage name="gap_size" render={renderError} />
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="range">
            <label className="label" htmlFor="range">
              Waste
            </label>
            <div className="range">
              <Field
                name="waste"
                as="waste"
                className="form-control-range"
                placeholder="waste"
                min="0"
                max="20"
                step=".5"
              />
              <ErrorMessage name="review" render={renderError} />
            </div>
          </div>
          <button type="submit" className="button is-primary">
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default ProductReviewForm;
