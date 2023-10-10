module.exports = (req, res, next) => {
  req.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Origin', '*');
  req.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  req.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, authorization');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token, authorization');
  req.header('Content-Type', 'application/json');
  res.header('Content-Type', 'application/json');

  if (req.method === 'POST' && req.path === '/dip') {
    res.json({
      caseId: 2,
      id: 2,
      applicationDraftId: 7,
      loanId: 14
    });
  } else if (req.method === 'POST' && req.path === '/Illustration') {
    res.json({
      caseId: 2,
      applicationDraftId: 7,
      loanId: 14
    });
  } else {
    next();
  }
};
