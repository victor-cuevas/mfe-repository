"use strict";
exports.handler = async (event, context, callback) => {
  //Get contents of response and request
  const response = event.Records[0].cf.response;
  const headers = response.headers;
  const request = event.Records[0].cf.request;
  const reqHeaders = request.headers;
  const requestOrigin = request.origin.s3.domainName;

  const {
    "custom-csp-src": [{ value: cspSrc }],
    "custom-stage": [{ value: stage }],
    "custom-id": [{ value: id }],
  } = reqHeaders;

  const validOrigins = new RegExp(
    `^${stage}-(.+-)${id}.s3.eu-west-1.amazonaws.com$`
  );

  //Set new headers
  headers["strict-transport-security"] = [
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubdomains; preload",
    },
  ];
  headers["content-security-policy"] = [
    {
      key: "Content-Security-Policy",
      value: cspSrc,
    },
  ];
  headers["x-content-type-options"] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
  ];
  headers["x-frame-options"] = [{ key: "X-Frame-Options", value: "DENY" }];
  headers["x-xss-protection"] = [
    { key: "X-XSS-Protection", value: "1; mode=block" },
  ];
  headers["referrer-policy"] = [
    { key: "Referrer-Policy", value: "same-origin" },
  ];

  if (validOrigins.test(requestOrigin)) {
    delete headers["access-control-allow-origin"];
    delete headers["Access-Control-Allow-Origin"];
    headers["access-control-allow-origin"] = [{ value: "*" }];
  }

  //Return modified response
  callback(null, response);
};
