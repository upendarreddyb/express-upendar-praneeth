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

router.post('/question', upload.single('file'), (req, res) => {
  var questiontype = "";
  var cDate = new Date();
  const sql = "insert into  questions (`question_type`,`question`,`subject`, `deficulty_level`,`grade_level`,`option_a`,`option_b`,`option_c`,`option_d`,`cdate`) VALUES (?)";
  req.body.qtype === "Text" ? questiontype = req.body.question : questiontype = req.file.filename;
  const values = [
    req.body.qtype,
    questiontype,
    req.body.subject,
    req.body.deficulty,
    req.body.gradelevel,
    req.body.optionA,
    req.body.optionB,
    req.body.optionC,
    req.body.optionD,
    cDate
  ]
  con.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error creating data:', err.sqlMessage);
      return res.status(201).json({ msg: err.sqlMessage });
    }
    return res.status(200).send({ msg: 'Data added successfully' });
  })
});


router.get('/data', (req, res) => {
  console.log(req.query.qeryfilter);
  console.log(req.query.subject);
  const { page = 1, pageSize = req.query.limit } = req.query;
  const offset = (page - 1) * pageSize;
  var selectQuery = '';
  var queryCount = '';
  if (req.query.subject === 'all' && req.query.qeryfilter === 'all') {
    selectQuery = `SELECT * FROM questions LIMIT ?, ?`;
    queryCount = `SELECT COUNT(*) AS totalCount FROM questions`;
  }
  else if (req.query.subject === 'all' && req.query.qeryfilter != 'all') {
    selectQuery = `SELECT * FROM questions where deficulty_level='${req.query.qeryfilter}' LIMIT ?, ?`;
    queryCount = `SELECT COUNT(*) AS totalCount FROM questions where deficulty_level='${req.query.qeryfilter}' `;

  }
  else if (req.query.subject != 'all' && req.query.qeryfilter === 'all') {
    selectQuery = `SELECT * FROM questions where subject='${req.query.subject}' LIMIT ?, ?`;
    queryCount = `SELECT COUNT(*) AS totalCount FROM questions where  subject='${req.query.subject}' `;

  }
  else if (req.query.subject != 'all' && req.query.qeryfilter != 'all') {
    selectQuery = `SELECT * FROM questions where deficulty_level='${req.query.qeryfilter}' and subject='${req.query.subject}' LIMIT ?, ?`;
    queryCount = `SELECT COUNT(*) AS totalCount FROM questions where deficulty_level='${req.query.qeryfilter}' and subject='${req.query.subject}'`;
    console.log("acvdgscvjsd")
  }

  con.query(selectQuery, [offset, parseInt(pageSize)], (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    con.query(queryCount, (err, countResult) => {
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


router.post('/updatequestion', upload.single('file'), (req, res) => {
  var questiontype = "";
  req.body.qtype === "Text" ? questiontype = req.body.question : questiontype = req.file.filename;
  var cDate = new Date();

  const query = 'update questions set question_type=?,question=?,subject=?,deficulty_level=?,grade_level=?,option_a=?,option_b=?,option_c=?,option_d=?,update_time=? WHERE id = ?';

  con.query(query, [req.body.qtype,questiontype,  req.body.subject,  req.body.deficulty, req.body.gradelevel,req.body.optionA, req.body.optionB,   req.body.optionC, req.body.optionD,cDate,req.body.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating status' });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  });
});

module.exports = router;
