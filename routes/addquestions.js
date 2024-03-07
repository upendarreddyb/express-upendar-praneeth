var express = require('express');
var router = express.Router();
var con = require('../db.js');
const multer = require('multer');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/question', upload.single('file'), async (req, res) => {
  var questiontype = "";
  var cDate = new Date();
  const sql = "insert into  questions (`question_type`,`question`,`subject`, `deficulty_level`,`grade_level`,`option_a`,`option_b`,`option_c`,`option_d`,`cdate`) VALUES (?)";
  req.body.qtype === "Text" ? questiontype = req.body.question : questiontype = req.file.filename;
  const values = [
    req.body.qtype,
    questiontype,
    req.body.subject,
    req.body.deficulty,
    req.body.gradelecel,
    req.body.optionA,
    req.body.optionB,
    req.body.optionC,
    req.body.optionD,
    cDate
  ]
  await con.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error creating data:', err.sqlMessage);
      return res.status(201).json({ msg: err.sqlMessage });
    }
    return res.status(200).send({ msg: 'Data added successfully' });
  })
});


router.get('/data', (req, res) => {
  console.log(req.query.qeryfilter);
  const { page = 1, pageSize = req.query.limit } = req.query;
  const offset = (page - 1) * pageSize;
  var selectQuery = '';
  var queryCount = '';
  if (req.query.qeryfilter === 'all') {
    selectQuery = `SELECT * FROM questions LIMIT ?, ?`;
    queryCount = `SELECT COUNT(*) AS totalCount FROM questions`;
  }
  if (req.query.qeryfilter != 'all') {
    selectQuery = `SELECT * FROM questions where deficulty_level='${req.query.qeryfilter}' LIMIT ?, ?`;
    queryCount = `SELECT COUNT(*) AS totalCount FROM questions where deficulty_level='${req.query.qeryfilter}'`;
    console.log(queryCount)
  }

  con.query(selectQuery, [offset, parseInt(pageSize)], (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    con.query(queryCount,(err, countResult) => {
      if (err) {
        console.error('Error getting total count:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const totalCount = countResult[0].totalCount;
      const totalPages = Math.ceil(totalCount / pageSize);
      res.json({ results, totalPages });
    });
  });
});

module.exports = router;
