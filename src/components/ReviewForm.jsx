import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const inputAppendOptions = {
  Imperial: [
    {"tile_width": 'in'},
    {"tile_height": 'in'},
    {"tile_depth": 'in'},
    {"area_height": 'ft'},
    {"area_width": 'ft'},
    {"square_footage": 'ft2'},
    {"gap_size": 'in'}
  ],
  Metric: [
    {"tile_width": 'cm'},
    {"tile_height": 'cm'},
    {"tile_depth": 'mm'},
    {"area_height": 'm'},
    {"area_width": 'm'},
    {"square_footage": 'm2'},
    {"gap_size": 'mm'}
  ]
}

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
    { key: "1/8", value: 3.175 },
    { key: "3/16", value: 4.76 },
    { key: "1/4", value: 6.35 },
    { key: "3/8", value: 9.52 },
    { key: "Custom", value: 0 },
  ],
  Metric: [
    { key: "1.5", value: 1.5 },
    { key: "3.175", value: 3.175 },
    { key: "4.76", value: 4.76 },
    { key: "6.35", value: 6.35 },
    { key: "9.52", value: 9.52 },
    { key: "Custom", value: 0 },
  ],
};

const validationSchema = Yup.object({
  // product: Yup.string().required("Please select a product").oneOf(products),
  tile_height: Yup.number().required()
  .moreThan(0, "Invalid input").positive().typeError('A number is required'),
  tile_width: Yup.number().required()
  .moreThan(0, "Invalid input")
  .positive().typeError('A number is required'),
  tile_depth: Yup.number().required(),
  tiles_per_box: Yup.number().required().moreThan(0, "Invalid input").typeError('A number is required'),
  area_width: Yup.number().required().moreThan(0, "Invalid input").positive().typeError('A number is required'),
  area_height: Yup.number().required().moreThan(0, "Invalid input").positive().typeError('A number is required'),
  square_footage: Yup.number().moreThan(0, "Invalid input").positive().required().typeError('A number is required'),
  gap_size: Yup.number().required(),
  gap_size_custom: Yup.number(),
  tile_depth_custom: Yup.number().positive().moreThan(0, "Invalid input").typeError('A number is required')
});

const initialValues = {
  control: "Imperial",
  tile_width: 6,
  tile_height: 7,
  tiles_per_box: 10,
  area_height: 20,
  area_width: 21,
  square_footage: 420,
  gap_size: 3.175,
  tile_depth: 3.175,
  waste: 10,
  gap_size_custom: 0
};
const renderError = (message) => <div className="help is-danger">{message}</div>;
const MMsInSqFt = 92900; // divide mm by this number to convert to sqft
const MMsInInch = 25.4;
const CubicMMinCubicIn = 16390; // divide mm by this number to get cubic in
const isMetric = (control) => control === "Metric";
class ProductReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.setResults = props.setResults;
  }

  calculate({
    control,
    tile_width,
    tile_height,
    tiles_per_box,
    area_height,
    area_width,
    square_footage,
    gap_size, // already in metric
    tile_depth, // also in metric
    waste,
    gap_size_custom
  }) { 
    debugger;
    if (gap_size_custom > 0) {
      gap_size = gap_size_custom
    };
    let tileArea = tile_width * tile_height;
    let atC = area_height * area_width;
    let tiles = control === 'Imperial' ? atC / (tileArea / 144) : atC / (tileArea / 10000);
    let groutVolume = control === 'Imperial' ? Number(((atC % tiles) * (tile_depth * gap_size) / 100).toFixed(2)) : Number(((atC % tiles) * (tile_depth * gap_size) / 1600).toFixed(2));
    let grout = control === 'Imperial' ? Number((((atC * (tile_depth / 12)) / groutVolume)*10).toFixed(2)) : Number(((((atC * (tile_depth / 100)) / groutVolume))).toFixed(2));
    let tpB = Math.ceil(tiles / tiles_per_box);
    let thinset = control === 'Imperial' ? atC * (.125 / 144) : atC * (.3175 / 10000);
    
    tiles = Number((tiles + (tiles * (waste / 100))).toFixed(2));
    thinset = Number((thinset + (thinset * (waste / 100))).toFixed(2));
    grout = Number((grout + (grout * (waste / 100))).toFixed(2));


    this.setResults({
      control: control,
      tiles: tiles,
      thinset: thinset,
      groutVolume: groutVolume,
      grout: grout,
      tpB: tpB,
    });
  }
  render() {
    return (
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          const results = this.calculate(values);
          console.debug(JSON.stringify(results, null, 2));
        }}
      >
        {({ values }) => (
          <Form>
            <div className="main">
            <div
              className="container"
            >
            <div className="grid">
                <div className="box a"><span>Tile</span></div>
                <div className="box b">Estimator</div>
              </div>
              <div className="field">
        
                  <label className="label" htmlFor="UOM">
                    Unit of Measurement
                  </label>
                  <div className="control" role="group">
                    <label htmlFor="radio1">
                      <Field
                        name="control"
                        type="radio"
                        className="radio"
                        value="Imperial"
                        id="radio1"
                      />
                     &#160;Imperial
                    </label>
                    <br></br>
                    &#160;&#160;&#160;
                    <label htmlFor="radio2">
                      <Field
                        name="control"
                        type="radio"
                        className="radio"
                        value="Metric"
                        id="radio2"
                      />
                      &#160;Metric
                    </label>
            
                  <ErrorMessage name="control" render={renderError} />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="">
                  Tile Size
                </label>
                <div className="inputGrid">
                  <div className="inputBox">
                    <div className="inputA">
                    <div className="control" role="group">
                      <Field
                        name="tile_width"
                        type="number"
                        className="input prepend"
                        placeholder="width"
                      />
                      
                      
                      <Field
                        id="append-input"
                        name="tile_width_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.tile_width).tile_width}
                        className="text"
                        disabled={true}
                      />
                      
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="inputBox">
                    <div className="inputB">
                    <div className="control">
                      <Field
                        name="tile_height"
                        type="number"
                        className="input prepend"
                        placeholder="height"
                      />
                      <Field
                        id="append-input"
                        name="tile_height_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.tile_height).tile_height}
                        className="text"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="inputGrid">
              <div className="inputBox">
                <div className="inputA helpA">
                <ErrorMessage name="tile_width" render={renderError}/>
                </div>
              </div>
            </div>
            <div className="inputBox">
              <div className="inputB">
              <ErrorMessage name="tile_height" render={renderError} />
              </div>
            </div>
          </div>
              <div className="field">
                <div>
                    <label className="label" htmlFor="product">
                      Tile Depth
                    </label>
                    <div className="control">
                      <Field
                        name="tile_depth"
                        as="select"
                        className="select is-fullwidth prepend"
                      >
                        {tileDepthOptions[values.control].map(
                          ({ key, value }) => (
                            <option key={key} value={value}>
                              {key}
                            </option>
                          )
                        )}
                      </Field>
                      <Field
                        id="append-input"
                        name="tile_depth_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.tile_depth).tile_depth}
                        className="text"
                        disabled={true}
                      />
                      <ErrorMessage name="tile_depth" render={renderError} />
                  </div>
                  <div className="field">
                  {values.tile_depth == false ? <div className="control">
                  <Field
                    name="tile_depth_custom"
                    type="text"
                    className="input"
                    placeholder="tile depth custom"
                  />
                </div> : null} 
                <ErrorMessage
                    name="tile_depth_custom"
                    render={renderError}
                  />
                  </div>
                    <label className="label" htmlFor="product">
                      Tiles Per Box
                    </label>
                    <div className="control">
                      <Field
                        name="tiles_per_box"
                        type="number"
                        className="input"
                        placeholder="tiles per box"
                      />
                      <ErrorMessage name="tiles_per_box" render={renderError} />
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="email">
                  Area to Cover
                </label>
                <div>
                <div className="inputGrid">
                  <div className="inputBox">
                    <div className="inputA">
                    <div className="control">
                      <Field
                        name="area_width"
                        type="number"
                        className="input prepend"
                        placeholder="width"
                      />
                      
                      
                      <Field
                        id="append-input"
                        name="area_width_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.area_width).area_width}
                        className="text"
                        disabled={true}
                      />
                      </div>
                    </div>
                  </div>
                    <div className="inputBox">
                      <div className="inputB">
                    <div className="control">
                      <Field
                        name="area_height"
                        type="number"
                        className="input prepend"
                        placeholder="height"
                      />
                      <Field
                        id="append-input"
                        name="area_height_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.area_height).area_height}
                        className="text"
                        disabled={true}
                      />
                      
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ErrorMessage name="area_width" render={renderError} />
                <ErrorMessage name="area_height" render={renderError} />
              </div>
              <div className="field">
                    <label className="label" htmlFor="product">
                      Sq Footage
                    </label>
                    <div className="control">
                      <Field
                        name="square_footage"
                        type="number"
                        className="input prepend"
                        placeholder="tiles per box"
                      />
                      <Field
                        id="append-input"
                        name="square_footage_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.square_footage).square_footage}
                        className="text"
                        disabled={true}
                      />
                      <ErrorMessage
                        name="square_footage"
                        render={renderError}
                      />
                    </div>
                    </div>
                    <div className="field">
                    <label className="label" htmlFor="product">
                      Gap Size
                    </label>
                    <div className="control">
                      <Field
                        name="gap_size"
                        as="select"
                        className="select is-fullwidth prepend"
                      >
                        {gapSizeOptions[values.control].map(
                          ({ key, value }) => (
                            <option key={key} value={value}>
                              {key}
                            </option>
                          )
                        )}
                      </Field>
                      <Field
                        id="append-input"
                        name="gap_size_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.gap_size).gap_size}
                        className="text"
                        disabled={true}
                      />
                      <ErrorMessage name="gap_size" render={renderError} />
                    </div>
                    </div>
                  {values.gap_size == false ? <div className="control">
                  <Field
                    name="gap_size_custom"
                    type="number"
                    className="input"
                    placeholder="gap size custom"
                  />
                   <ErrorMessage name="gap_size_custom" render={renderError} />
                </div> : null}
             
              <div className="field">
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
              </div>
              <div className="field">
              <button
                id="submitButton"
                type="submit"
                className="button is-primary"
              >
                Submit
              </button>
              </div>
            </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
//use hooks to pass back results object
export default ProductReviewForm;
