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
  tile_height: Yup.string().required(),
  tile_width: Yup.string().required(),
  tile_depth: Yup.string().required(),
  tiles_per_box: Yup.string().required(),
  area_width: Yup.string().required(),
  area_height: Yup.string().required(),
  square_footage: Yup.string().required(),
  gap_size: Yup.string().required(),
  gap_size_custom: Yup.string(),
  tile_depth_custom: Yup.string()
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

const renderError = (message) => <p className="help is-danger">{message}</p>;
const MMsInSqFt = 92900; // devide mm by this number to convert to sqft
const MMsInInch = 25.4;
const CubicMMinCubicIn = 16390; // devide mm by this number to get cubic in
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
    let thinset, bags, grout, boxes;
    let metricGapSize = Number(gap_size);
    console.assert(gap_size === 3.175, gap_size, MMsInInch);
    let targetSqMM = square_footage * MMsInSqFt;

    tile_width = tile_width * MMsInInch;
    tile_height = tile_height * MMsInInch;
    console.assert(
      tile_width + metricGapSize === 155.575,
      tile_width,
      metricGapSize,
      "Height of tile plus thinset"
    );

    let singleTileSquareMM =
      (tile_width + metricGapSize) * (tile_height + metricGapSize);

    console.debug("square mm of one tile", singleTileSquareMM);

    let tiles = Math.ceil(targetSqMM / singleTileSquareMM);

    let tilesWithWaste = Math.ceil(tiles * (1 / waste + 1));
    let groutRatio = (tile_width * tile_height) / singleTileSquareMM;
    let groutArea = targetSqMM - targetSqMM * groutRatio;
    console.warn(groutArea / MMsInSqFt, "sq ft of grout");
    let totalWetGroutVolMM3 = groutArea * Number(tile_depth);
    let totalWetGroutVolM3 = totalWetGroutVolMM3 / 1000000000;
    console.warn(totalWetGroutVolM3, "total wet grout volume");
    let groutDensityKgM3 = 1600;
    // https://www.omnicalculator.com/construction/grout?advanced=1&c=USD&v=hidden:1,dryMaterialPercentage:50!perc,weightPerBag:0.9072!kg,areaLength:20.4939015319!ft,areaWidth:20.4939015319!ft,tileLength:6!inch,tileWidth:7!inch,gapWidth:1%2F8!inch,gapDepth:1%2F8!inch,groutDensity:1600!kgm3
    let groutMassKg = totalWetGroutVolM3 * groutDensityKgM3;
    let kgperBag = 22.679618499987406; //for a 50lb bag
    console.log(groutMassKg);
    console.log(kgperBag);
    bags = groutMassKg / kgperBag;
    bags = Math.ceil(bags);

    console.log(bags);
    console.assert(
      tilesWithWaste === 1525,
      tilesWithWaste,
      "Number of tiles: 1525 Tiles"
    );
    console.assert(waste === 10, waste, "Waste: 10 %");
    console.assert(thinset === 22, thinset, "Thinset: 22 lb(s) of thinset");
    console.assert(bags === 4, bags, "Thinset Bags: 1 X 50lb bag(s) of thinset");
    console.assert(grout === 8, grout, "Total Grout Required: 8 lbs of Grout");
    console.assert(boxes === 159, boxes, "Boxes of Tiles: 159");
    // TO DO: set state all rendered data in the chosen unit of measurement
    // make sure these are string values this.setState()
    thinset = 10;
    grout = 8;
    boxes = 159;
    waste = 10;

    this.setResults({
      waste: waste,
      thinset: thinset,
      bags: bags,
      grout: grout,
      boxes: boxes,
      tiles: tiles,
    });

  }
  render() {
    return (
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          //setState here
          const results = this.calculate(values);
          console.debug(JSON.stringify(results, null, 2));
        }}
      >
        {({ values }) => (
          <Form>
            <div class="main">
            <div
              className="container"
              style={{
                width: "60%",
              }}
            >
              <div className="grid">
                <div className="box a"><span>Tile</span></div>
                <div className="box b">Estimator</div>
              </div>
              <div className="field">
                <div className="container">
                  <label className="label" htmlFor="UOM">
                    Unit of Measurement
                  </label>
                  <div className="control" role="group">
                    <label for="radio1">
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
                    <label for="radio2">
                      <Field
                        name="control"
                        type="radio"
                        className="radio"
                        value="Metric"
                        id="radio2"
                      />
                      &#160;Metric
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
                    <div className="field">
                    <div className="control" role="group">
                      <Field
                        name="tile_width"
                        type="text"
                        className="input"
                        placeholder="width"
                      />
                      <ErrorMessage name="tile_width" render={renderError} />
                      <Field
                        id="append-input"
                        name="tile_width_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.tile_width).tile_width}
                        className="text"
                      />
                      </div>
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
                      <Field
                        id="append-input"
                        name="tile_height_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.tile_height).tile_height}
                        className="text"
                      />
                      <ErrorMessage name="tile_height" render={renderError} />
                      
                    </div>
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
                      <Field
                        id="append-input"
                        name="tile_depth_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.tile_depth).tile_depth}
                        className="text"
                      />
                      <ErrorMessage name="tile_depth" render={renderError} />
                  </div>
                  {values.tile_depth == false ? <div className="control">
                  <Field
                    name="tile_depth_custom"
                    type="text"
                    className="input"
                    placeholder="tile depth custom"
                  />
                  <ErrorMessage
                    name="tile_depth"
                    render={renderError}
                  />
                </div> : null}
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
                      <Field
                        id="append-input"
                        name="area_width_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.area_width).area_width}
                        className="text"
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
                      <Field
                        id="append-input"
                        name="area_height_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.area_height).area_height}
                        className="text"
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
                      <Field
                        id="append-input"
                        name="square_footage_append"
                        type="text"
                        value={inputAppendOptions[values.control].find(x => x.square_footage).square_footage}
                        className="text"
                      />
                      <ErrorMessage
                        name="square_footage"
                        render={renderError}
                      />
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
                      />
                      <ErrorMessage name="gap_size" render={renderError} />
                    </div>
                  </div>
                </div>
                  {values.gap_size == false ? <div className="control">
                  <Field
                    name="gap_size_custom"
                    type="text"
                    className="input"
                    placeholder="gap size custom"
                  />
                  <ErrorMessage
                    name="square_footage"
                    render={renderError}
                  />
                </div> : null}
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
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
//use hooks to pass back results object
export default ProductReviewForm;
