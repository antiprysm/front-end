import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const ProductReviewForm = () => {
  const tileDepthOptions = {
    Imperial: [
      { key: "1/2", value: 12.7 },
      { key: "3/4", value: 19.05 },
      { key: "1/8", value: 3.175 },
      { key: "3/8", value: 9.525 },
      { key: "Custom", value: 0 },
    ],
    Metric: [
      { key: "12.7", value: 12.7 },
      { key: "19.05", value: 19.05 },
      { key: "3.175", value: 3.175 },
      { key: "9.525", value: 9.525 },
      { key: "Custom", value: 0 },
    ],
  };
  const gapSizeOptions = {
    Imperial: [
      { key: "1/16", value: 1.5 },
      { key: "1/8", value: 3.5 },
      { key: "3/16", value: 4.76 },
      { key: "1/4", value: 6.35 },
      { key: "3/8", value: 9.52 },
      { key: "Custom", value: 0 },
    ],
    Metric: [
      { key: "1.5", value: 1.5 },
      { key: "3.5", value: 3.5 },
      { key: "4.76", value: 4.76 },
      { key: "6.35", value: 6.35 },
      { key: "9.52", value: 9.52 },
      { key: "Custom", value: 0 },
    ],
  };

  const validationSchema = Yup.object({
    // product: Yup.string().required("Please select a product").oneOf(products),
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
    control: "Imperial",
    tile_width: 6,
    tile_height: 7,
    tiles_per_box: 10,
    area_height: 20,
    area_width: 21,
    square_footage: 420,
    gap_size: 3.5,
    tile_depth: 3.175,
    waste: 10,
  };

  const renderError = (message) => <p className="help is-danger">{message}</p>;

  const calculate = ({
    control,
    tile_width,
    tile_height,
    tiles_per_box,
    area_height,
    area_width,
    square_footage,
    gap_size,
    tile_depth,
    waste,
  }) => {
    let thinset, bags, grout, boxes;

    let tileSquareFootage =
      ((tile_width + gap_size / 25.4) / 12) *
      ((tile_height + gap_size / 25.4) / 12);

    console.debug("square footage of one tile", tileSquareFootage);

    let tiles = square_footage / tileSquareFootage;

    console.assert(tiles == 1584, tiles, "Number of tiles: 1584 Tiles");
    console.assert(waste == 10, waste, "Waste: 10 %");
    console.assert(thinset == 22, thinset, "Thinset: 22 lb(s) of thinset");
    console.assert(bags == 1, bags, "Thinset Bags: 1 X 50lb bag(s) of thinset");
    console.assert(grout == 22, grout, "Total Grout Required: 22 lbs of Grout");
    console.assert(boxes == 159, boxes, "Boxes of Tiles: 159");
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      // validationSchema={validationSchema}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        const results = calculate(values);
        console.debug(JSON.stringify(results, null, 2));
      }}
    >
      {({ values }) => (
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
                <div className="control" role="group">
                  <label>
                    <Field
                      name="control"
                      type="radio"
                      className="radio"
                      value="Imperial"
                    />
                    Imperial
                  </label>
                  <label>
                    <Field
                      name="control"
                      type="radio"
                      className="radio"
                      value="Metric"
                    />
                    Metric
                  </label>
                </div>
                <ErrorMessage name="name" render={renderError} />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="">
                Tile Size
              </label>
              <div>
                <div>
                  <div className="control">
                    <Field
                      name="tile_width"
                      type="text"
                      className="input"
                      placeholder="width"
                    />
                    <ErrorMessage name="tile_width" render={renderError} />
                  </div>
                </div>
                <div>
                  <div className="control">
                    <Field
                      name="tile_height"
                      type="text"
                      className="input"
                      placeholder="height"
                    />
                    <ErrorMessage name="tile_height" render={renderError} />
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <div>
                <div
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
                      {tileDepthOptions[values.control].map(
                        ({ key, value }) => (
                          <option key={key} value={value}>
                            {key}
                          </option>
                        )
                      )}
                    </Field>
                    <ErrorMessage name="tile_depth" render={renderError} />
                  </div>
                </div>
                <div
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
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="email">
                Area to Cover
              </label>
              <div>
                <div>
                  <div className="control">
                    <Field
                      name="area_width"
                      type="text"
                      className="input"
                      placeholder="width"
                    />
                    <ErrorMessage name="area_width" render={renderError} />
                  </div>
                </div>
                <div>
                  <div className="control">
                    <Field
                      name="area_height"
                      type="text"
                      className="input"
                      placeholder="height"
                    />
                    <ErrorMessage name="area_height" render={renderError} />
                  </div>
                </div>
              </div>
            </div>
            <div className="field">
              <div>
                <div
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
                </div>
                <div
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
                      {gapSizeOptions[values.control].map(({ key, value }) => (
                        <option key={key} value={value}>
                          {key}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="gap_size" render={renderError} />
                  </div>
                </div>
              </div>
            </div>
            <div className="range">
              <label className="label" htmlFor="range">
                Waste
              </label>
              <div className="range">
                <Field
                  name="waste"
                  as="input"
                  type="range"
                  className="form-control-range"
                  placeholder="waste"
                  min="0"
                  max="20"
                  step=".5"
                />
                <ErrorMessage name="waste" render={renderError} />
              </div>
            </div>
            <button
              id="submitButton"
              type="submit"
              className="button is-primary"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductReviewForm;
