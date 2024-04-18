var express = require('express');
var router = express.Router();
var con = require('../db.js');
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Set your destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post('/uploads', upload.fields([{ name: 'questionfiles' }, { name: 'answerfile' }]), (req, res) => {
    console.log("function called");
    console.log("Question Files:", req.files['questionfiles']); // Array of question files
    console.log("Answer Files:", req.files['answerfile']); // Array of answer files
    var questiontype = "";
    var answertype = "";
    if (req.body.question_type === 'Image') {
        const questionFileNames = req.files['questionfiles'].map(file => file.filename);
        const answerFileNames = req.files['answerfile'].map(file => file.filename);
        const questionFileString = questionFileNames.join(',');
        const answerFileString = answerFileNames.join(',');
        questiontype = questionFileString;
        answertype = answerFileString;
    } else if (req.body.question_type === 'Text') {
        questiontype = req.body.question;
        answertype = req.body.answer;
    }
    const insertQuery = `
    INSERT INTO quiz.questions (curriculum, subject, topic, paper, difficulty_level, season, zone, calculator, grade, question_type, question, answer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.curriculum,
        req.body.subject,
        req.body.topic,
        req.body.paper,
        req.body.difficulty_level,
        req.body.season,
        req.body.zone,
        req.body.calculator,
        req.body.grade,
        req.body.question_type, 
        questiontype, // Comma-separated string of question file names
        answertype // Comma-separated string of answer file names 
    ];

    con.query(insertQuery, values, (error, results) => {
        if (error) {
            console.error('Error inserting question into database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Respond with success message or appropriate response
        res.status(200).json({ message: 'Question inserted into database successfully' });
    });
});



router.post('/addfields', (req, res) => {
    const query = 'insert into  field_values (field_type_id,field) values (?,?)';
    con.query(query, [req.body.fieldetype, req.body.field], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error In Inserting ' });
        } else {
            res.json({ message: 'Inserted Successfully' });
        }
    });
});

router.get('/getfields', (req, res) => {
    selectQuery = `SELECT * FROM field_values`;
    con.query(selectQuery, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Grouping fields by field_type_id with ids and fields as values
        const groupedFields = results.reduce((acc, curr) => {
            const { id, field_type_id, field } = curr;
            if (!acc[field_type_id]) {
                acc[field_type_id] = [];
            }
            acc[field_type_id].push({ id, field });
            return acc;
        }, {});

        res.json({ groupedFields });
    });
});


router.post('/mapfields', (req, res) => {
    const query = 'insert into map_fields (currculium,subject,topic) values (?,?,?)';
    con.query(query, [req.body.curriculum, req.body.subject, req.body.topic], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error In Inserting ' });
        } else {
            res.json({ message: 'Inserted Successfully' });
        }
    });
});




router.get('/getfilters', (req, res) => {
    const query1 = `
    SELECT DISTINCT fv.id AS curriculum_id, fv.field AS currculium
    FROM field_values fv 
    INNER JOIN map_fields mf ON mf.currculium = fv.id;
    `;

    const query2 = `
    SELECT DISTINCT fv.id AS subject_id, mf.currculium AS curriculum_id, fv.field AS subject
    FROM field_values fv 
    INNER JOIN map_fields mf ON mf.subject = fv.id;
    `;

    const query3 = `
    SELECT DISTINCT fv.id AS topic_id, mf.subject AS subject_id, fv.field AS topic
    FROM field_values fv 
    INNER JOIN map_fields mf ON mf.topic = fv.id;
    `;

    // Execute the queries
    con.query(query1, (err1, results1) => {
        if (err1) {
            console.error('Error executing MySQL query 1: ' + err1.stack);
            res.status(500).send('Error retrieving curriculum data from database');
            return;
        }

        con.query(query2, (err2, results2) => {
            if (err2) {
                console.error('Error executing MySQL query 2: ' + err2.stack);
                res.status(500).send('Error retrieving subject data from database');
                return;
            }

            con.query(query3, (err3, results3) => {
                if (err3) {
                    console.error('Error executing MySQL query 3: ' + err3.stack);
                    res.status(500).send('Error retrieving topic data from database');
                    return;
                }

                // Format the results into an array of objects
                const formattedResults = [
                    { curriculums: results1 },
                    { subjects: results2 },
                    { topics: results3 }
                ];

                res.json(formattedResults);
            });
        });
    });
});

router.get('/getquestions', (req, res) => {
    selectQuery = `SELECT * FROM questions`;
    con.query(selectQuery, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ results });
    });
});

module.exports = router;
